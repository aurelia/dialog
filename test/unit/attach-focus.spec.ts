import '../setup';
import { bootstrap } from 'aurelia-bootstrapper';
import { Container } from 'aurelia-dependency-injection';
import { Aurelia, PLATFORM } from 'aurelia-framework';
import { TaskQueue } from 'aurelia-task-queue';
import { StageComponent, ComponentTester } from 'aurelia-testing';

describe('attach-focus', () => {
  class ViewModel {
    public first: any;
    public focusTargetElement: Element;
    public hasFocus: boolean;
  }

  let component: ComponentTester;
  let viewModel: ViewModel;

  function setupView(component: ComponentTester, attachFocusFragment: string): void {
    component.inView(`
      <div>
        <input ${attachFocusFragment} ref="focusTargetElement">
      </div>
    `);
  }

  beforeEach(() => {
    viewModel = new ViewModel();
    component = StageComponent
      .withResources(PLATFORM.moduleName('src/resources/attach-focus'))
      .boundTo(viewModel);
    component.bootstrap((aurelia: Aurelia) => aurelia.use.basicConfiguration());
  });

  describe('without binding command', () => {
    describe('sets focus', () => {
      it('without value', done => {
        setupView(component, 'attach-focus');
        component.create(bootstrap).then(() => {
          expect(document.activeElement).toBe(viewModel.focusTargetElement);
          done();
        }, done.fail);
      });

      it('when the value is "true"', done => {
        setupView(component, 'attach-focus="true"');
        component.create(bootstrap).then(() => {
          expect(document.activeElement).toBe(viewModel.focusTargetElement);
          done();
        }, done.fail);
      });
    });

    it('does not set focus when the value is "false"', done => {
      setupView(component, 'attach-focus="false"');
      component.create(bootstrap).then(() => {
        expect(document.activeElement).not.toBe(viewModel.focusTargetElement);
        done();
      }, done.fail);
    });
  });

  describe('with binding command', () => {
    beforeEach(() => {
      setupView(component, 'attach-focus.bind="hasFocus"');
    });

    it('sets focus when the value is "true"', done => {
      viewModel.hasFocus = true;
      component.create(bootstrap).then(() => {
        expect(document.activeElement).toBe(viewModel.focusTargetElement);
        done();
      }, done.fail);
    });

    it('does not set focus when the value is "false"', done => {
      viewModel.hasFocus = false;
      component.create(bootstrap).then(() => {
        expect(document.activeElement).not.toBe(viewModel.focusTargetElement);
        done();
      }, done.fail);
    });
  });

  it('sets focus only in ".attached"', done => {
    setupView(component, 'attach-focus.to-view="hasFocus"');
    viewModel.hasFocus = false;
    component.create(bootstrap).then(() => {
      expect(document.activeElement).not.toBe(viewModel.focusTargetElement);
      viewModel.hasFocus = true;
      (Container.instance.get(TaskQueue) as TaskQueue).flushMicroTaskQueue();
      expect(document.activeElement).not.toBe(viewModel.focusTargetElement);
      done();
    }, done.fail);
  });

  afterEach(() => {
    component.dispose();
  });
});
