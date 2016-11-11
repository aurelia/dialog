import {DialogController} from '../../src/dialog-controller';
import {Container} from 'aurelia-dependency-injection';

describe('the Dialog Controller', function () {
  let dialogController;
  let renderer = {
    defaultSettings: {},
    hideDialog: Function.prototype
  };
  let settings;

  function failOnRejection(promise, done) {
    promise.catch((reason) => {
      fail(reason);
      done();
    });
  }

  beforeEach(function () {
    new Container().makeGlobal();
    settings = { name: 'Test' };
    dialogController = new DialogController(renderer, settings, Function.prototype, Function.prototype);
    dialogController.viewModel = {};
    dialogController.controller = {
      unbind() { }
    };
    dialogController.renderer.hideDialog = Function.prototype;
  });

  it('should call close with success when ok method called', function () {
    let calledValue = 'Worked';
    spyOn(dialogController, 'close');
    dialogController.ok(calledValue);
    expect(dialogController.close).toHaveBeenCalledWith(true, calledValue);
  });

  it('should call close without success when cancel method called', function () {
    let calledValue = 'Didnt work';
    spyOn(dialogController, 'close');
    dialogController.cancel(calledValue);
    expect(dialogController.close).toHaveBeenCalledWith(false, calledValue);
  });

  it('should not be blocked from being closed if ".canDeactivate()" returns "false" once', function (done) {
    dialogController.viewModel = {
      canDeactivateCalls: 0,
      canDeactivate() {
        ++this.canDeactivateCalls;
        return this.canDeactivateCalls > 1;
      },
      deactivate() { }
    };
    spyOn(dialogController.renderer, 'hideDialog');
    dialogController.close(true).then(() => {
      expect(dialogController.renderer.hideDialog).not.toHaveBeenCalled();
      dialogController.close(true).then(() => {
        expect(dialogController.renderer.hideDialog).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('".close" method should', function () {
    beforeEach(function () {
      this.expectedOutput = {};
    });

    it('resolve on success', function (done) {
      spyOn(dialogController, '_resolve');
      spyOn(dialogController, '_reject');
      const result = dialogController.close(true, this.expectedOutput)
        .then((result) => {
          expect(result.wasCancelled).toBe(false);
          expect(result.output).toBe(this.expectedOutput);
          expect(dialogController._resolve).toHaveBeenCalledWith(result);
          expect(dialogController._reject).not.toHaveBeenCalled();
          done();
        });
      failOnRejection(result, done);
    });

    it('resolve on cancellation if "rejectOnCancel" is false', function (done) {
      spyOn(dialogController, '_resolve');
      spyOn(dialogController, '_reject');
      const result = dialogController.close(false, this.expectedOutput)
        .then((result) => {
          expect(result.wasCancelled).toBe(true);
          expect(result.output).toBe(this.expectedOutput);
          expect(dialogController._resolve).toHaveBeenCalledWith(result);
          expect(dialogController._reject).not.toHaveBeenCalled();
          done();
        });
      failOnRejection(result, done);
    });

    it('reject on cancellation if "rejectOnCancel" is true', function (done) {
      dialogController.settings.rejectOnCancel = true;
      spyOn(dialogController, '_resolve');
      spyOn(dialogController, '_reject');
      dialogController.close(false, this.expectedOutput)
        .then(() => {
          fail('".close" should be rejected when "rejectOnError" is "true".');
          done();
        }).catch((reason) => {
          expect(reason.wasCancelled).toBe(true);
          expect(reason.reason).toBe(this.expectedOutput);
          expect(dialogController._resolve).not.toHaveBeenCalled();
          expect(dialogController._reject).toHaveBeenCalledWith(reason);
          done();
        });
    });
  });
});
