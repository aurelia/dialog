import {DOM} from 'aurelia-pal';
import {DialogController} from '../../src/dialog-controller';
import {DialogRenderer} from '../../src/dialog-renderer';
import {dialogOptions} from '../../src/dialog-options';
import {configure} from '../../src/aurelia-dialog';
import {TestElement} from '../fixtures/test-element';

describe('the Dialog Renderer', () => {
  function createDialogController(controllerSettings) {
    const controller = new DialogController(new DialogRenderer(), controllerSettings, Function.prototype, Function.prototype);
    controller.viewModel = {};
    controller.controller = { unbind: Function.prototype };
    controller.slot = {
      attached: Function.prototype,
      detached: Function.prototype,
      anchor: document.createElement('ai-dialog')
    };
    return controller;
  }

  beforeAll(function () {
    this.showDialogs = (dialogControllers) => {
      return Promise.all(dialogControllers.map((controller) => controller.renderer.showDialog(controller)))
        .catch(() => { this.catchWasCalled = true; });
    };

    this.closeDialog = (dialogController) => {
      return dialogController.cancel().catch(() => { this.catchWasCalled = true; });
    };
  });

  beforeEach(function () {
    DialogRenderer.prototype._dialogControllers = [];
    this.catchWasCalled = false;
  });

  it('calls position if specified', function (done) {
    const settings = {
      viewModel: TestElement,
      ignoreTransitions: true, // ".position()" invocation is transitions independent
      position: (modalContainer, modalOverlay) => {
        expect(modalContainer.tagName).toBe('AI-DIALOG-CONTAINER');
        expect(modalOverlay.tagName).toBe('AI-DIALOG-OVERLAY');
      }
    };

    let controller = createDialogController(settings);
    this.showDialogs([controller]).then(() => {
      expect(this.catchWasCalled).toBe(false);
      done();
    });
  });

  it('does close the top dialog, when not locked, on ESC', function (done) {
    const settings = { lock: false };
    const expectedEndCount = 1;
    const first = createDialogController(settings);
    const last = createDialogController(settings);

    spyOn(first, 'cancel');
    spyOn(last, 'cancel').and.callFake((...args) => {
      this.catchWasCalled ? done() : DialogController.prototype.cancel.apply(last, args).then(() => {
        expect(first.cancel).not.toHaveBeenCalled();
        expect(last.renderer._dialogControllers.length).toBe(expectedEndCount);
      }).catch(() => {
        this.catchWasCalled = true;
      }).then(() => {
        expect(this.catchWasCalled).toBe(false);
        done();
      });
    });

    this.showDialogs([first, last]).then(() => {
      expect(this.catchWasCalled).toBe(false);
      if (this.catchWasCalled) { return done(); }
      expect(last.renderer._dialogControllers.length).toBe(expectedEndCount + 1);
      last.renderer._escapeKeyEventHandler({ keyCode: 27 });
    });
  });

  it('does not close the top dialog, when locked, on ESC', function (done) {
    const settings = { lock: true };
    const expectedEndCount = 2;
    const first = createDialogController(settings);
    const last = createDialogController(settings);

    spyOn(first, 'cancel');
    spyOn(last, 'cancel');

    this.showDialogs([first, last]).then(() => {
      expect(this.catchWasCalled).toBe(false);
      if (this.catchWasCalled) { return done(); }
      expect(last.renderer._dialogControllers.length).toBe(expectedEndCount);
      last.renderer._escapeKeyEventHandler({ keyCode: 27 });
      expect(first.cancel).not.toHaveBeenCalled();
      expect(last.cancel).not.toHaveBeenCalled();
      expect(last.renderer._dialogControllers.length).toBe(expectedEndCount);
      done();
    });
  });

  it('does add the "ai-dialog-open" class on first open dialog', function (done) {
    const body = DOM.querySelectorAll('body')[0];
    spyOn(body.classList, 'add').and.callThrough();
    const controller = createDialogController({});

    this.showDialogs([controller]).then(() => {
      expect(this.catchWasCalled).toBe(false);
      if (this.catchWasCalled) { return done(); }
      expect(body.classList.add).toHaveBeenCalled();
      done();
    });
  });

  it('does remove the "ai-dialog-open" class on last closed dialog', function (done) {
    const body = DOM.querySelectorAll('body')[0];
    spyOn(body.classList, 'remove').and.callThrough();
    const controller = createDialogController({});

    this.showDialogs([controller]).then(() => {
      expect(this.catchWasCalled).toBe(false);
      if (this.catchWasCalled) { return done(); }
      this.closeDialog(controller).then(() => {
        expect(this.catchWasCalled).toBe(false);
        if (this.catchWasCalled) { return done(); }
        expect(body.classList.remove).toHaveBeenCalled();
        done();
      });
    });
  });

  it('does not remove the "ai-dialog-open" class when closed dialog is not last', function (done) {
    const body = DOM.querySelectorAll('body')[0];
    spyOn(body.classList, 'remove').and.callThrough();
    const first = createDialogController({});
    const last = createDialogController({});

    this.showDialogs([first, last]).then(() => {
      expect(this.catchWasCalled).toBe(false);
      if (this.catchWasCalled) { return done(); }
      this.closeDialog(last).then(() => {
        expect(this.catchWasCalled).toBe(false);
        if (this.catchWasCalled) { return done(); }
        expect(body.classList.remove).not.toHaveBeenCalled();
        done();
      });
    });
  });

  it('adds ESC key event handler only on first open dialog', function (done) {
    spyOn(DOM, 'addEventListener');
    const first = createDialogController({});
    const last = createDialogController({});

    this.showDialogs([first, last]).then(() => {
      expect(this.catchWasCalled).toBe(false);
      if (this.catchWasCalled) { return done(); }
      expect(DOM.addEventListener.calls.count()).toBe(1);
      done();
    });
  });

  it('removes ESC key event handler on last closed dialog', function (done) {
    spyOn(DOM, 'removeEventListener');
    const first = createDialogController({});

    this.showDialogs([first]).then(() => {
      expect(this.catchWasCalled).toBe(false);
      if (this.catchWasCalled) { return done(); }
      this.closeDialog(first).then(() => {
        expect(this.catchWasCalled).toBe(false);
        if (this.catchWasCalled) { return done(); }
        expect(DOM.removeEventListener.calls.count()).toBe(1);
        done();
      });
    });
  });
});
