import {Origin} from 'aurelia-metadata';
import {Container} from 'aurelia-dependency-injection';
import {CompositionEngine} from 'aurelia-templating';
import {DialogController} from './dialog-controller';
import {DialogRenderer} from './dialog-renderer';
import {invokeLifecycle} from './lifecycle';
import {Alert} from './models/alert';

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
      return this.compositionEngine.ensureViewModel(instruction);
    }

    return Promise.resolve(instruction);
  }

  createViewModel(Controller, settings, instruction) {
    var controller;
    return new Promise((resolve, reject) => {
      controller     = new Controller(this.renderer, settings, resolve, reject);
      instruction.childContainer.registerInstance(Controller, controller);

      return this._getViewModel(instruction).then(
        (returnedInstruction) => this.renderer.activateLifecycle(controller, returnedInstruction, instruction.model, resolve)
      );
    });
  }

  open(_settings) {
    let viewModel = _settings.viewModel;
    let model     = _settings.model;
    let container = this.container;
    let settings  = Object.assign({}, this.defaultSettings, _settings, this.config);
    let instruction = {
      viewModel: _settings.viewModel,
      container: this.container,
      childContainer: this.container.createChild(),
      model: _settings.model
    };
    return this.createViewModel(DialogController, settings, instruction);
  }

  alert(_settings) {
    return this.open({
      viewModel: Alert,
      model:_settings
    })
  }

  close() {}
}
