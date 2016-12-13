import {DOM} from 'aurelia-pal';
import {DialogController} from '../../src/dialog-controller';
import {DialogRenderer, hasTransition, transitionEvent} from '../../src/dialog-renderer';
import {dialogOptions} from '../../src/dialog-options';
import {configure} from '../../src/aurelia-dialog';
import {TestElement} from '../fixtures/test-element';

const durationPropertyName = (function () {
  let durationPropertyName;
  return function () {
    if (typeof durationPropertyName !== 'undefined') return durationPropertyName;
    const propertyNames = ['transitionDuration', 'webkitTransitionDuration', 'oTransitionDuration'];
    const fakeElement =  DOM.createElement('fakeelement');
    while(propertyNames.length) {
      const propertyName = propertyNames.pop();
      if (propertyName in fakeElement.style) {
        return durationPropertyName = propertyName;
      }
    }
    return durationPropertyName = null;
  };
}());

describe('the Dialog Renderer', () => {
  function createDialogController(controllerSettings = {}) {
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

  it('does close the top dialog when enableEscClose is true', function (done) {
    const settings = { enableEscClose: true, lock: false };
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

  it('does not close the top dialog when enableEscClose is false and lock is true', function (done) {
      const settings = { enableEscClose: false, lock: true };
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
    const controller = createDialogController();

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
    const controller = createDialogController();

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
    const first = createDialogController();
    const last = createDialogController();

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
    const first = createDialogController();
    const last = createDialogController();

    this.showDialogs([first, last]).then(() => {
      expect(this.catchWasCalled).toBe(false);
      if (this.catchWasCalled) { return done(); }
      expect(DOM.addEventListener.calls.count()).toBe(1);
      done();
    });
  });

  it('removes ESC key event handler on last closed dialog', function (done) {
    spyOn(DOM, 'removeEventListener');
    const first = createDialogController();

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

  describe('accounts for transitions', function () {
    beforeEach(function () {
      this.dialogController = createDialogController();
      this.renderer = this.dialogController.renderer;
      this.awaitsTransition = false;
      const self = this;
      Object.defineProperty(this.renderer, 'modalContainer', {
        get() {
          return this._modalContainer;
        },
        set(element) {
          this._modalContainer = element;
          if (self.expectedDuration) {
            element.style[durationPropertyName()] = self.expectedDuration;
          }
          element._addEventListener = element.addEventListener;
          spyOn(element, 'addEventListener').and.callFake((...args) => {
            if (args[0] === transitionEvent()) {
              self.awaitsTransition = true;
            }
            element._addEventListener(...args);
          });
        }
      });
    });

    describe('and does not await', function () {
      it('when "inoreTransitions" is set to "true"', function (done) {
        this.dialogController.settings.ignoreTransitions = true;
        this.expectedDuration = '0.2s';
        this.renderer.showDialog(this.dialogController).then(done).catch(e => fail(e));;
        expect(this.awaitsTransition).toBe(false);
      });

      it('when duration is zero', function (done) {
        this.dialogController.settings.ignoreTransitions = false;
        this.expectedDuration = '0s';
        this.renderer.showDialog(this.dialogController).then(done).catch(e => fail(e));;
        console.log();
        expect(this.awaitsTransition).toBe(false);
      });
    });

    it('when the transition is with non-zero duration', function (done) {
      this.dialogController.settings.ignoreTransitions = false;
      this.expectedDuration = '0.3s';
      this.renderer.showDialog(this.dialogController).then(done).catch(e => fail(e));;
      expect(this.awaitsTransition).toBe(true);
    });
  });
});

describe('"hasTransition"', function () {
  beforeAll(function () {
    this.body = DOM.querySelectorAll('body')[0];
    this.durationPropertyName = durationPropertyName();
  });

  beforeEach(function () {
    this.element = DOM.createElement('duration-test-element');
    this.body.insertBefore(this.element, this.body.firstChild)
  });

  afterEach(function () {
    this.body.removeChild(this.element);
  });

  describe('reports "true" for', function () {
    describe('non zero duration transitions', function () {
      it('set in styles', function () {
        const prefixes = ['-moz-', '-webkit-', '-o-', ''];
        const transitionProperty = 'transition';
        const testClass = 'transition-test-class';
        const styles = `.${testClass} {${prefixes.map(prefix => `${prefix}${transitionProperty}: opacity .2s linear;`).join('')}}`;
        DOM.injectStyles(styles);
        this.element.classList.add(testClass);
        expect(hasTransition(this.element)).toBe(true);
      });

      it('set in code', function () {
        if (!this.durationPropertyName) {
          fail('Could not find property name for "transitionDuration"');
          return;
        }
        const duration = '0.2s';
        this.element.style[this.durationPropertyName] = duration;
        expect(hasTransition(this.element)).toBe(true);
      });
    });

    it('zero and non-zero transitions', function () {
      if (!this.durationPropertyName) {
        fail('Could not find property name for "transitionDuration"');
        return;
      }
      const duration = '0s, 0.3s';
      this.element.style[this.durationPropertyName] = duration;
      expect(hasTransition(this.element)).toBe(true);
    });
  });

  it('reports "false" for zero duration transition', function () {
    expect(hasTransition(this.element)).toBe(false);
  });
});
