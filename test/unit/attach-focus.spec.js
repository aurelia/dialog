import {AttachFocus} from '../../src/attach-focus';
import {Container} from 'aurelia-dependency-injection';
import {BehaviorInstance} from 'aurelia-templating';

Element = {};

describe('modal gets focused when attached', () => {
  var attachFocus;

  beforeEach(() => {
    new Container().makeGlobal();
  });
  it('should call the attached method', () => {
    // attachFocus = BehaviorInstance.createForUnitTest(AttachFocus);
    // spyOn(attachFocus, 'attached').and.returnValue('blue');
  });
});
