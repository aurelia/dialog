import {Origin} from 'aurelia-metadata';
import {Container} from 'aurelia-dependency-injection';
import {CompositionEngine} from 'aurelia-templating';
import {DialogController} from './dialog-controller';
import {DialogRenderer} from './dialog-renderer';
import {invokeLifecycle} from './lifecycle';

export class DialogService {
  static inject = [Container, CompositionEngine, DialogRenderer];

  constructor(container, compositionEngine, renderer) {
    this.container = container;
    this.compositionEngine = compositionEngine;
    this.renderer = renderer;
  }

  _getViewModel(instruction) {
    if (typeof instruction.viewModel === 'function') {
      instruction.viewModel = Origin.get(instruction.viewModel).moduleId;
    }

    if (typeof instruction.viewModel === 'string') {
      return this.compositionEngine.createViewModel(instruction);
    }

    return Promise.resolve(instruction);
  }

  open(settings) {
    let _settings =  Object.assign({}, this.renderer.defaultSettings, settings);

    return new Promise((resolve, reject) => {
      let childContainer = this.container.createChild();
      let controller = new DialogController(this.renderer, _settings, resolve, reject);
      let instruction = {
        viewModel: _settings.viewModel,
        container: this.container,
        childContainer: childContainer,
        model: _settings.model
      };

      childContainer.registerInstance(DialogController, controller);

      return this._getViewModel(instruction).then(returnedInstruction => {
        controller.viewModel = returnedInstruction.viewModel;

        return invokeLifecycle(returnedInstruction.viewModel, 'canActivate', _settings.model).then(canActivate => {
          if (canActivate) {
            return this.compositionEngine.createBehavior(returnedInstruction).then(behavior => {
              controller.behavior = behavior;
              controller.view = behavior.view;
              behavior.view.bind(behavior.bindingContext);

              return this.renderer.createDialogHost(controller).then(() => {
                return this.renderer.showDialog(controller);
              });
            });
          }
        });
      });
    });
  }
}
