import { Container } from 'aurelia-dependency-injection';
import { Loader } from 'aurelia-loader';
import { DefaultLoader } from 'aurelia-loader-default';
import { BindingLanguage, CompositionEngine } from 'aurelia-templating';
import { TemplatingBindingLanguage } from 'aurelia-templating-binding';
import { DOM } from 'aurelia-pal';
import { DialogCancelError } from '../../src/dialog-cancel-error';
import { DialogOpenResult } from '../../src/dialog-result';
import { DefaultDialogSettings, DialogSettings } from '../../src/dialog-settings';
import { Renderer } from '../../src/renderer';
import { DialogController } from '../../src/dialog-controller';
import { DialogService } from '../../src/dialog-service';
import { TestElement } from '../fixtures/test-element';

describe('DialogService', () => {
  let dialogService: DialogService;
  let container: Container;
  let compositionEngine: CompositionEngine;
  let renderer: Renderer;

  async function _success<T>(action: () => Promise<T>, done: DoneFn): Promise<T> {
    try {
      return await action();
    } catch (e) {
      done.fail(e);
      throw e;
    }
  }

  async function _failure(action: () => Promise<any>, done: DoneFn): Promise<any> {
    try {
      await action();
    } catch (e) {
      return e;
    }
    const e = new Error('Expected rejection.');
    done.fail(e);
    throw e;
  }

  beforeEach(() => {
    renderer = {
      showDialog() {
        return Promise.resolve();
      },
      hideDialog() {
        return Promise.resolve();
      },
      getDialogContainer() {
        return DOM.createElement('div');
      }
    };

    container = new Container();
    container.registerSingleton(Loader, DefaultLoader);
    container.registerSingleton(BindingLanguage, TemplatingBindingLanguage);
    container.registerAlias(BindingLanguage, TemplatingBindingLanguage);
    container.registerInstance(Renderer, renderer);
    container.registerSingleton(DefaultDialogSettings);
    container.get(DefaultDialogSettings).viewModel = TestElement;
    compositionEngine = container.get(CompositionEngine);
    dialogService = container.get(DialogService);
  });

  describe('".open"', () => {
    it('should create new settings by merging the default settings and the provided ones', async done => {
      const overrideSettings: DialogSettings = {
        rejectOnCancel: true,
        lock: true,
        keyboard: 'Escape',
        overlayDismiss: true
      };
      const { controller } = await _success(() => dialogService.open(overrideSettings), done) as DialogOpenResult;
      const expectedSettings = Object.assign({}, container.get(DefaultDialogSettings), overrideSettings);
      expect(controller.settings).toEqual(expectedSettings);
      done();
    });

    it('should not modify the default settings', async done => {
      const overrideSettings = { model: 'model data' };
      const expectedSettings = Object.assign({}, container.get(DefaultDialogSettings));
      await _success(() => dialogService.open(overrideSettings), done);
      // clone again the default settings, jasmine doesn't like them being a class
      const actualSettings = Object.assign({}, container.get(DefaultDialogSettings));
      expect(actualSettings).toEqual(expectedSettings);
      done();
    });

    it('resolves to "DialogOpenResult" when ".canActivate" resolves to "true"', async done => {
      spyOn(TestElement.prototype, 'canActivate').and.returnValue(true);
      const result = await _success(() => dialogService.open(), done);
      expect(result.wasCancelled).toBe(false);
      expect((result as DialogOpenResult).controller).toBeDefined();
      done();
    });

    // tslint:disable-next-line:max-line-length
    it('resolves to "DialogCancelResult" when ".canActivate" resolves to "false" and ".rejectOnCancel" is "false"', async done => {
      spyOn(TestElement.prototype, 'canActivate').and.returnValue(false);
      const result = await _success(() => dialogService.open({ rejectOnCancel: false }), done);
      expect(result.wasCancelled).toBe(true);
      expect((result as DialogOpenResult).controller).not.toBeDefined();
      done();
    });

    // tslint:disable-next-line:max-line-length
    it('gets rejected with "DialogCancelError" when ".canActivate" resolves to "false" and ".rejectOnCancel" is "true"', async done => {
      spyOn(TestElement.prototype, 'canActivate').and.returnValue(false);
      const result = await _failure(() => dialogService.open({ rejectOnCancel: true }), done) as DialogCancelError;
      expect(result.message).toBeDefined();
      expect(result.stack).toBeDefined();
      expect(result.wasCancelled).toBe(true);
      done();
    });

    it('should create new child Container if "childContainer" is missing', async done => {
      spyOn(container, 'createChild').and.callThrough();
      await _success(() => dialogService.open(), done);
      expect(container.createChild).toHaveBeenCalled();
      done();
    });

    it('should not create new child Container if "childContainer" is provided', async done => {
      const settings = { childContainer: container.createChild() };
      spyOn(container, 'createChild').and.callThrough();
      spyOn(settings.childContainer, 'invoke').and.callThrough();
      await _success(() => dialogService.open(settings), done);
      expect(container.createChild).not.toHaveBeenCalled();
      expect(settings.childContainer.invoke).toHaveBeenCalled();
      done();
    });

    it('propagates errors', async done => {
      const expectdError = new Error('Expected error.');
      spyOn(TestElement.prototype, 'canActivate').and.callFake(() => { throw expectdError; });
      const result = await _failure(() => dialogService.open(), done) as DialogCancelError;
      expect(result as any).toBe(expectdError);
      done();
    });
  });

  describe('".open" returned Promise ".whenClosed" method', () => {
    async function openDialog(done: DoneFn): Promise<DialogOpenResult> {
      const openResult = await _success(() => dialogService.open(), done);
      if (openResult.wasCancelled) {
        throw new Error('Expected ".open" not to be cancelled.');
      }
      return openResult;
    }

    it('is defined', () => {
      const result = dialogService.open();
      expect(typeof result.whenClosed).toBe('function');
    });

    it('resolves with "DialogCloseResult" when ".ok" closed', async done => {
      const { controller, closeResult } = await _success(() => openDialog(done), done);
      const expectedOutput = 'expected ok output';
      controller.ok(expectedOutput);
      const result = await _success(() => closeResult, done);
      expect(result.wasCancelled).toBe(false);
      expect(result.output).toBe(expectedOutput);
      done();
    });

    it('resolves with "DialogCloseResult" when ".cancel" closed and ".rejectOnCancel" is "false"', async done => {
      const { controller, closeResult } = await _success(() => openDialog(done), done);
      const expectedOutput = 'expected cancel output';
      Object.defineProperty(controller.settings, 'rejectOnCancel', { value: false });
      controller.cancel(expectedOutput);
      const result = await _success(() => closeResult, done);
      expect(result.wasCancelled).toBe(true);
      expect(result.output).toBe(expectedOutput);
      done();
    });

    it('gets rejected with "DialogCancelError" when ".cancel" closed and ".rejectOnCancel" is "true"', async done => {
      const { controller, closeResult } = await _success(() => openDialog(done), done);
      const expectedOutput = 'expected cancel error output';
      Object.defineProperty(controller.settings, 'rejectOnCancel', { value: true });
      controller.cancel(expectedOutput);
      const result = await _failure(() => closeResult, done) as DialogCancelError;
      expect(result.message).toBeDefined();
      expect(result.stack).toBeDefined();
      expect(result.wasCancelled).toBe(true);
      expect(result.output).toBe(expectedOutput);
      done();
    });

    it('gets rejected with provided error when ".error" closed', async done => {
      const { controller, closeResult } = await _success(() => openDialog(done), done);
      const expectedError = new Error('expected test error');
      controller.error(expectedError);
      const result = await _failure(() => closeResult, done);
      expect(result).toBe(expectedError);
      done();
    });

    it('propagates errors', async done => {
      const expectdError = new Error('Expected error.');
      spyOn(TestElement.prototype, 'canActivate').and.callFake(() => { throw expectdError; });
      const result = await _failure(() => dialogService.open().whenClosed(), done) as DialogCancelError;
      expect(result as any).toBe(expectdError);
      done();
    });
  });

  describe('".createSettings"', () => {
    it('should not set ".keyboard" if already set', () => {
      const settings: DialogSettings = { lock: true };
      const expected = 'Enter';
      settings.keyboard = expected;
      expect(dialogService.createSettings(settings).keyboard).toBe(expected);
    });

    it('should not set ".overlayDismiss" if already set', () => {
      const settings: DialogSettings = { lock: true };
      const expected = true;
      settings.overlayDismiss = expected;
      expect(dialogService.createSettings(settings).overlayDismiss).toBe(expected);
    });

    it('should make ".rejectOnCancel" readonly', () => {
      let settings = Object.assign({}, container.get(DefaultDialogSettings) as DialogSettings);
      function negateRejectOnCancel() {
        settings.rejectOnCancel = !settings.rejectOnCancel;
      }
      expect(negateRejectOnCancel).not.toThrow();
      settings = dialogService.createSettings(settings);
      expect(negateRejectOnCancel).toThrow();
    });

    describe('when ".lock" is "false"', () => {
      let settings: DialogSettings;

      beforeEach(() => {
        settings = { lock: false };
      });

      it('should set ".keyboard" to "true" if not set', () => {
        expect(dialogService.createSettings(settings).keyboard).toBe(true);
      });

      it('should set ".overlayDismiss" to "true" if not set', () => {
        expect(dialogService.createSettings(settings).overlayDismiss).toBe(true);
      });
    });

    describe('when ".lock" is "true"', () => {
      let settings: DialogSettings;

      beforeEach(() => {
        settings = { lock: true };
      });

      it('should set ".keyboard" to "false" if not set', () => {
        expect(dialogService.createSettings(settings).keyboard).toBe(false);
      });

      it('should set ".overlayDismiss" to "false" if not set', () => {
        expect(dialogService.createSettings(settings).overlayDismiss).toBe(false);
      });
    });
  });

  describe('reports an active dialog', () => {
    it('if any is open', async done => {
      expect(dialogService.hasActiveDialog).toBe(false);
      await _success(() => dialogService.open(), done);
      expect(dialogService.hasActiveDialog).toBe(true);
      await _success(() => dialogService.open(), done);
      expect(dialogService.hasActiveDialog).toBe(true);
      done();
    });

    it('as such, after it has been shown', async done => {
      // the cotroller should be added to .controllers after the result of renderer.showDialog() has settled
      // if there is activate
      const viewModel = new TestElement();
      const settings = { viewModel, yieldController: true };
      spyOn(viewModel, 'canActivate').and.callFake(() => {
        expect(dialogService.controllers.length).toBe(0);
      });
      spyOn(viewModel, 'activate').and.callFake(() => {
        expect(dialogService.controllers.length).toBe(0);
      });
      spyOn(renderer, 'showDialog').and.callFake((dialogController: DialogController) => {
        expect(dialogService.controllers.length).toBe(0);
        return Promise.resolve();
      });

      expect(dialogService.controllers.length).toBe(0);
      await _success(() => dialogService.open(settings), done);
      expect(viewModel.canActivate).toHaveBeenCalled();
      expect(viewModel.activate).toHaveBeenCalled();
      expect(renderer.showDialog).toHaveBeenCalled();
      expect(dialogService.controllers.length).toBe(1);
      done();
    });
  });

  it('reports no active dialog after the last one is closed', async done => {
    expect(dialogService.hasActiveDialog).toBe(false);
    const { controller: controllerA, closeResult: closeResultA } =
      await _success(() => dialogService.open(), done) as DialogOpenResult;
    expect(dialogService.hasActiveDialog).toBe(true);
    const { controller: controllerB, closeResult: closeResultB } =
      await _success(() => dialogService.open(), done) as DialogOpenResult;
    expect(dialogService.hasActiveDialog).toBe(true);
    controllerA.cancel();
    await _success(() => closeResultA, done);
    expect(dialogService.hasActiveDialog).toBe(true);
    controllerB.cancel();
    await _success(() => closeResultB, done);
    expect(dialogService.hasActiveDialog).toBe(false);
    done();
  });

  describe('properly keeps track of open dialogs', () => {
    const initialCount = 3;

    beforeEach(done => {
      let i = initialCount;
      const openPromises = [];
      while (i--) {
        openPromises.push(dialogService.open());
      }
      Promise.all(openPromises).then(done, done.fail);
    });

    it('when new one is open', async done => {
      expect(dialogService.controllers.length).toBe(initialCount);
      const { controller } = await _success(() => dialogService.open(), done) as DialogOpenResult;
      expect(dialogService.controllers.length).toBe(initialCount + 1);
      expect(dialogService.controllers).toContain(controller);
      done();
    });

    it('when one gets ".ok" closed', async done => {
      expect(dialogService.controllers.length).toBe(initialCount);
      const { controller, closeResult } = await _success(() => dialogService.open(), done) as DialogOpenResult;
      controller.ok();
      await _success(() => closeResult, done);
      expect(dialogService.controllers.length).toBe(initialCount);
      expect(dialogService.controllers).not.toContain(controller);
      done();
    });

    it('when one gets ".cancel" closed and ".rejectOnCancel" is "false"', async done => {
      const settings: DialogSettings = { rejectOnCancel: false };
      expect(dialogService.controllers.length).toBe(initialCount);
      const { controller, closeResult } = await _success(() => dialogService.open(settings), done) as DialogOpenResult;
      controller.cancel();
      await _success(() => closeResult, done);
      expect(dialogService.controllers.length).toBe(initialCount);
      expect(dialogService.controllers).not.toContain(controller);
      done();
    });

    it('when one gets ".cancel" closed and ".rejectOnCancel" is "true"', async done => {
      const settings: DialogSettings = { rejectOnCancel: true };
      expect(dialogService.controllers.length).toBe(initialCount);
      const { controller, closeResult } = await _success(() => dialogService.open(settings), done) as DialogOpenResult;
      controller.cancel();
      await _failure(() => closeResult, done);
      expect(dialogService.controllers.length).toBe(initialCount);
      expect(dialogService.controllers).not.toContain(controller);
      done();
    });

    it('when one gets ".error" closed', async done => {
      expect(dialogService.controllers.length).toBe(initialCount);
      const { controller, closeResult } = await _success(() => dialogService.open(), done) as DialogOpenResult;
      controller.error(new Error('test error'));
      await _failure(() => closeResult, done);
      expect(dialogService.controllers.length).toBe(initialCount);
      expect(dialogService.controllers).not.toContain(controller);
      done();
    });
  });

  describe('".closeAll"', () => {
    function openDialogs(count: number) {
      return Promise.all(new Array(count).fill(0).map(() => dialogService.open()));
    }

    function setRejectOnCancelForOpenDialogs(rejectOnCancel: boolean): void {
      dialogService.controllers.forEach(ctrl => {
        Object.defineProperty(ctrl.settings, 'rejectOnCancel', { value: rejectOnCancel });
      });
    }

    describe('resolves to an empty array when all dialogs closed successfully', () => {
      const toOpenCount = 10;

      beforeEach(done => {
        openDialogs(toOpenCount).then(done, done.fail);
      });

      it('and ".rejectOnCancel" is "false"', async done => {
        expect(dialogService.controllers.length).toBe(toOpenCount);
        setRejectOnCancelForOpenDialogs(false);
        const notClosed = await _success(() => dialogService.closeAll(), done);
        expect(dialogService.controllers.length).toBe(0);
        expect(notClosed.length).toBe(0);
        done();
      });

      it('and ".rejectOnCancel" is "true"', async done => {
        expect(dialogService.controllers.length).toBe(toOpenCount);
        setRejectOnCancelForOpenDialogs(true);
        const notClosed = await _success(() => dialogService.closeAll(), done);
        expect(dialogService.controllers.length).toBe(0);
        expect(notClosed.length).toBe(0);
        done();
      });
    });

    describe('gets rejected if any of the dialogs error when ".cancel" closed', () => {
      const toOpenCount = 5;

      beforeEach(done => {
        openDialogs(toOpenCount).then(done, done.fail);
      });

      it('and ".rejectOnCancel" is "false"', async done => {
        expect(dialogService.controllers.length).toBe(toOpenCount);
        setRejectOnCancelForOpenDialogs(false);
        const expectedController = dialogService.controllers[2] as DialogController;
        const expectedError = new Error('expected error');
        (expectedController.controller.viewModel as any).deactivate = () => { throw expectedError; };
        const actualError = await _failure(() => dialogService.closeAll(), done);
        expect(actualError).toBe(expectedError);
        done();
      });

      it('and ".rejectOnCancel" is "true"', async done => {
        expect(dialogService.controllers.length).toBe(toOpenCount);
        setRejectOnCancelForOpenDialogs(true);
        const expectedController = dialogService.controllers[2] as DialogController;
        const expectedError = new Error('expected error');
        (expectedController.controller.viewModel as any).deactivate = () => { throw expectedError; };
        const actualError = await _failure(() => dialogService.closeAll(), done);
        expect(actualError).toBe(expectedError);
        done();
      });
    });

    it('returns the controllers whose close operation was cancelled', async done => {
      await _success(() => openDialogs(3), done);
      const expectedController = dialogService.controllers[1];
      (expectedController.controller.viewModel as any).canDeactivate = () => false;
      const failedToClose = await _success(() => dialogService.closeAll(), done);
      expect(failedToClose.length).toBe(1);
      expect(failedToClose).toContain(expectedController);
      done();
    });
  });
});
