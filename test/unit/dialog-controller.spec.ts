import {DefaultDialogSettings} from '../../src/dialog-settings';
import {Renderer} from '../../src/renderer';
import {DialogController} from '../../src/dialog-controller';
import {DialogCancelError} from '../../src/dialog-cancel-error';

describe('DialogController', () => {
  let resolveCallback: jasmine.Spy;
  let rejectCallback: jasmine.Spy;
  let dialogController: DialogController;

  const createDialogController = (settings = new DefaultDialogSettings()): DialogController => {
    const renderer = jasmine.createSpyObj('rendererSpy', ['showDialog', 'hideDialog']) as Renderer;
    resolveCallback = jasmine.createSpy('resolveSpy');
    rejectCallback = jasmine.createSpy('rejectSpy');
    const dialogController = new DialogController(renderer, settings, resolveCallback, rejectCallback);
    dialogController.controller = jasmine.createSpyObj('controllerSpy', ['unbind']);
    dialogController.controller.viewModel = jasmine.createSpyObj('viewModelSpy', ['canDeactivate', 'deactivate']);
    return dialogController as DialogController;
  };

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
    dialogController = createDialogController();
  });

  describe('".releaseResources" should', () => {
    beforeEach(async done => {
      await _success(() => dialogController.releaseResources(), done);
      done();
    });

    it('call ".deactivate" on the view model', () => {
      expect((dialogController.controller.viewModel as any).deactivate).toHaveBeenCalled();
    });

    it('call ".hideDialog" on the renderer', () => {
      expect(dialogController.renderer.hideDialog).toHaveBeenCalledWith(dialogController);
    });

    it('call ".unbind" on the controller', () => {
      expect(dialogController.controller.unbind).toHaveBeenCalled();
    });
  });

  describe('".cancelOperation" should', () => {
    it('return "DialogCancelledResult" when "rejectOnCancel" is "false"', () => {
      dialogController.settings.rejectOnCancel = false;
      expect(dialogController.cancelOperation().wasCancelled).toBe(true);
    });

    it('throw "DialogCancelError" when "rejectOnCancel" is "true"', () => {
      dialogController.settings.rejectOnCancel = true;
      try {
        dialogController.cancelOperation();
      } catch (e) {
        expect((e as DialogCancelError).wasCancelled).toBe(true);
        return;
      }
      fail('Expected to throw.');
    });
  });

  describe('".ok" should', () => {
    it('call ".close" with success', () => {
      spyOn(dialogController, 'close');
      dialogController.ok();
      expect(dialogController.close).toHaveBeenCalledWith(true, undefined);
    });

    it('call ".close" and pass the provided output', () => {
      spyOn(dialogController, 'close');
      const expectedOutput = {};
      dialogController.ok(expectedOutput);
      expect(dialogController.close).toHaveBeenCalledWith(true, expectedOutput);
    });

    it('return the result of ".close"', () => {
      const expectedResult = {};
      spyOn(dialogController, 'close').and.returnValue(expectedResult);
      const actualResult = dialogController.ok();
      expect(actualResult as any).toBe(expectedResult);
    });
  });

  describe('".cancel" should', () => {
    it('call ".close" with success', () => {
      spyOn(dialogController, 'close');
      dialogController.cancel();
      expect(dialogController.close).toHaveBeenCalledWith(false, undefined);
    });

    it('call ".close" and pass the provided output', () => {
      spyOn(dialogController, 'close');
      const expectedOutput = {};
      dialogController.cancel(expectedOutput);
      expect(dialogController.close).toHaveBeenCalledWith(false, expectedOutput);
    });

    it('return the result of ".close"', () => {
      const expectedResult = {};
      spyOn(dialogController, 'close').and.returnValue(expectedResult);
      const actualResult = dialogController.cancel();
      expect(actualResult as any).toBe(expectedResult);
    });
  });

  describe('".error" should', () => {
    let reason: Error;

    beforeEach(() => {
      reason = new Error('Test reason');
    });

    it('should call ".releaseResources"', async done => {
      spyOn(dialogController, 'releaseResources').and.returnValue(Promise.resolve());
      await _success(() => dialogController.error(reason), done);
      expect(dialogController.releaseResources).toHaveBeenCalled();
      done();
    });

    describe('on success', () => {
      beforeEach(async done => {
        await _success(() => dialogController.error(reason), done);
        done();
      });

      it('call the reject callback', () => {
        expect(rejectCallback).toHaveBeenCalledWith(reason);
      });

      it('not call the resolve callback', () => {
        expect(resolveCallback).not.toHaveBeenCalled();
      });
    });

    describe('on failure', () => {
      beforeEach(async done => {
        spyOn(dialogController, 'releaseResources')
          .and
          .returnValue(Promise.reject(new Error('Unsuccessful completion error.')));
        await _failure(() => dialogController.error(reason), done);
        done();
      });

      it('not call the reject callback', () => {
        expect(rejectCallback).not.toHaveBeenCalled();
      });

      it('not call the resolve callback', () => {
        expect(resolveCallback).not.toHaveBeenCalled();
      });
    });
  });

  describe('".close" should', () => {
    it('call the "resolve" callback on "ok"', async done => {
      const expected = 'success output';
      await _success(() => dialogController.close(true, expected), done);
      expect(resolveCallback).toHaveBeenCalledWith(jasmine.objectContaining({ wasCancelled: false, output: expected }));
      done();
    });

    it('call the "resolve" callback on "cancel" when "rejectOnCancel" is "false"', async done => {
      const expected = 'cancel output';
      dialogController.settings.rejectOnCancel = false;
      await _success(() => dialogController.close(false, expected), done);
      expect(resolveCallback).toHaveBeenCalledWith(jasmine.objectContaining({ wasCancelled: true, output: expected }));
      done();
    });

    it('call the "reject" callback on "cancel" when "rejectOnCancel" is "true"', async done => {
      const output = 'cancel rejection reason';
      let rejectionReason: DialogCancelError | null = null;
      dialogController.settings.rejectOnCancel = true;
      rejectCallback.and.callFake((reason: DialogCancelError) => rejectionReason = reason);
      await _success(() => dialogController.close(false, output), done);
      expect(rejectCallback).toHaveBeenCalledWith(jasmine.any(Error));
      expect(rejectionReason as any).toEqual(jasmine.objectContaining({ wasCancelled: true, output }));
      done();
    });

    it('not call the "resolve" callback if error occurs', async done => {
      spyOn(dialogController, 'releaseResources')
        .and
        .returnValue(Promise.reject(new Error('Failed to release resources.')));
      await _failure(() => dialogController.close(true), done);
      expect(resolveCallback).not.toHaveBeenCalled();
      done();
    });

    it('not call the "reject" callback if error occurs', async done => {
      spyOn(dialogController, 'releaseResources')
        .and
        .returnValue(Promise.reject(new Error('Failed to release resources.')));
      await _failure(() => dialogController.close(true), done);
      expect(rejectCallback).not.toHaveBeenCalled();
      done();
    });

    it('not call the "resolve" callback when "invokeLifecycle" of ".canDeactivate" resolves to "false"', async done => {
      ((dialogController.controller.viewModel as any).canDeactivate as jasmine.Spy).and.returnValue(false);
      await _success(() => dialogController.close(true), done);
      expect(resolveCallback).not.toHaveBeenCalled();
      done();
    });

    it('not call the "reject" callback when "invokeLifecycle" of ".canDeactivate" resolves to "false"', async done => {
      ((dialogController.controller.viewModel as any).canDeactivate as jasmine.Spy).and.returnValue(false);
      await _success(() => dialogController.close(true), done);
      expect(rejectCallback).not.toHaveBeenCalled();
      done();
    });

    // tslint:disable-next-line:max-line-length
    it('be rejected with "DialogCancelError" when "invokeLifecycle" of ".canDeactivate" resolves to "false" and ".rejectOnCancel" is "true".', async done => {
      ((dialogController.controller.viewModel as any).canDeactivate as jasmine.Spy).and.returnValue(false);
      dialogController.settings.rejectOnCancel = true;
      const error = await _failure(() => dialogController.close(true), done) as DialogCancelError;
      expect(error.wasCancelled).toBe(true);
      done();
    });

    // tslint:disable-next-line:max-line-length
    it('resolve to "DialogCancelResult" when "invokeLifecycle" of ".canDeactivate" resolves to "false" and ".rejectOnCancel" is "false".', async done => {
      ((dialogController.controller.viewModel as any).canDeactivate as jasmine.Spy).and.returnValue(false);
      dialogController.settings.rejectOnCancel = false;
      const result = await _success(() => dialogController.close(true), done);
      expect(result.wasCancelled).toBe(true);
      done();
    });

    // tslint:disable-next-line:max-line-length
    it('not block consecutive calls if for previous "invokeLifecycle" of ".canDeactivate" resolves to "false"', async done => {
      ((dialogController.controller.viewModel as any).canDeactivate as jasmine.Spy).and.returnValue(false);
      await _success(() => dialogController.close(true), done);
      ((dialogController.controller.viewModel as any).canDeactivate as jasmine.Spy).and.stub();
      expect((dialogController.controller.viewModel as any).canDeactivate).toHaveBeenCalledTimes(1);
      expect(dialogController.closePromise).not.toBeDefined();
      await _success(() => dialogController.close(true), done);
      expect((dialogController.controller.viewModel as any).canDeactivate).toHaveBeenCalledTimes(2);
      done();
    });

    it('block consecutive calls if a previous one has succeeded', async done => {
      await _success(() => dialogController.close(true), done);
      expect((dialogController.controller.viewModel as any).canDeactivate).toHaveBeenCalledTimes(1);
      expect(dialogController.closePromise).toBeDefined();
      await _success(() => dialogController.close(true), done);
      expect((dialogController.controller.viewModel as any).canDeactivate).toHaveBeenCalledTimes(1);
      done();
    });

    it('not block consecutive calls if previous fails', async done => {
      ((dialogController.controller.viewModel as any).deactivate as jasmine.Spy).and.throwError('Deactivate failed.');
      await _failure(() => dialogController.close(true), done);
      ((dialogController.controller.viewModel as any).deactivate as jasmine.Spy).and.stub();
      expect((dialogController.controller.viewModel as any).canDeactivate).toHaveBeenCalledTimes(1);
      expect(dialogController.closePromise).not.toBeDefined();
      await _success(() => dialogController.close(true), done);
      expect((dialogController.controller.viewModel as any).canDeactivate).toHaveBeenCalledTimes(2);
      done();
    });
  });
});
