import {Origin} from 'aurelia-metadata';
import {Container} from 'aurelia-dependency-injection';
import {CompositionEngine, ViewSlot} from 'aurelia-templating';
import {DialogController} from './dialog-controller';
import {Renderer} from './renderer';
import {invokeLifecycle} from './lifecycle';
import {dialogOptions} from './dialog-options';
import {DialogSettings, OpenDialogResult, CloseDialogResult} from './interfaces';

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
  open(settings?: DialogSettings) {
    let childContainer = this.container.createChild();
    let dialogController;
    let closeResult: Promise<CloseDialogResult> = new Promise((resolve, reject) => {
      dialogController = new DialogController(childContainer.get(Renderer), _createSettings(settings), resolve, reject);
    });
    childContainer.registerInstance(DialogController, dialogController);

    closeResult.then(() => {
      _removeController(this, dialogController);
    }, () => {
      _removeController(this, dialogController);
    });

    let openResult: Promise<OpenDialogResult> = _getViewModel(this.container, this.compositionEngine, childContainer, dialogController)
      .then((instruction) => {
        dialogController.viewModel = instruction.viewModel;
        dialogController.slot = instruction.viewSlot;

        return invokeLifecycle(dialogController.viewModel, 'canActivate', dialogController.settings.model).then(canActivate => {
          if (canActivate) {
            return this.compositionEngine.compose(instruction).then(controller => {
              this.controllers.push(dialogController);
              this.hasActiveDialog = !!this.controllers.length;
              dialogController.controller = controller;
              dialogController.view = controller.view;

              return dialogController.renderer.showDialog(dialogController).then(() => {
                return {
                  wasCancelled: false,
                  controller: dialogController,
                  closeResult
                };
              });
            });
          }

          return {
            wasCancelled: true // see aurelia/dialog#223
          };
        });
      });

    return {
      openResult,
      closeResult
    };
  }
}

function _createSettings(settings) {
  settings = Object.assign({}, dialogOptions, settings);
  settings.startingZIndex = dialogOptions.startingZIndex; // should be set only when configuring the plugin
  return settings;
}

function _getViewModel(container, compositionEngine, childCOntainer, dialogController) {
  let host = dialogController.renderer.getDialogContainer();
  let instruction = {
    container: service.container,
    childContainer: childContainer,
    model: dialogController.settings.model,
    view: dialogController.settings.view,
    viewModel: dialogController.settings.viewModel,
    viewSlot: new ViewSlot(host, true),
    host: host
  };

  if (typeof instruction.viewModel === 'function') {
    instruction.viewModel = Origin.get(instruction.viewModel).moduleId;
  }

  if (typeof instruction.viewModel === 'string') {
    return compositionEngine.ensureViewModel(instruction);
  }

  return Promise.resolve(instruction);
}

function _removeController(service, controller) {
  let i = service.controllers.indexOf(controller);
  if (i !== -1) {
    service.controllers.splice(i, 1);
    service.hasActiveDialog = !!service.controllers.length;
  }
}
