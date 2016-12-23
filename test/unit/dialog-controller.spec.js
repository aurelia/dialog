import {DialogController} from '../../src/dialog-controller';
import {Container} from 'aurelia-dependency-injection';

describe('the Dialog Controller', function () {
  let renderer = {
    defaultSettings: {},
    hideDialog: Function.prototype
  };

  function failOnRejection(promise, done) {
    promise.catch((reason) => {
      fail(reason);
      done();
    });
  }

  function createDialogController(settings = {}) {
    const dialogController = new DialogController(renderer, settings, Function.prototype, Function.prototype);
    dialogController.viewModel = {};
    dialogController.controller = {
      unbind() { }
    };
    dialogController.renderer.hideDialog = Function.prototype;
    return dialogController;
  }

  beforeEach(function () {
    this.dialogController = createDialogController();
  });

  it('should call close with success when ok method called', function () {
    const dialogController = this.dialogController;
    let calledValue = 'Worked';
    spyOn(dialogController, 'close');
    dialogController.ok(calledValue);
    expect(dialogController.close).toHaveBeenCalledWith(true, calledValue);
  });

  it('should call close without success when cancel method called', function () {
    const dialogController = this.dialogController;
    let calledValue = 'Didnt work';
    spyOn(dialogController, 'close');
    dialogController.cancel(calledValue);
    expect(dialogController.close).toHaveBeenCalledWith(false, calledValue);
  });

  it('should not be blocked from being closed if ".canDeactivate()" returns "false" once', function (done) {
    const dialogController = this.dialogController;
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

  describe('".close" method should be', function () {
    beforeEach(function () {
      this.dialogController = createDialogController();
      this.expectedOutput = {};
    });

    it('resolved on success', function (done) {
      const dialogController = this.dialogController;
      spyOn(dialogController, '_resolve').and.callFake((result) => {
        expect(result.wasCancelled).toBe(false);
        expect(result.output).toBe(this.expectedOutput);
      });
      spyOn(dialogController, '_reject');
      const pendingClose = dialogController.close(true, this.expectedOutput)
        .then((closeOperationResult) => {
          expect(closeOperationResult.wasCancelled).toBe(false);
          expect(dialogController._resolve).toHaveBeenCalled();
          expect(dialogController._reject).not.toHaveBeenCalled();
          done();
        });
      failOnRejection(pendingClose, done);
    });

    it('resolved on cancellation if "rejectOnCancel" is false', function (done) {
      const dialogController = this.dialogController;
      spyOn(dialogController, '_resolve').and.callFake((result) => {
        expect(result.wasCancelled).toBe(true);
        expect(result.output).toBe(this.expectedOutput);
      });
      spyOn(dialogController, '_reject');
      const pendingClose = dialogController.close(false, this.expectedOutput)
        .then((closeOperationResult) => {
          expect(closeOperationResult.wasCancelled).toBe(false);
          expect(dialogController._resolve).toHaveBeenCalled();
          expect(dialogController._reject).not.toHaveBeenCalled();
          done();
        });
      failOnRejection(pendingClose, done);
    });

    it('resolved on cancellation if "rejectOnCancel" is true', function (done) {
      const dialogController = this.dialogController;
      dialogController.settings.rejectOnCancel = true;
      spyOn(dialogController, '_resolve');
      spyOn(dialogController, '_reject').and.callFake((reason) => {
        expect(reason).toBeDefined();
        expect(reason.wasCancelled).toBe(true);
        expect(reason.reason).toBe(this.expectedOutput);
      });
      const pendingClose = dialogController.close(false, this.expectedOutput)
        .then((closeOperationResult) => {
          expect(closeOperationResult.wasCancelled).toBe(false);
          expect(dialogController._resolve).not.toHaveBeenCalled();
          expect(dialogController._reject).toHaveBeenCalled();
          done();
        });
      failOnRejection(pendingClose, done);
    });

    it('resolved if ".canActivate" returns false and "rejectOnCancel" is false', function (done) {
      const dialogController = this.dialogController;
      dialogController.viewModel.canDeactivate = () => false;
      spyOn(dialogController, '_resolve');
      spyOn(dialogController, '_reject');
      const pendingClose = dialogController.close(false, this.expectedOutput)
        .then((closeOperationResult) => {
          expect(closeOperationResult.wasCancelled).toBe(true);
          expect(dialogController._resolve).not.toHaveBeenCalled();
          expect(dialogController._reject).not.toHaveBeenCalled();
          done();
        });
      failOnRejection(pendingClose, done);
    });

    it('rejected if ".canDeactivate" returns false and "rejectOnCancel" is true', function (done) {
      const dialogController = this.dialogController;
      dialogController.settings.rejectOnCancel = true;
      dialogController.viewModel.canDeactivate = () => false;
      spyOn(dialogController, '_resolve');
      spyOn(dialogController, '_reject');
      const pendingClose = dialogController.close(false, this.expectedOutput)
        .then(() => {
          fail('".close" should be rejected when ".canActivate" returns false and "rejectOnError" is "true".');
          done();
        }).catch((reason) => {
          expect(reason.wasCancelled).toBe(true);
          expect(reason.reason).toBeDefined();
          expect(dialogController._resolve).not.toHaveBeenCalled();
          expect(dialogController._reject).not.toHaveBeenCalled();
          done();
        });
    });
  });

  describe('".close" method should properly propagate errors', function () {
    beforeEach(function () {
      this.dialogController = createDialogController();
    });

    it('from ".canDeactivate"', function (done) {
      const dialogController = this.dialogController;
      const expectedError = new Error();
      dialogController.viewModel.canDeactivate = () => { throw expectedError; }
      dialogController.viewModel.deactivate = Function.prototype;
      spyOn(dialogController, '_resolve');
      spyOn(dialogController, '_reject');
      spyOn(dialogController.viewModel, 'deactivate');
      dialogController.close(true)
        .then(() => {
          fail('".close" should have been rejected when ".canDeactivate" errored.');
          done();
        }).catch((reason) => {
          expect(dialogController._resolve).not.toHaveBeenCalled();
          expect(dialogController._reject).not.toHaveBeenCalled();
          expect(dialogController.viewModel.deactivate).not.toHaveBeenCalled();
          expect(reason).toBe(expectedError);
          done();
        });
    });

    it('from ".deactivate"', function (done) {
      const dialogController = this.dialogController;
      const expectedError = new Error();
      dialogController.viewModel.deactivate = () => { throw expectedError; }
      spyOn(dialogController, '_resolve');
      spyOn(dialogController, '_reject');
      dialogController.close(true)
        .then(() => {
          fail('".close" should have been rejected when ".deactivate" errored.');
          done();
        }).catch((reason) => {
          expect(dialogController._resolve).not.toHaveBeenCalled();
          expect(dialogController._reject).not.toHaveBeenCalled();
          expect(reason).toBe(expectedError);
          done();          
        });
    });
  });
});
