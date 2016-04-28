import {DialogRenderer} from '../../src/renderers/dialog-renderer';
import {dialogOptions} from '../../src/dialog-options';
import {configure} from '../../src/aurelia-dialog';

let defaultSettings = {
  lock: true,
  centerHorizontalOnly: false,
  startingZIndex: 1000,
  showDialogTimeout: 250
};
let newSettings = {
  lock: false,
  centerHorizontalOnly: true,
  startingZIndex: 1,
  showDialogTimeout: 300
};

let frameworkConfig = {
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

  it('allows overriding the default settings', () => {
    let callback = (config) => {
      config.settings = Object.assign(dialogOptions, newSettings);
    };

    configure(frameworkConfig, callback);
    let renderer = new DialogRenderer();

    expect(renderer.defaultSettings).toEqual(newSettings);
  });
});
