import {AttachFocus} from '../../src/attach-focus';
import {Container} from 'aurelia-dependency-injection';
import {TemplatingEngine} from 'aurelia-templating';
import {initialize} from 'aurelia-pal-browser';
import {DOM} from 'aurelia-pal';

let element = document.createElement('div');

describe('modal gets focused when attached', () => {
  let attachFocus;
  let container;
  let templatingEngine;

  beforeEach(() => {
    initialize();
    container = new Container();
    container.registerInstance(DOM.Element, element);
    jasmine.clock().install();
    templatingEngine = container.get(TemplatingEngine);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should call the focus method when attached', done => {
    attachFocus = templatingEngine.createViewModelForUnitTest(AttachFocus);
    spyOn(element, 'focus').and.callThrough();
    attachFocus.attached();
    jasmine.clock().tick(1);
    expect(element.focus).toHaveBeenCalled();
    done();
  });
});
