import {DialogRenderer} from '../../src/dialog-renderer';
import {DialogController} from '../../src/dialog-controller';
import {Container} from 'aurelia-dependency-injection';

let element = document.createElement('div');

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

