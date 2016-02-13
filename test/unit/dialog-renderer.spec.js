import {DialogRenderer} from '../../src/dialog-renderer';
import {DialogController} from '../../src/dialog-controller';
import {Container} from 'aurelia-dependency-injection';
import {configure} from '../../src/index';

let element = document.createElement('div');
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
    registerInstance: (type, callback) => {},
    get: (type) => { return new type(); }
  }
};

describe('the Dialog Renderer', () => {
  let renderer,
    container,
    controller;

  beforeEach(() => {
    container = new Container().makeGlobal();
    container.registerInstance(Element, element);
    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('uses the default settings', done => {
    renderer = new DialogRenderer();
    expect(renderer.defaultSettings).toEqual(defaultSettings);
    done();
  });

  it('allows overriding the default settings', done => {
    let callback = (globalSettings) => {
      Object.assign(globalSettings, newSettings);
    }
    configure(frameworkConfig, callback);
    renderer = new DialogRenderer();
    let dialogController = new DialogController(renderer);
    expect(renderer.defaultSettings).toEqual(newSettings);
    done();
  });

  xit('calls the corresponding controller methods', done => {
    renderer = new DialogRenderer();
    controller = new DialogController(renderer);
    renderer.createDialogHost(controller);
    spyOn(controller, 'showDialog');
    spyOn(controller, 'hideDialog');
    spyOn(controller, 'destroyDialogHost');
    renderer.showDialog(controller);
    expect(controller.showDialog).toHaveBeenCalled();
    expect(controller.hideDialog).toHaveBeenCalled();
    expect(controller.destroyDialogHost).toHaveBeenCalled();
    done();
  });
});

