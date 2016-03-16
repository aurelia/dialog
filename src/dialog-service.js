import {Container} from 'aurelia-dependency-injection';
import {CompositionEngine} from 'aurelia-templating';
import {DialogController} from './dialog-controller';
import {DialogRenderer} from './dialog-renderer';
import {getViewModel, invokeLifecycle} from './dialog-utilities';

export class DialogService {
  static inject = [Container, CompositionEngine, DialogRenderer];

  constructor(container: Container, compositionEngine, renderer) {
    this.container = container;
    this.compositionEngine = compositionEngine;
    this.renderer = renderer;
  }

  open(settings) {
    let _settings =  Object.assign({}, this.renderer.defaultSettings, settings);

    return new Promise((resolve, reject) => {
      let childContainer = this.container.createChild();
      let dialogController = new DialogController(this.renderer, _settings, resolve, reject);
      let instruction = {
        viewModel: _settings.viewModel,
        container: this.container,
        childContainer: childContainer,
        model: _settings.model
      };

      childContainer.registerInstance(DialogController, dialogController);

      let controllerInstruction;
      return getViewModel(instruction, this.compositionEngine)
        .then(returnedInstruction => {
          controllerInstruction = returnedInstruction;
          dialogController.viewModel = controllerInstruction.viewModel;
          return invokeLifecycle(controllerInstruction.viewModel, 'canActivate', _settings.model);
        })
        .then(canActivate => !canActivate ? null :
          this.compositionEngine.createController(controllerInstruction)
            .then(controller => {
              dialogController.controller = controller;
              dialogController.view = controller.view;
              controller.automate();
              return this.renderer.createDialogHost(dialogController);
            })
            .then(() => this.renderer.showDialog(dialogController))
        );
    });
  }
}
