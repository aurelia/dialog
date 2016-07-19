import {AttachFocus} from '../../src/attach-focus';
import {Container} from 'aurelia-dependency-injection';
import {TemplatingEngine} from 'aurelia-templating';
import {DOM} from 'aurelia-pal';

let element = document.createElement('div');

describe('modal gets focused when attached', () => {
  let attachFocus;
  let container;
  let templatingEngine;

  beforeEach(() => {
    container = new Container();
    container.registerInstance(DOM.Element, element);
    jasmine.clock().install();
    templatingEngine = container.get(TemplatingEngine);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  xit('should call the focus method when attached without value', () => {
    attachFocus = templatingEngine.createViewModelForUnitTest(AttachFocus);
    spyOn(element, 'focus').and.callThrough();
    attachFocus.attached();
    jasmine.clock().tick(1);
    expect(element.focus).toHaveBeenCalled();
  });

  xit('should call the focus method when attached to true value', () => {
    attachFocus = templatingEngine.createViewModelForUnitTest(AttachFocus);
    attachFocus.value = true;
    spyOn(element, 'focus').and.callThrough();
    attachFocus.attached();
    jasmine.clock().tick(1);
    expect(element.focus).toHaveBeenCalled();
  });

  xit('should not call the focus method when attached to false value', () => {
    attachFocus = templatingEngine.createViewModelForUnitTest(AttachFocus);
    attachFocus.value = false;
    spyOn(element, 'focus').and.callThrough();
    attachFocus.attached();
    jasmine.clock().tick(1);
    expect(element.focus).not.toHaveBeenCalled();
  });
});
