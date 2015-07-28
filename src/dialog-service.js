import {Origin} from 'aurelia-metadata';
import {Container} from 'aurelia-dependency-injection';
import {CompositionEngine} from 'aurelia-templating';
import {DialogController} from './dialog-controller';
import {DialogRenderer} from './dialog-renderer';
import {invokeLifecycle} from './lifecycle';

export class DialogService {
  static inject = [Container, CompositionEngine, DialogRenderer];

  constructor(container, compositionEngine, renderer){
    this.container = container;
    this.compositionEngine = compositionEngine;
    this.renderer = renderer;
  }

  _getViewModel(instruction){
    if(typeof instruction.viewModel === 'function'){
      instruction.viewModel = Origin.get(instruction.viewModel).moduleId;
    }

    if(typeof instruction.viewModel === 'string'){
      return this.compositionEngine.createViewModel(instruction);
    }else{
      return Promise.resolve(instruction);
    }
  }

  open(settings){
    settings =  Object.assign({}, this.renderer.defaultSettings, settings);

    return new Promise((resolve, reject) => {
      var childContainer = this.container.createChild(),
          controller = new DialogController(this.renderer, settings, resolve, reject),
          instruction = {
            viewModel:settings.viewModel,
            container:this.container,
            childContainer:childContainer,
            model:settings.model
          };

      childContainer.registerInstance(DialogController, controller);

      return this._getViewModel(instruction).then(instruction => {
        controller.viewModel = instruction.viewModel;

        return invokeLifecycle(instruction.viewModel, 'canActivate', settings.model).then(canActivate => {
          if(canActivate){
            return this.compositionEngine.createBehavior(instruction).then(behavior => {
              controller.behavior = behavior;
              controller.view = behavior.view;
              behavior.view.bind(behavior.executionContext);

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
