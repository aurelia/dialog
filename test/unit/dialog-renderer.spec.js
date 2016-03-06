import {DialogRenderer} from '../../src/dialog-renderer';
import {configure} from '../../src/index';

let defaultSettings = {
  lock: true,
  centerHorizontalOnly: false,
  startingZIndex: 1000
};
let newSettings = {
  lock: false,
  centerHorizontalOnly: true,
  startingZIndex: 1
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
    let callback = (globalSettings) => {
      Object.assign(globalSettings, newSettings);
    };

    configure(frameworkConfig, callback);
    let renderer = new DialogRenderer();

    expect(renderer.defaultSettings).toEqual(newSettings);
  });
});

