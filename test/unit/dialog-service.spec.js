import {DialogService} from '../../src/dialog-service';
import {Renderer} from '../../src/renderer';
import {Container} from 'aurelia-dependency-injection';
import {CompositionEngine, BindingLanguage} from 'aurelia-templating';
import {TestElement} from '../fixtures/test-element';
import {Loader} from 'aurelia-loader';
import {DefaultLoader} from 'aurelia-loader-default';
import {TemplatingBindingLanguage} from 'aurelia-templating-binding';
import {dialogOptions} from '../../src/dialog-options';

describe('the Dialog Service', () => {
  let dialogService;
  let container;
  let compEng;
  let renderer;
  
  beforeEach(() => {
    renderer = {
      showDialog: function() {
        return Promise.resolve();
      },
      getDialogContainer: function() {
        return document.createElement('div');
      }
    };

    container = new Container();
    container.registerSingleton(Loader, DefaultLoader);
    container.registerSingleton(BindingLanguage, TemplatingBindingLanguage);
    container.registerAlias(BindingLanguage, TemplatingBindingLanguage);
    container.registerInstance(Renderer, renderer);

    compEng = container.get(CompositionEngine);
    dialogService = new DialogService(container, compEng, renderer);
  });

  it('uses the default settings', (done) => {
    spyOn(renderer, 'showDialog').and.callFake((dialogController) => {
      expect(dialogController.settings).toEqual(jasmine.objectContaining(dialogOptions));
      done();
    });

    dialogService.open({ viewModel: TestElement });
  });

  it('allows overriding the default settings', (done) => {
    const newSettings = {
      lock: !dialogOptions.lock,
      centerHorizontalOnly: !dialogOptions.centerHorizontalOnly,
      // startingZIndex: 1, // should be overrided only when configuring the plugin
      ignoreTransitions: !dialogOptions.ignoreTransitions
    };

    spyOn(renderer, 'showDialog').and.callFake((dialogController) => {
      expect(dialogController.settings).toEqual(jasmine.objectContaining(newSettings));
      done();
    });

    dialogService.open(Object.assign({}, newSettings, { viewModel: TestElement }));
  });

  it('does not allow overriding "startingZIndex"', (done) => {
    spyOn(renderer, 'showDialog').and.callFake((dialogController) => {
      expect(dialogController.settings).toEqual(jasmine.objectContaining(dialogOptions));
      done();
    });

    dialogService.open({ startingZIndex: 1, viewModel: TestElement });
  });

  it('open with a model settings applied', (done) => {
    const settings = { viewModel: TestElement };

    spyOn(renderer, 'showDialog').and.callFake((dialogController) => {
      done();
    });

    dialogService.open(settings);
  });

  it('reports no active dialog if no dialog is open', () => {
    const settings = { viewModel: TestElement };

    spyOn(renderer, 'showDialog').and.callFake((dialogController) => {
      dialogController.cancel();
      done();
    });

    expect(dialogService.hasActiveDialog).toBe(false);

    dialogService.open(settings)
      .then(() => {
        expect(dialogService.hasActiveDialog).toBe(false);
        done();
      });
  });

  it('reports an active dialog if a dialog is open', (done) => {
    const settings = { viewModel: TestElement };

    spyOn(renderer, 'showDialog').and.callFake((dialogController) => {
      expect(dialogService.hasActiveDialog).toBe(true);
      done();
    });

    dialogService.open(settings);
  });

  it('".open" properly propagates errors', (done) => {
    let catchWasCalled = false;
    let promise = dialogService.open({ viewModel: 'test/fixtures/non-existent' })
      .catch(() => {
        catchWasCalled = true;
      }).then(() => {
        expect(catchWasCalled).toBe(true);
        done();
      });
  });

  it('".openAndYieldController" properly propagates errors', (done) => {
    let catchWasCalled = false;
    dialogService.openAndYieldController({ viewModel: 'test/fixtures/non-existent' })
      .catch(() => {
        catchWasCalled = true;
      }).then(() => {
        expect(catchWasCalled).toBe(true);
        done();
      });
  });
});
