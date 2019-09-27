import '../setup';
import { DOM } from 'aurelia-pal';
import { DialogController } from '../../src/dialog-controller';
import { NativeDialogRenderer } from '../../src/renderers/native-dialog-renderer';
import { hasTransition, transitionEvent } from '../../src/renderers/ux-dialog-renderer';
import { DefaultDialogSettings, DialogSettings } from '../../src/dialog-settings';

type TestDialogRenderer = NativeDialogRenderer & { [key: string]: any, __controller: DialogController };

const durationPropertyName = (() => {
  let durationPropertyName: string | null;
  return () => {
    if (typeof durationPropertyName !== 'undefined') { return durationPropertyName; }
    const propertyNames = ['oTransitionDuration', 'webkitTransitionDuration', 'transitionDuration']; // order matters
    const fakeElement = DOM.createElement('fakeelement') as HTMLElement;
    let propertyName: string | undefined;
    // tslint:disable-next-line:no-conditional-assignment
    while (propertyName = propertyNames.pop()) {
      if (propertyName in fakeElement.style) {
        return durationPropertyName = propertyName || null;
      }
    }
    return durationPropertyName = null;
  };
})();
const body = DOM.querySelectorAll('body')[0] as HTMLBodyElement;

describe('native-dialog-renderer.spec.ts', () => {
  function createRenderer(settings: DialogSettings = {}): TestDialogRenderer {
    const renderer = new NativeDialogRenderer() as TestDialogRenderer;
    renderer.getDialogContainer();
    const dialogController = jasmine.createSpyObj('DialogControllerSpy', ['cancel', 'ok']) as DialogController;
    (dialogController.cancel as jasmine.Spy)
      .and
      .callFake((...args: any[]) => dialogController.renderer.hideDialog(dialogController));
    (dialogController.ok as jasmine.Spy)
      .and
      .callFake((...args: any[]) => dialogController.renderer.hideDialog(dialogController));
    dialogController.settings = Object.assign(new DefaultDialogSettings(), settings);
    dialogController.renderer = renderer;
    dialogController.controller = jasmine.createSpyObj('ControllerSpy', ['attached', 'detached']);
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
    NativeDialogRenderer.dialogControllers.forEach(controller => {
      const { dialogContainer } = controller.renderer as NativeDialogRenderer;
      if (dialogContainer && dialogContainer.parentElement) {
        dialogContainer.parentElement.removeChild(dialogContainer);
      }
    });
    NativeDialogRenderer.dialogControllers = [];
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
          .toHaveBeenCalledWith(renderer.dialogContainer);
        done();
      });
    });

    describe('"keyboard"', () => {
      it('and does nothing when it is "false"', async done => {
        const settings: DialogSettings = { keyboard: false };
        const first = createRenderer(settings);
        const last = createRenderer(settings);
        await show(done, first, last);
        first.dialogContainer.dispatchEvent(new Event('cancel'));
        last.dialogContainer.dispatchEvent(new Event('cancel'));
        expect(first.__controller.cancel).not.toHaveBeenCalled();
        expect(last.__controller.cancel).not.toHaveBeenCalled();
        done();
      });

      describe('and closes with cancel', () => {
        async function closeOnEscSpec(done: DoneFn, settings: DialogSettings) {
          const renderer = createRenderer(settings);
          await show(done, renderer);
          renderer.dialogContainer.dispatchEvent(new Event('cancel'));
          expect(renderer.__controller.cancel).toHaveBeenCalled();
          done();
        }

        it('when set to "true"', done => {
          closeOnEscSpec(done, { keyboard: true });
        });

        it('when set to "Escape"', done => {
          closeOnEscSpec(done, { keyboard: 'Escape' });
        });

        it('when set to an array containing "Escape"', done => {
          closeOnEscSpec(done, { keyboard: ['Escape'] });
        });
      });

      describe('and closes with ok', () => {
        async function closeOnEscSpec(done: DoneFn, settings: DialogSettings) {
          const renderer = createRenderer(settings);
          await show(done, renderer);
          DOM.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
          expect(renderer.__controller.ok).toHaveBeenCalled();
          done();
        }

        it('when set to "Enter"', done => {
          closeOnEscSpec(done, { keyboard: 'Enter' });
        });

        it('when set to an array containing "Enter"', done => {
          closeOnEscSpec(done, { keyboard: ['Enter'] });
        });
      });
    });

    describe('"backdropDismiss"', () => {
      it('set to "false" by not closing the dialog when clicked outside it', async done => {
        const settings: DialogSettings = { overlayDismiss: false };
        const renderer = createRenderer(settings);
        await show(done, renderer);
        renderer.dialogContainer.dispatchEvent(new MouseEvent('mousedown'));
        expect(renderer.__controller.cancel).not.toHaveBeenCalled();
        done();
      });

      it('set to "true" by closing the dialog when clicked outside it', async done => {
        const settings: DialogSettings = { overlayDismiss: true };
        const renderer = createRenderer(settings);
        await show(done, renderer);
        renderer.dialogContainer.dispatchEvent(new MouseEvent('mousedown'));
        expect(renderer.__controller.cancel).toHaveBeenCalled();
        done();
      });
    });

    describe('"host"', () => {
      it('and when provided parents the dialog', async done => {
        const host = DOM.createElement('div');
        spyOn(host, 'insertBefore').and.callThrough();
        spyOn(host, 'removeChild').and.callThrough();
        body.appendChild(host);
        const settings: DialogSettings = { host };
        const renderer = createRenderer(settings);
        await show(done, renderer);
        expect(host.insertBefore).toHaveBeenCalledWith(renderer.dialogContainer, null);
        await hide(done, renderer);
        expect(host.removeChild).toHaveBeenCalledWith(renderer.dialogContainer);
        body.removeChild(host);
        done();
      });

      it('and when missing defaults to the "body" element', async done => {
        const renderer = createRenderer({ host: undefined });
        await show(done, renderer);
        expect(renderer.host).toBe(body);
        done();
      });
    });
  });

  describe('"restoreFocus"', () => {
    it('and calls the given callback on close', async done => {
      let restoreCalled = false;
      const renderer = createRenderer({ restoreFocus: () => restoreCalled = true });
      await show(done, renderer);
      expect(restoreCalled).toBe(false);
      await hide(done, renderer);
      expect(restoreCalled).toBe(true);
      done();
    });
  });

  describe('on first open dialog', () => {
    beforeEach(() => {
      expect(NativeDialogRenderer.dialogControllers.length).toBe(0);
    });

    it('adds "ux-dialog-open" class to the dialog host', async done => {
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
      expect(NativeDialogRenderer.dialogControllers.length).toBe(2);
      done();
    });
  });

  describe('on last closed dialog', () => {
    let renderers: TestDialogRenderer[];

    beforeEach(async done => {
      expect(NativeDialogRenderer.dialogControllers.length).toBe(0);
      renderers = [createRenderer(), createRenderer()];
      await show(done, ...renderers);
      done();
    });

    afterEach(() => {
      expect(NativeDialogRenderer.dialogControllers.length).toBe(0);
    });

    it('removes "ux-dialog-open" class from the dialog host', async done => {
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
      expect(NativeDialogRenderer.dialogControllers.length).toBe(0);
      await show(done, createRenderer(), renderer = createRenderer(), createRenderer());
      done();
    });

    afterEach(() => {
      expect(NativeDialogRenderer.dialogControllers.length).toBe(2);
    });

    it('does not remove "ux-dialog-open" from the dialog host', async done => {
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
        get(): HTMLDialogElement {
          return this.__dialogContainer;
        },
        set(element: HTMLDialogElement): void {
          this.__dialogContainer = element;
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
  });

  describe('"backdropDismiss" handlers', () => {
    it('do not stop events propagation', async done => {
      const renderer = createRenderer();
      const event = new MouseEvent('mousedown');
      spyOn(event, 'stopPropagation').and.callThrough();
      spyOn(event, 'stopImmediatePropagation').and.callThrough();
      await show(done, renderer);
      renderer.dialogContainer.dispatchEvent(event);
      expect(event.stopPropagation).not.toHaveBeenCalled();
      expect(event.stopImmediatePropagation).not.toHaveBeenCalled();
      done();
    });

    it('do not cancel events', async done => {
      const renderer = createRenderer();
      const event = new MouseEvent('mousedown');
      spyOn(event, 'preventDefault').and.callThrough();
      await show(done, renderer);
      renderer.dialogContainer.dispatchEvent(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
      done();
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
