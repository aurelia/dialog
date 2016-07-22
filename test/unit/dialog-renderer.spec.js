import {DialogController} from '../../src/dialog-controller';
import {DialogRenderer} from '../../src/dialog-renderer';
import {dialogOptions} from '../../src/dialog-options';
import {configure} from '../../src/aurelia-dialog';
import {TestElement} from '../fixtures/test-element';

let defaultSettings = {
  lock: true,
  centerHorizontalOnly: false,
  startingZIndex: 1000,
  ignoreTransitions: false
};
let newSettings = {
  lock: false,
  centerHorizontalOnly: true,
  startingZIndex: 1,
  ignoreTransitions: false
};

let frameworkConfig = {
  transient: () => {},
  globalResources: () => {},
  container: {
    registerInstance: (Type, callback) => {},
    get: (type) => { return new Type(); }
  }
};

describe('the Dialog Renderer', () => {
  it('uses the default settings', () => {
    let renderer = new DialogRenderer();
    expect(renderer.defaultSettings).toEqual(defaultSettings);
  });

  it('calls position if specified', (done) => {
    const settings = {
      viewModel: TestElement,
      position: (modalContainer, modalOverlay) => {
        expect(modalContainer.tagName).toBe('AI-DIALOG-CONTAINER');
        expect(modalOverlay.tagName).toBe('AI-DIALOG-OVERLAY');
        done();
      }
    };

    let renderer = new DialogRenderer();
    let controller = new DialogController(renderer, settings, Function.prototype, Function.prototype);
    controller.slot = {
      attached: Function.prototype,
      anchor: document.createElement('ai-dialog')
    };

    renderer.showDialog(controller);
  });

  it('allows overriding the default settings', () => {
    let callback = (config) => {
      config.settings = Object.assign(dialogOptions, newSettings);
    };

    configure(frameworkConfig, callback);
    let renderer = new DialogRenderer();

    expect(renderer.defaultSettings).toEqual(newSettings);
  });
});
