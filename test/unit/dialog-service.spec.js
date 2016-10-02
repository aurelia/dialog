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
      showDialog: function () {
        return Promise.resolve();
      },
      hideDialog: function () {
        return Promise.resolve();
      },
      getDialogContainer: function () {
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

  it('reports no active dialog if no dialog is open', (done) => {
    const settings = { viewModel: TestElement };

    spyOn(renderer, 'showDialog').and.callFake((dialogController) => {
      expect(dialogService.hasActiveDialog).toBe(true);
      dialogController.cancel();
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

    expect(dialogService.hasActiveDialog).toBe(false);
    dialogService.open(settings);
  });

  it('reports an active dialog after it has been activated', (done) => {
    // the cotroller should be added to .controllers after the result of .activate() has settled
    // if there is activate
    const viewModel = new TestElement();
    viewModel.canActivate = function () { };
    viewModel.activate = function () { };
    const settings = { viewModel };

    spyOn(viewModel, 'canActivate').and.callFake(() => {
      expect(dialogService.controllers.length).toBe(0);
    });

    spyOn(viewModel, 'activate').and.callFake(() => {
      expect(dialogService.controllers.length).toBe(0);
    });

    spyOn(renderer, 'showDialog').and.callFake((dialogController) => {
      expect(dialogService.controllers.length).toBe(1);
      done();
    });

    expect(dialogService.controllers.length).toBe(0);
    dialogService.open(settings);
  });

  it('does not report an active dialog if it fails to activate', (done) => {
    // the cotroller should be added to .controllers after the result of .activate() has settled
    // if there is activate
    const viewModel = new TestElement();
    viewModel.activate = function () { };
    const settings = { viewModel };
    const activateError = new Error();

    spyOn(viewModel, 'activate').and.returnValue(Promise.reject(activateError));
    spyOn(renderer, 'showDialog').and.callThrough();

    // we need a Promise to the point where the dialog will open
    let catchWasCalled = false;
    dialogService.openAndYieldController(settings).catch((reason) => {
      catchWasCalled = true; // the .activate() error has propagated
      expect(reason).toBe(activateError);
    }).then(() => {
      expect(catchWasCalled).toBe(true);
      expect(renderer.showDialog).not.toHaveBeenCalled();
      done();
    });
  });

  it('properly tracks dialogs', (done) => {
    const settings = { viewModel: TestElement };
    const dialogsToOpen = 3;
    const expectedEndCount = dialogsToOpen - 1;

    spyOn(renderer, 'showDialog').and.callFake((dialogController) => {
      if (renderer.showDialog.calls.count() === dialogsToOpen) {
        expect(dialogService.controllers.length).toBe(dialogsToOpen);
        dialogController.cancel();
      }
    });

    expect(dialogService.controllers.length).toBe(0);
    let i = dialogsToOpen - 1;
    while (i--) {
      dialogService.open(settings);
    }

    // the order in which DialogService.open is called does not match 
    // the order DialogRendere.showDialog is called 
    // with the respective DialogController instances
    setTimeout(() => {
      dialogService.open(settings).then(() => {
        expect(dialogService.controllers.length).toBe(expectedEndCount);
        done();
      });
    }, 60);
  });

  it('properly tracks dialogs closed with ".error()"', (done) => {
    const settings = { viewModel: TestElement };
    const closeError = new Error();
    let catchWasCalled = false;
    expect(dialogService.controllers.length).toBe(0); // start with 0
    dialogService.openAndYieldController(settings).then((controller => {
      expect(dialogService.controllers.length).toBe(1); // have 1 open
      controller.result.catch((reason) => {
        catchWasCalled = true;
        expect(dialogService.controllers.length).toBe(0); // the dialog has been closed with error
        expect(reason).toBe(closeError);
      }).then(() => {
        expect(catchWasCalled).toBe(true);
        done();
      });
      controller.error(closeError);
    }));
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
