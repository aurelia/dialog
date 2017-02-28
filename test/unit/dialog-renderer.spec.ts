import {DOM} from 'aurelia-pal';
import {DialogController} from '../../src/dialog-controller';
import {DialogRenderer, hasTransition, transitionEvent} from '../../src/dialog-renderer';
import {DefaultDialogSettings, DialogSettings} from '../../src/dialog-settings';

type TestDialogRenderer = DialogRenderer & { [key: string]: any, __controller: DialogController };

const durationPropertyName = (() => {
  let durationPropertyName: string | null;
  return () => {
    if (typeof durationPropertyName !== 'undefined') { return durationPropertyName; }
    const propertyNames = ['oTransitionDuration', 'webkitTransitionDuration', 'transitionDuration']; // order matters
    const fakeElement = DOM.createElement('fakeelement') as HTMLElement;
    while (propertyNames.length) {
      const propertyName = propertyNames.pop();
      if (propertyName in fakeElement.style) {
        return durationPropertyName = propertyName || null;
      }
    }
    return durationPropertyName = null;
  };
})();
const body = DOM.querySelectorAll('body')[0] as HTMLBodyElement;

describe('DialogRenderer', () => {
  function createRenderer(settings: DialogSettings = {}): TestDialogRenderer {
    const renderer = new DialogRenderer() as TestDialogRenderer;
    renderer.getDialogContainer();
    const dialogController = jasmine.createSpyObj('DialogControllerSpy', ['cancel']) as DialogController;
    (dialogController.cancel as jasmine.Spy)
      .and
      .callFake((...args: any[]) => dialogController.renderer.hideDialog(dialogController));
    dialogController.settings = Object.assign(new DefaultDialogSettings(), settings);
    dialogController.renderer = renderer;
    dialogController.controller = jasmine.createSpyObj('ViewSlotSpy', ['attached', 'detached']);
    renderer.__controller = dialogController;
    return renderer as any;
  }

  async function showOrHide(action: 'showDialog' | 'hideDialog', done: DoneFn, ...rendereres: TestDialogRenderer[]) {
    try {
      await Promise.all(rendereres.map(renderer => renderer[action](renderer.__controller)));
    } catch (e) {
      done.fail(e);
      throw e;
    }
  }

  function show(done: DoneFn, ...rendereres: TestDialogRenderer[]) {
    return showOrHide('showDialog', done, ...rendereres);
  }

  function hide(done: DoneFn, ...rendereres: TestDialogRenderer[]) {
    return showOrHide('hideDialog', done, ...rendereres);
  }

  function cleanDOM(): void {
    DialogRenderer.dialogControllers.forEach(controller => {
      const { dialogContainer, dialogOverlay } = controller.renderer as DialogRenderer;
      if (dialogOverlay && dialogOverlay.parentElement) {
        dialogOverlay.parentElement.removeChild(dialogOverlay);
      }
      if (dialogContainer && dialogContainer.parentElement) {
        dialogContainer.parentElement.removeChild(dialogContainer);
      }
    });
    DialogRenderer.dialogControllers = [];
  }

  afterEach(() => {
    cleanDOM();
  });

  describe('honours the setting', () => {
    describe('"postion"', () => {
      it('and calls when provided', async done => {
        const renderer = createRenderer({ position: jasmine.createSpy('postionSpy') });
        await show(done, renderer);
        expect(renderer.__controller.settings.position)
          .toHaveBeenCalledWith(renderer.dialogContainer, renderer.dialogOverlay);
        done();
      });
    });

    describe('"lock"', () => {
      describe('and when set to "true"', () => {
        const settings: DialogSettings = { lock: true };

        it('does not close the top dialog on ESC', async done => {
          const first = createRenderer(settings);
          const last = createRenderer(settings);
          spyOn(first, 'hideDialog').and.callThrough();
          spyOn(last, 'hideDialog').and.callThrough();
          await show(done, first, last);
          DOM.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape' }));
          expect(first.hideDialog).not.toHaveBeenCalled();
          expect(last.hideDialog).not.toHaveBeenCalled();
          done();
        });

        it('click outside the dialog does not close it', async done => {
          const renderer = createRenderer(settings);
          await show(done, renderer);
          spyOn(renderer, 'hideDialog');
          renderer.dialogContainer.dispatchEvent(new MouseEvent('click'));
          expect(renderer.hideDialog).not.toHaveBeenCalled();
          done();
        });
      });

      describe('and when set to "false"', () => {
        const settings: DialogSettings = { lock: false };

        it('closes the top dialog on ESC', async done => {
          const first = createRenderer(settings);
          const last = createRenderer(settings);
          spyOn(first, 'hideDialog').and.callThrough();
          spyOn(last, 'hideDialog').and.callThrough();
          await show(done, first, last);
          DOM.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape' }));
          expect(first.hideDialog).not.toHaveBeenCalled();
          expect(last.hideDialog).toHaveBeenCalled();
          done();
        });

        it('click outside the dialog does close it', async done => {
          const renderer = createRenderer(settings);
          await show(done, renderer);
          spyOn(renderer, 'hideDialog');
          renderer.dialogContainer.dispatchEvent(new MouseEvent('click'));
          expect(renderer.hideDialog).toHaveBeenCalled();
          done();
        });
      });
    });

    describe('"enableEscClose"', () => {
      describe('and when set to "true"', () => {
        const settings: DialogSettings = { enableEscClose: true };

        it('closes the top dialog on ESC', async done => {
          const first = createRenderer(settings);
          const last = createRenderer(settings);
          spyOn(first, 'hideDialog').and.callThrough();
          spyOn(last, 'hideDialog').and.callThrough();
          await show(done, first, last);
          DOM.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape' }));
          expect(first.hideDialog).not.toHaveBeenCalled();
          expect(last.hideDialog).toHaveBeenCalled();
          done();
        });

        it('overrides "lock"', async done => {
          const first = createRenderer(Object.assign({ lock: true }, settings));
          const last = createRenderer(Object.assign({ lock: true }, settings));
          spyOn(first, 'hideDialog').and.callThrough();
          spyOn(last, 'hideDialog').and.callThrough();
          await show(done, first, last);
          DOM.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape' }));
          expect(first.hideDialog).not.toHaveBeenCalled();
          expect(last.hideDialog).toHaveBeenCalled();
          done();
        });
      });
    });
  });

  describe('on first open dialog', () => {
    beforeEach(() => {
      expect(DialogRenderer.dialogControllers.length).toBe(0);
    });

    it('adds "ai-dialog-open" class to the dialog host', async done => {
      spyOn(body.classList, 'add').and.callThrough();
      const renderer = createRenderer();
      await show(done, renderer);
      expect(body.classList.add).toHaveBeenCalled();
      done();
    });

    it('sets ESC key event handler', async done => {
      spyOn(DOM, 'addEventListener');
      const first = createRenderer();
      const last = createRenderer();
      await show(done, first, last);
      expect(DOM.addEventListener).toHaveBeenCalledWith('keyup', jasmine.any(Function), false);
      expect((DOM.addEventListener as jasmine.Spy).calls.count()).toBe(1);
      expect(DialogRenderer.dialogControllers.length).toBe(2);
      done();
    });
  });

  describe('on last closed dialog', () => {
    let renderers: TestDialogRenderer[];

    beforeEach(async done => {
      expect(DialogRenderer.dialogControllers.length).toBe(0);
      renderers = [createRenderer(), createRenderer()];
      await show(done, ...renderers);
      done();
    });

    afterEach(() => {
      expect(DialogRenderer.dialogControllers.length).toBe(0);
    });

    it('removes "ai-dialog-open" class from the dialog host', async done => {
      spyOn(body.classList, 'remove').and.callThrough();
      await hide(done, ...renderers);
      expect(body.classList.remove).toHaveBeenCalled();
      done();
    });

    it('removes ESC key event handler', async done => {
      spyOn(DOM, 'removeEventListener');
      await hide(done, ...renderers);
      expect(DOM.removeEventListener).toHaveBeenCalledWith('keyup', jasmine.any(Function), false);
      expect((DOM.removeEventListener as jasmine.Spy).calls.count()).toBe(1);
      done();
    });
  });

  describe('on not last closed dialog', () => {
    let renderer: TestDialogRenderer;

    beforeEach(async done => {
      expect(DialogRenderer.dialogControllers.length).toBe(0);
      await show(done, createRenderer(), renderer = createRenderer(), createRenderer());
      done();
    });

    afterEach(() => {
      expect(DialogRenderer.dialogControllers.length).toBe(2);
    });

    it('does not remove "ai-dialog-open" from the dialog host', async done => {
      spyOn(body.classList, 'remove').and.callThrough();
      await hide(done, renderer);
      expect(body.classList.remove).not.toHaveBeenCalled();
      done();
    });

    it('does not remove the ESC key event handler', async done => {
      spyOn(DOM, 'removeEventListener');
      await hide(done, renderer);
      expect(DOM.removeEventListener).not.toHaveBeenCalledWith('keyup', jasmine.any(Function), false);
      expect((DOM.removeEventListener as jasmine.Spy).calls.count()).toBe(0);
      done();
    });
  });

  describe('accounts for transitions', () => {
    let renderer: TestDialogRenderer;
    let transitionDuration: string;

    beforeEach(() => {
      renderer = createRenderer();
      spyOn(renderer, 'setAsActive').and.callFake(() => { // transition trigger
        renderer.dialogContainer.style.opacity = '1';
      });
      spyOn(renderer, 'setAsInactive').and.callFake(() => { // transition trigger
        renderer.dialogContainer.style.opacity = '0';
      });
      Object.defineProperty(renderer, 'dialogContainer', { // is set in ".showDialog()"
        get: (): HTMLElement => {
          return this.dialogContainer;
        },
        set: (element: HTMLElement): void => {
          this.dialogContainer = element;
          element.style[durationPropertyName() as any] = transitionDuration;
          element.style.opacity = '0'; // init
          spyOn(element, 'addEventListener').and.callThrough();
        }
      });
    });

    describe('and when "inoreTransitions" is set to "true"', () => {
      it('"showDialog" does not wait', async done => {
        renderer.__controller.settings.ignoreTransitions = true;
        transitionDuration = '1s';
        await show(done, renderer);
        expect(renderer.dialogContainer.addEventListener)
          .not.toHaveBeenCalledWith(transitionEvent(), jasmine.any(Function));
        done();
      });

      it('"hideDialog" does not wait', async done => {
        renderer.__controller.settings.ignoreTransitions = true;
        transitionDuration = '1s';
        await show(done, renderer);
        spyOn(renderer.dialogContainer, 'removeEventListener').and.callThrough();
        await hide(done, renderer);
        expect(renderer.dialogContainer.removeEventListener)
          .not.toHaveBeenCalledWith(transitionEvent(), jasmine.any(Function));
        done();
      });
    });

    describe('and when the transition duration is zero', () => {
      it('"showDialog" does not await', async done => {
        renderer.__controller.settings.ignoreTransitions = false;
        transitionDuration = '0s';
        await show(done, renderer);
        expect(renderer.dialogContainer.addEventListener)
          .not.toHaveBeenCalledWith(transitionEvent(), jasmine.any(Function));
        done();
      });

      it('"hideDialog" does not await', async done => {
        renderer.__controller.settings.ignoreTransitions = false;
        transitionDuration = '0s';
        await show(done, renderer);
        spyOn(renderer.dialogContainer, 'removeEventListener').and.callThrough();
        await hide(done, renderer);
        expect(renderer.dialogContainer.removeEventListener)
          .not.toHaveBeenCalledWith(transitionEvent(), jasmine.any(Function));
        done();
      });
    });

    describe('and when the transition duration is non-zero', () => {
      it('"showDialog" awaits', async done => {
        renderer.__controller.settings.ignoreTransitions = false;
        transitionDuration = '1.1s';
        await show(done, renderer);
        expect(renderer.dialogContainer.addEventListener)
          .toHaveBeenCalledWith(transitionEvent(), jasmine.any(Function));
        done();
      });

      it('"hideDialog" awaits', async done => {
        renderer.__controller.settings.ignoreTransitions = false;
        transitionDuration = '0.4s';
        await show(done, renderer);
        spyOn(renderer.dialogContainer, 'removeEventListener').and.callThrough();
        await hide(done, renderer);
        expect(renderer.dialogContainer.removeEventListener)
          .toHaveBeenCalledWith(transitionEvent(), jasmine.any(Function));
        done();
      });
    });
  });
});

