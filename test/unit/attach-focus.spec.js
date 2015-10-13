import {AttachFocus} from '../../src/attach-focus';
import {Container} from 'aurelia-dependency-injection';
import {templatingEngine} from 'aurelia-templating';
import {initialize, DOM} from 'aurelia-pal-browser';

let element = document.createElement('div');

describe('modal gets focused when attached', () => {
  var attachFocus,
    container;

  beforeEach(() => {
    initialize();
    container = new Container();
    container.registerInstance(DOM.Element, element);
    jasmine.clock().install();
    templatingEngine.initialize(container);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should call the focus method when attached', done => {
    attachFocus = templatingEngine.createModelForUnitTest(AttachFocus);
    spyOn(element, 'focus').and.callThrough();
    attachFocus.attached();
    jasmine.clock().tick(1);
    expect(element.focus).toHaveBeenCalled();
    done();
  });
});
