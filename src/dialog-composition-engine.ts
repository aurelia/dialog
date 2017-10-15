import { Container } from 'aurelia-dependency-injection';
import { Origin } from 'aurelia-metadata';
import { CompositionContext, CompositionEngine, ViewSlot } from 'aurelia-templating';
import { DialogSettings } from './dialog-settings';
import { invokeLifecycle } from './lifecycle';
import { createDialogCancelError } from './dialog-cancel-error';
import { createDialogCloseError } from './dialog-close-error';
import { DialogOpenResult } from './dialog-result';
import { DialogController } from './dialog-controller';
import { InfrastructureDialogController } from './infrastructure-dialog-controller';

interface DialogCompositionInstruction {
    context: CompositionContext;
    controller: InfrastructureDialogController;
}

function canActivate(instruction: DialogCompositionInstruction): Promise<DialogCompositionInstruction> {
    if (!instruction.context.viewModel) { return Promise.resolve(instruction); }
    return invokeLifecycle(instruction.context.viewModel, 'canActivate', instruction.controller.settings.model)
        .then(canActivate => {
            if (canActivate) { return instruction; }
            throw createDialogCancelError();
        });
}

/**
 * @internal
 */
export class DialogCompositionEngine {
    public static inject = [Container, CompositionEngine];
    constructor(
        private container: Container,
        private compositionEngine: CompositionEngine
    ) { }

    public createDialogController(container: Container, settings: DialogSettings): InfrastructureDialogController {
        const controller = container.invoke(DialogController, [settings]);
        container.registerInstance(DialogController, controller);
        return controller;
    }

    public createCompositionContext(
        childContainer: Container,
        controller: InfrastructureDialogController
    ): CompositionContext {
        const hostElement = controller.renderer.getDialogContainer();
        const context: CompositionContext = {
            container: childContainer.parent,
            childContainer,
            bindingContext: null,
            overrideContext: null,
            viewResources: null as any,
            model: controller.settings.model,
            view: controller.settings.view,
            viewModel: controller.settings.viewModel,
            viewSlot: new ViewSlot(hostElement, true),
            host: hostElement
        };
        if (typeof context.viewModel === 'function') {
            const moduleId = Origin.get(context.viewModel).moduleId;
            if (!moduleId) {
                throw new Error(`Can not resolve "moduleId" of "${context.viewModel.name}".`);
            }
            context.viewModel = moduleId;
        }
        if (!context.viewModel) {
            // provide access to the dialog controller for view only dialogs
            context.bindingContext = { controller };
        }
        return context;
    }

    public createCompositionInstruction(
        childContainer: Container,
        settings: DialogSettings
    ): DialogCompositionInstruction {
        const controller = this.createDialogController(childContainer, settings);
        return {
            controller,
            context: this.createCompositionContext(childContainer, controller)
        };
    }

    public ensureViewModel(instruction: DialogCompositionInstruction): Promise<DialogCompositionInstruction> {
        if (typeof instruction.context.viewModel === 'string') {
            return this.compositionEngine.ensureViewModel(instruction.context).then(() => instruction);
        }
        return Promise.resolve(instruction);
    }

    public initializeDialogController(
        instruction: DialogCompositionInstruction
    ): Promise<DialogCompositionInstruction> {
        const result = this.compositionEngine.compose(instruction.context);
        return result.then(controllerOrView => {
            instruction.controller.initialize(controllerOrView, instruction.context.viewSlot);
            return instruction;
        });
    }

    public showDialog(instruction: DialogCompositionInstruction): Promise<DialogOpenResult> {
        return instruction.controller.show().catch(reason => {
            return instruction.controller.deactivate(createDialogCloseError(reason))
                .then(() => Promise.reject(reason));
        });
    }

    public compose(settings: DialogSettings): Promise<DialogOpenResult> {
        const childContainer = settings.childContainer || this.container.createChild();
        const instruction = this.createCompositionInstruction(childContainer, settings);
        return this.ensureViewModel(instruction)
            .then(canActivate)
            .then(instruction => this.initializeDialogController(instruction))
            .then(instruction => this.showDialog(instruction));
    }
}