describe('"hasTransition"', () => {
  let element: HTMLElement;

  function skip(): boolean {
    if (durationPropertyName()) { return false; }
    pending('Skipped because css transitions are not supported.');
    return true;
  }

  beforeEach(() => {
    if (skip()) { return; }
    element = DOM.createElement('duration-test-element') as any;
    body.insertBefore(element, body.firstChild);
  });

  afterEach(() => {
    if (!durationPropertyName()) { return; }
    body.removeChild(element);
  });

  it('reports "true" for non zero duration transitions set in styles', () => {
    const prefixes = ['-moz-', '-webkit-', '-o-', ''];
    const transitionProperty = 'transition';
    const testClass = 'transition-test-class';
    // tslint:disable-next-line:max-line-length
    const styles = `.${testClass} {${prefixes.map(prefix => `${prefix}${transitionProperty}: opacity .2s linear;`).join('')}}`;
    DOM.injectStyles(styles);
    element.classList.add(testClass);
    expect(hasTransition(element)).toBe(true);
  });

  it('reports "true" for non zero duration transitions set in code', () => {
    const duration = '0.2s';
    (element.style as any)[durationPropertyName() as string] = duration;
    expect(hasTransition(element)).toBe(true);
  });

  it('reports "true" for zero and non-zero transitions', () => {
    const duration = '0s, 0.3s';
    (element.style as any)[durationPropertyName() as string] = duration;
    expect(hasTransition(element)).toBe(true);
  });

  it('reports "false" for zero duration transition', () => {
    expect(hasTransition(element)).toBe(false);
  });
});
