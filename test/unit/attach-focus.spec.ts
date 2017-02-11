import {StageComponent} from 'aurelia-testing';
import {bootstrap} from 'aurelia-bootstrapper';

describe('modal gets focused when attached', () => {
  let component: any;
  let viewModel: any;

  class ViewModel {
    public first: any;
  }

  beforeEach(() => {
    viewModel = new ViewModel();
  });

  describe('when using attribute without .bind', () => {
    beforeEach(() => {
      component = StageComponent
        .withResources('dist/test/src/attach-focus')
        .inView('\
          <div>\
            <input attach-focus="true" ref="noValueEl" />\
          </div>')
        .boundTo(viewModel);
    });

    it('sets focus to no value element', done => {
      component.create(bootstrap).then(() => {
        expect(document.activeElement).toBe(viewModel.noValueEl);
        done();
      });
    });
  });

  describe('when binding to vm property', () => {
    beforeEach(() => {
      component = StageComponent
        .withResources('dist/test/src/attach-focus')
        .inView('\
          <div>\
            <input attach-focus.bind="first" ref="firstEl" />\
            <input attach-focus.bind="!first" ref="secondEl" />\
          </div>')
        .boundTo(viewModel);
    });

    it('sets focus to first element when true', done => {
      viewModel.first = true;
      component.create(bootstrap).then(() => {
        expect(document.activeElement).toBe(viewModel.firstEl);
        done();
      });
    });

    it('sets focus to second element when false', done => {
      viewModel.first = false;
      component.create(bootstrap).then(() => {
        expect(document.activeElement).toBe(viewModel.secondEl);
        done();
      });
    });
  });

  afterEach(() => {
    component.dispose();
  });
});
