import {AttachFocus} from '../../src/attach-focus';
import {Container} from 'aurelia-dependency-injection';
import {BehaviorInstance} from 'aurelia-templating';

let element = document.createElement('div');

describe('modal gets focused when attached', () => {
  var attachFocus,
    container;

  beforeEach(() => {
    container = new Container().makeGlobal();
    container.registerInstance(Element, element);
    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should call the attached method', done => {
    attachFocus = BehaviorInstance.createForUnitTest(AttachFocus);
    spyOn(element, 'focus').and.callThrough();
    attachFocus.attached();
    jasmine.clock().tick(1);
    expect(element.focus).toHaveBeenCalled();
    done();
  }); 
});
