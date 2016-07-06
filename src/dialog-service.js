import {Origin} from 'aurelia-metadata';
import {Container} from 'aurelia-dependency-injection';
import {CompositionEngine, ViewSlot} from 'aurelia-templating';
import {DialogController} from './dialog-controller';
import {Renderer} from './renderer';
import {invokeLifecycle} from './lifecycle';
import {DialogResult} from './dialog-result';

/**
 * A service allowing for the creation of dialogs.
 */
export class DialogService {
  static inject = [Container, CompositionEngine];

  /**
   * The current dialog controllers
   */
  controllers: DialogController[];
  /**
   * Is there an active dialog
   */
  hasActiveDialog: boolean;
  
  constructor(container: Container, compositionEngine: CompositionEngine) {
    this.container = container;
    this.compositionEngine = compositionEngine;
    this.controllers = [];
    this.hasActiveDialog = false;
  }

  /**
   * Opens a new dialog.
   * @param settings Dialog settings for this dialog instance.
   * @return Promise A promise that settles when the dialog is closed.
   */
  open(settings?: Object): Promise<DialogResult> {
    let dialogController;

    let promise = new Promise((resolve, reject) => {
      let childContainer = this.container.createChild();
      dialogController = new DialogController(childContainer.get(Renderer), settings, resolve, reject);
      childContainer.registerInstance(DialogController, dialogController);
      let host = dialogController.renderer.getDialogContainer();

      let instruction = {
        container: this.container,
        childContainer: childContainer,
        model: dialogController.settings.model,
        view: dialogController.settings.view,
        viewModel: dialogController.settings.viewModel,
        viewSlot: new ViewSlot(host, true),
        host: host
      };

      return _getViewModel(instruction, this.compositionEngine).then(returnedInstruction => {
        dialogController.viewModel = returnedInstruction.viewModel;
        dialogController.slot = returnedInstruction.viewSlot;

        return invokeLifecycle(dialogController.viewModel, 'canActivate', dialogController.settings.model).then(canActivate => {
          if (canActivate) {
            this.controllers.push(dialogController);
            this.hasActiveDialog = !!this.controllers.length;

            return this.compositionEngine.compose(returnedInstruction).then(controller => {
              dialogController.controller = controller;
              dialogController.view = controller.view;

              return dialogController.renderer.showDialog(dialogController);
            });
          }
        });
      });
    });

    return promise.then((result) => {
      let i = this.controllers.indexOf(dialogController);
      if (i !== -1) {
        this.controllers.splice(i, 1);
        this.hasActiveDialog = !!this.controllers.length;
      }

      return result;
    });
  }
}

function _getViewModel(instruction, compositionEngine) {
  if (typeof instruction.viewModel === 'function') {
    instruction.viewModel = Origin.get(instruction.viewModel).moduleId;
  }

  if (typeof instruction.viewModel === 'string') {
    return compositionEngine.ensureViewModel(instruction);
  }

  return Promise.resolve(instruction);
}
