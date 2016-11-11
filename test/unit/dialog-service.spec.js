import {DialogService} from '../../src/dialog-service';
import {Renderer} from '../../src/renderer';
import {DialogController} from '../../src/dialog-controller';
import {Container} from 'aurelia-dependency-injection';
import {CompositionEngine, BindingLanguage} from 'aurelia-templating';
import {TestElement} from '../fixtures/test-element';
import {Loader} from 'aurelia-loader';
import {DefaultLoader} from 'aurelia-loader-default';
import {TemplatingBindingLanguage} from 'aurelia-templating-binding';
import {dialogOptions} from '../../src/dialog-options';

describe('the Dialog Service', function () {
  let dialogService;
  let container;
  let compEng;
  let renderer;

  beforeEach(function () {
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

  it('uses the default settings', function (done) {
    spyOn(renderer, 'showDialog').and.callFake((dialogController) => {
      expect(dialogController.settings).toEqual(jasmine.objectContaining(dialogOptions));
      done();
      return Promise.resolve();
    });

    dialogService.open({ viewModel: TestElement });
  });

  it('allows overriding the default settings', function (done) {
    const newSettings = {
      lock: !dialogOptions.lock,
      centerHorizontalOnly: !dialogOptions.centerHorizontalOnly,
      // startingZIndex: 1, // should be overridden only when configuring the plugin
      ignoreTransitions: !dialogOptions.ignoreTransitions
    };

    spyOn(renderer, 'showDialog').and.callFake((dialogController) => {
      expect(dialogController.settings).toEqual(jasmine.objectContaining(newSettings));
      done();
      return Promise.resolve();
    });

    dialogService.open(Object.assign({}, newSettings, { viewModel: TestElement }));
  });

  it('does not allow overriding "startingZIndex"', function (done) {
    spyOn(renderer, 'showDialog').and.callFake((dialogController) => {
      expect(dialogController.settings).toEqual(jasmine.objectContaining(dialogOptions));
      done();
      return Promise.resolve();
    });

    dialogService.open({ startingZIndex: 1, viewModel: TestElement });
  });

  it('open with a model settings applied', function (done) {
    const settings = { viewModel: TestElement };

    spyOn(renderer, 'showDialog').and.callFake((dialogController) => {
      done();
      return Promise.resolve();
    });

    dialogService.open(settings);
  });

  it('reports no active dialog if no dialog is open', function (done) {
    const settings = { viewModel: TestElement };

    spyOn(renderer, 'showDialog').and.callFake((dialogController) => {
      expect(dialogService.hasActiveDialog).toBe(true);
      dialogController.cancel();
      return Promise.resolve();
    });

    expect(dialogService.hasActiveDialog).toBe(false);

    dialogService.open(settings)
      .then(() => {
        expect(dialogService.hasActiveDialog).toBe(false);
        done();
      });
  });

  it('reports an active dialog if a dialog is open', function (done) {
    const settings = { viewModel: TestElement };

    spyOn(renderer, 'showDialog').and.callFake((dialogController) => {
      expect(dialogService.hasActiveDialog).toBe(true);
      done();
      return Promise.resolve();
    });

    expect(dialogService.hasActiveDialog).toBe(false);
    dialogService.open(settings);
  });

  it('reports an active dialog after it has been activated', function (done) {
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
      return Promise.resolve();
    });

    expect(dialogService.controllers.length).toBe(0);
    dialogService.open(settings);
  });

  it('does not report an active dialog if it fails to activate', function (done) {
    // the cotroller should be added to .controllers after the result of .activate() has settled
    // if there is activate
    const viewModel = new TestElement();
    viewModel.activate = function () { };
    const settings = { viewModel, yieldController: true };
    const activateError = new Error();

    spyOn(viewModel, 'activate').and.returnValue(Promise.reject(activateError));
    spyOn(renderer, 'showDialog').and.callThrough();

    // we need a Promise to the point where the dialog will open
    dialogService.open(settings)
      .then(() => {
        fail('".open" should not resolve if the view model failed to activate.');
        done();
      })
      .catch((reason) => {
        expect(reason).toBe(activateError);
        expect(renderer.showDialog).not.toHaveBeenCalled();
        done()
      });
  });

  it('properly tracks dialogs', function (done) {
    const settings = { viewModel: TestElement };
    const dialogsToOpen = 3;
    const expectedEndCount = dialogsToOpen - 1;

    spyOn(renderer, 'showDialog').and.callFake((dialogController) => {
      if (renderer.showDialog.calls.count() === dialogsToOpen) {
        expect(dialogService.controllers.length).toBe(dialogsToOpen);
        dialogController.cancel();
      }
      return Promise.resolve();
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

  it('properly tracks dialogs closed with ".error()"', function (done) {
    const settings = { viewModel: TestElement, yieldController: true };
    const closeError = new Error();
    expect(dialogService.controllers.length).toBe(0); // start with 0
    dialogService.open(settings).then(({ controller, closeResult }) => {
      expect(dialogService.controllers.length).toBe(1); // have 1 open
      closeResult
        .then(() => {
          fail('The result of calling ".open" should not resolve if ".error" was called on the dialog controller.');
          done();
        })
        .catch((reason) => {
          expect(dialogService.controllers.length).toBe(0); // the dialog has been closed with error
          expect(reason).toBe(closeError);
          done();
        });
      controller.error(closeError);
    });
  });

  describe('".open" method result resolves when the dialog is', function () {
    it('closed - "yieldController" is "false"', function (done) {
      const expectedOutput = {};
      const settings = { viewModel: TestElement };
      spyOn(renderer, 'showDialog').and.callFake((dialogController) => {
        const result = Promise.resolve();
        setTimeout(() => result.then(() => dialogController.ok(expectedOutput)), 0);
        return result;
      });
      const result = dialogService.open(settings)
        .then(({wasCancelled, output}) => {
          expect(wasCancelled).toBe(false);
          expect(output).toBe(expectedOutput);
          done();
        });

      // TODO: handle unexpected rejection
    });

    it('open - "yieldController" is "true"', function (done) {
      const settings = { yieldController: true, viewModel: TestElement };
      const result = dialogService.open(settings).then(({wasCancelled, controller, closeResult}) => {
        expect(wasCancelled).toBe(false);
        expect(controller).toBeDefined();
        expect(controller).not.toBeNull();
        expect(closeResult).toBeDefined();
        expect(closeResult).not.toBeNull();
        done();
      });
      // TODO: handle unexpected rejection
    });
  });

  describe('reports a cancellation if the view model ".canActivate" method returns "false"', function () {
    beforeAll(function () {
      TestElement.prototype.canActivate = () => false;
    });

    afterAll(function () {
      delete TestElement.prototype.canActivate;
    });

    it('and "yieldController" is "false"', function (done) {
      const settings = { yieldController: false, viewModel: TestElement };
      const result = dialogService.open(settings)
        .then(({wasCancelled, output}) => {
          expect(wasCancelled).toBe(true);
          expect(output).not.toBeDefined();
          done();
        });
      // TODO: handle unexpected rejection
    });

    it('and "yieldController" is "true"', function (done) {
      const settings = { yieldController: true, viewModel: TestElement };
      const result = dialogService.open(settings)
        .then(({wasCancelled, controller, closeResult}) => {
          expect(wasCancelled).toBe(true);
          expect(controller).not.toBeDefined();
          expect(closeResult).not.toBeDefined();
          done();
        });
      // TODO: handle unexpected rejection
    });

    it('and "rejectOnCancel" is true', function (done) {
      const settings = { rejectOnCancel: true, viewModel: TestElement };
      dialogService.open(settings)
        .then(() => {
          fail('".open" should not resolve on cancellation when "rejectOnCancel" is "true".');
          done();
        })
        .catch((reason) => {
          expect(reason.wasCancelled).toBe(true);
          done();
        });
    });
  });

  describe('".open" method properly propagates errors', function () {
    it('when "yieldController" is "false"', function (done) {
      let catchWasCalled = false;
      let promise = dialogService.open({ viewModel: 'test/fixtures/non-existent' })
        .catch(() => {
          catchWasCalled = true;
        }).then(() => {
          expect(catchWasCalled).toBe(true);
          done();
        });
    });

    it('when "yieldController" is "true"', function (done) {
      let catchWasCalled = false;
      dialogService.open({ viewModel: 'test/fixtures/non-existent', yieldController: true })
        .catch(() => {
          catchWasCalled = true;
        }).then(() => {
          expect(catchWasCalled).toBe(true);
          done();
        });
    });
  });
});
