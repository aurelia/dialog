import {Container} from 'aurelia-dependency-injection';
import {TemplatingEngine} from 'aurelia-templating';
import {DOM} from 'aurelia-pal';
import {StageComponent} from 'aurelia-testing';
import {bootstrap} from 'aurelia-bootstrapper';

let element = document.createElement('div');

describe('modal gets focused when attached', () => {
  let component;
  let attachFocus;
  let container;
  let templatingEngine;
  let viewModel;

  class ViewModel {
    first;
  }

  beforeEach(() => {
    viewModel = new ViewModel();
  });

  describe('when using attribute without .bind', () => {
    beforeEach(() => {
      component = StageComponent
        .withResources('src/attach-focus')
        .inView('\
          <div>\
            <input attach-focus="true" ref="noValueEl" />\
          </div>')
        .boundTo(viewModel);
    });

    it('sets focus to no value element', (done) => {
      component.create(bootstrap).then(() => {
        expect(document.activeElement).toBe(viewModel.noValueEl);
        done();
      });
    });
  });

  describe('when binding to vm property', () => {
    beforeEach(() => {
      component = StageComponent
        .withResources('src/attach-focus')
        .inView('\
          <div>\
            <input attach-focus.bind="first" ref="firstEl" />\
            <input attach-focus.bind="!first" ref="secondEl" />\
          </div>')
        .boundTo(viewModel);
    });

    it('sets focus to first element when true', (done) => {
      viewModel.first = true;
      component.create(bootstrap).then(() => {
        expect(document.activeElement).toBe(viewModel.firstEl);
        done();
      });
    });

    it('sets focus to second element when false', (done) => {
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
