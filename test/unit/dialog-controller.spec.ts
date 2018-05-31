import { Controller, View } from 'aurelia-templating';
import { DialogCloseResult } from './../../src/dialog-result';
import { DialogComponentCanDeactivate } from './../../src/interfaces';
import { DefaultDialogSettings } from '../../src/dialog-settings';
import { Renderer } from '../../src/renderer';
import { DialogController } from '../../src/dialog-controller';
import { DialogCancelError } from '../../src/dialog-cancel-error';

describe('DialogController', () => {
  let dialogController: DialogController;
  const createDialogController = (settings = new DefaultDialogSettings()): DialogController => {
    const renderer = jasmine.createSpyObj('rendererSpy', ['showDialog', 'hideDialog']) as Renderer;
    (renderer.showDialog as jasmine.Spy).and.returnValue(Promise.resolve());
    (renderer.hideDialog as jasmine.Spy).and.returnValue(Promise.resolve());
    const dialogController = new DialogController(renderer, settings);
    dialogController.controller = jasmine.createSpyObj('controllerSpy', ['unbind']);
    dialogController.controller!.viewModel = jasmine.createSpyObj('viewModelSpy', ['canDeactivate', 'deactivate']);
    return dialogController;
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
    const expectedDeactivateArg = {} as any;
    beforeEach(async done => {
      await _success(() => dialogController.releaseResources(expectedDeactivateArg), done);
      done();
    });

    it('call ".deactivate" on the view model', () => {
      expect((dialogController.controller!.viewModel as any).deactivate).toHaveBeenCalledWith(expectedDeactivateArg);
    });

    it('call ".hideDialog" on the renderer', () => {
      expect(dialogController.renderer.hideDialog).toHaveBeenCalledWith(dialogController);
    });

    it('call ".unbind" on the controller', () => {
      expect(dialogController.controller!.unbind).toHaveBeenCalled();
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

  describe('".initialize" should', () => {
    beforeEach(() => {
      dialogController.controller = undefined;
      dialogController.view = undefined as any;
    });
    it('set ".controller" and ".view" when invoked with "Controller"', () => {
      const controller: Controller = { viewModel: {}, view: {} } as any;
      dialogController.initialize(controller);
      expect(dialogController.controller).toBe(controller);
      expect(dialogController.view).toBe(controller.view);
    });

    it('set ".view" when invoked with "View"', () => {
      const view: View = {} as any;
      dialogController.initialize(view);
      expect(dialogController.controller).not.toBeDefined();
      expect(dialogController.view).toBe(view);
    });
  });

  describe('".show" should', () => {
    it('call ".showDialog" on the "DialogRenderer"', async done => {
      await _success(() => dialogController.show(), done);
      expect(dialogController.renderer.showDialog).toHaveBeenCalledWith(dialogController);
      done();
    });

    it('propagate errors correctly', async done => {
      const expectedError = new Error('"DialogCOntroller.prototype.show" error propagation test error.');
      (dialogController.renderer.showDialog as jasmine.Spy).and.callFake(() => { throw expectedError; });
      const actualError = await _failure(() => dialogController.show(), done);
      expect(actualError).toBe(expectedError);
      done();
    });

    it('return a "Promise" that resolves to a "OpenDialogResult"', async done => {
      const result = await _success(() => dialogController.show(), done);
      expect(result.controller).toBe(dialogController);
      expect(result.wasCancelled).toBe(false);
      expect(result.closeResult instanceof Promise).toBe(true);
      done();
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

    beforeEach(async done => {
      reason = new Error('Test reason');
      const openResult = await _success(() => dialogController.show(), done);
      openResult.closeResult.catch(e => { /* prevent uncaught promise rejections */ });
      spyOn(dialogController as any, 'resolve').and.callThrough();
      spyOn(dialogController as any, 'reject').and.callThrough();
      done();
    });

    it('should call ".releaseResources" with "DialogCloseError"', async done => {
      spyOn(dialogController, 'releaseResources').and.returnValue(Promise.resolve());
      await _success(() => dialogController.error(reason), done);
      expect(dialogController.releaseResources).toHaveBeenCalledWith(jasmine.objectContaining({
        wasCancelled: false,
        output: reason
      }));
      done();
    });

    describe('on success', () => {
      beforeEach(async done => {
        await _success(() => dialogController.error(reason), done);
        done();
      });

      it('call the reject callback', () => {
        expect((dialogController as any).reject).toHaveBeenCalledWith(jasmine.objectContaining({
          wasCancelled: false,
          output: reason
        }));
      });

      it('not call the resolve callback', () => {
        expect((dialogController as any).resolve).not.toHaveBeenCalled();
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
        expect((dialogController as any).reject).not.toHaveBeenCalled();
      });

      it('not call the resolve callback', () => {
        expect((dialogController as any).resolve).not.toHaveBeenCalled();
      });
    });
  });

  describe('".close" should', () => {
    beforeEach(async done => {
      await _success(() => dialogController.show(), done);
      spyOn(dialogController as any, 'resolve').and.callThrough();
      spyOn(dialogController as any, 'reject').and.callThrough();
      done();
    });

    it('call the "resolve" callback on "ok"', async done => {
      const expected = 'success output';
      await _success(() => dialogController.close(true, expected), done);
      expect((dialogController as any).resolve)
        .toHaveBeenCalledWith(jasmine.objectContaining({ wasCancelled: false, output: expected }));
      done();
    });

    it('call ".canDeactivate" with the close result', async done => {
      const output = 'expected output';
      await _success(() => dialogController.close(true, output), done);
      const vm = dialogController.controller!.viewModel as DialogComponentCanDeactivate;
      const expectedResult = (vm.canDeactivate as jasmine.Spy).calls.argsFor(0)[0] as DialogCloseResult;
      expect(expectedResult).toBeDefined();
      expect(expectedResult.output).toBe(output);
      done();
    });

    it('call the "resolve" callback on "cancel" when "rejectOnCancel" is "false"', async done => {
      const expected = 'cancel output';
      dialogController.settings.rejectOnCancel = false;
      await _success(() => dialogController.close(false, expected), done);
      expect((dialogController as any).resolve)
        .toHaveBeenCalledWith(jasmine.objectContaining({ wasCancelled: true, output: expected }));
      done();
    });

    it('call the "reject" callback on "cancel" when "rejectOnCancel" is "true"', async done => {
      const output = 'cancel rejection reason';
      let rejectionReason: DialogCancelError | null = null;
      dialogController.settings.rejectOnCancel = true;
      ((dialogController as any).reject as jasmine.Spy)
        .and.stub()
        .and.callFake((reason: DialogCancelError) => rejectionReason = reason);
      await _success(() => dialogController.close(false, output), done);
      expect((dialogController as any).reject).toHaveBeenCalledWith(jasmine.any(Error));
      expect(rejectionReason as any).toEqual(jasmine.objectContaining({ wasCancelled: true, output }));
      done();
    });

    it('not call the "resolve" callback if error occurs', async done => {
      spyOn(dialogController, 'releaseResources')
        .and
        .returnValue(Promise.reject(new Error('Failed to release resources.')));
      await _failure(() => dialogController.close(true), done);
      expect((dialogController as any).resolve).not.toHaveBeenCalled();
      done();
    });

    it('not call the "reject" callback if error occurs', async done => {
      spyOn(dialogController, 'releaseResources')
        .and
        .returnValue(Promise.reject(new Error('Failed to release resources.')));
      await _failure(() => dialogController.close(true), done);
      expect((dialogController as any).reject).not.toHaveBeenCalled();
      done();
    });

    it('not call the "resolve" callback when "invokeLifecycle" of ".canDeactivate" resolves to "false"', async done => {
      ((dialogController.controller!.viewModel as any).canDeactivate as jasmine.Spy).and.returnValue(false);
      await _success(() => dialogController.close(true), done);
      expect((dialogController as any).resolve).not.toHaveBeenCalled();
      done();
    });

    it('not call the "reject" callback when "invokeLifecycle" of ".canDeactivate" resolves to "false"', async done => {
      ((dialogController.controller!.viewModel as any).canDeactivate as jasmine.Spy).and.returnValue(false);
      await _success(() => dialogController.close(true), done);
      expect((dialogController as any).reject).not.toHaveBeenCalled();
      done();
    });

    // tslint:disable-next-line:max-line-length
    it('be rejected with "DialogCancelError" when "invokeLifecycle" of ".canDeactivate" resolves to "false" and ".rejectOnCancel" is "true".', async done => {
      ((dialogController.controller!.viewModel as any).canDeactivate as jasmine.Spy).and.returnValue(false);
      dialogController.settings.rejectOnCancel = true;
      const error = await _failure(() => dialogController.close(true), done) as DialogCancelError;
      expect(error.wasCancelled).toBe(true);
      done();
    });

    // tslint:disable-next-line:max-line-length
    it('resolve to "DialogCancelResult" when "invokeLifecycle" of ".canDeactivate" resolves to "false" and ".rejectOnCancel" is "false".', async done => {
      ((dialogController.controller!.viewModel as any).canDeactivate as jasmine.Spy).and.returnValue(false);
      dialogController.settings.rejectOnCancel = false;
      const result = await _success(() => dialogController.close(true), done);
      expect(result.wasCancelled).toBe(true);
      done();
    });

    // tslint:disable-next-line:max-line-length
    it('not block consecutive calls if for previous "invokeLifecycle" of ".canDeactivate" resolves to "false"', async done => {
      ((dialogController.controller!.viewModel as any).canDeactivate as jasmine.Spy).and.returnValue(false);
      await _success(() => dialogController.close(true), done);
      ((dialogController.controller!.viewModel as any).canDeactivate as jasmine.Spy).and.stub();
      expect((dialogController.controller!.viewModel as any).canDeactivate).toHaveBeenCalledTimes(1);
      expect(dialogController.closePromise).not.toBeDefined();
      await _success(() => dialogController.close(true), done);
      expect((dialogController.controller!.viewModel as any).canDeactivate).toHaveBeenCalledTimes(2);
      done();
    });

    it('block consecutive calls if a previous one has succeeded', async done => {
      await _success(() => dialogController.close(true), done);
      expect((dialogController.controller!.viewModel as any).canDeactivate).toHaveBeenCalledTimes(1);
      expect(dialogController.closePromise).toBeDefined();
      await _success(() => dialogController.close(true), done);
      expect((dialogController.controller!.viewModel as any).canDeactivate).toHaveBeenCalledTimes(1);
      done();
    });

    it('not block consecutive calls if previous fails', async done => {
      ((dialogController.controller!.viewModel as any).deactivate as jasmine.Spy).and.throwError('Deactivate failed.');
      await _failure(() => dialogController.close(true), done);
      ((dialogController.controller!.viewModel as any).deactivate as jasmine.Spy).and.stub();
      expect((dialogController.controller!.viewModel as any).canDeactivate).toHaveBeenCalledTimes(1);
      expect(dialogController.closePromise).not.toBeDefined();
      await _success(() => dialogController.close(true), done);
      expect((dialogController.controller!.viewModel as any).canDeactivate).toHaveBeenCalledTimes(2);
      done();
    });
  });
});
