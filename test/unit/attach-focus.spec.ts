import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { Aurelia } from 'aurelia-framework';

describe('modal gets focused when attached', () => {
  let component: any;
  let viewModel: any;

  class ViewModel {
    public first: any;
  }

  beforeEach(() => {
    viewModel = new ViewModel();
    component = StageComponent
      .withResources('dist/test/src/attach-focus')
      .boundTo(viewModel);
    component.bootstrap((aurelia: Aurelia) => aurelia.use.basicConfiguration());
  });

  describe('when using attribute without .bind', () => {
    beforeEach(() => {
      component.inView(`
        <div>
          <input attach-focus="true" ref="noValueEl" />
        </div>
      `);
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
      component.inView(`
        <div>
          <input attach-focus.bind="first" ref="firstEl" />
          <input attach-focus.bind="!first" ref="secondEl" />
        </div>
      `);
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
