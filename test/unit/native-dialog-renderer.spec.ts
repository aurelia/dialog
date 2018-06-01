import { Container } from 'aurelia-dependency-injection';
import { DOM } from 'aurelia-pal';
import { Animator } from 'aurelia-templating';
import { DialogController } from '../../src/dialog-controller';
import { DialogRendererNative } from '../../src/dialog-renderer-native';
import { DefaultDialogSettings, DialogSettings } from '../../src/dialog-settings';
import { DialogKeyboardService } from '../../src/dialog-keyboard-service';

type TestDialogRenderer = DialogRendererNative & { __controller: DialogController };

describe('DialogRendererNative', () => {
  const body = DOM.querySelectorAll('body')[0] as HTMLBodyElement;
  const rendereres = [] as TestDialogRenderer[];
  (Animator as any).instance = new Animator();

  function createRenderer(settings: DialogSettings = {}): TestDialogRenderer {
    const container = new Container();
    const keyboardService =
      jasmine.createSpyObj('DialogKeyboardService', ['enlist', 'remove']) as DialogKeyboardService;
    container.registerInstance(DialogKeyboardService, keyboardService);
    const renderer = container.get(DialogRendererNative) as TestDialogRenderer;
    renderer.getDialogContainer();
    const dialogController = jasmine.createSpyObj('DialogController', ['cancel', 'ok']) as DialogController;
    (dialogController.cancel as jasmine.Spy)
      .and
      .callFake((...args: any[]) => dialogController.renderer.hideDialog(dialogController));
    (dialogController.ok as jasmine.Spy)
      .and
      .callFake((...args: any[]) => dialogController.renderer.hideDialog(dialogController));
    dialogController.settings = Object.assign(new DefaultDialogSettings(), settings);
    dialogController.renderer = renderer;
    dialogController.controller = jasmine.createSpyObj('Controller', ['attached', 'detached']);
    dialogController.controller!.view =
      jasmine.createSpyObj('ControllerView', ['attached', 'detached', 'appendNodesTo', 'removeNodes']);
    dialogController.view = dialogController.controller!.view;
    renderer.__controller = dialogController;
    rendereres.push(renderer);
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

  afterEach(async done => {
    await Promise.all(rendereres.map(async r => {
      try {
        await r.hideDialog(r.__controller);
      // tslint:disable-next-line:no-empty
      } catch (e) { }
    }));
    done();
  });

  describe('honours the setting', () => {
    describe('"postion"', () => {
      it('and calls when provided', async done => {
        const renderer = createRenderer({ position: jasmine.createSpy('postionSpy') });
        await show(done, renderer);
        expect(renderer.__controller.settings.position)
          .toHaveBeenCalledWith(renderer.dialogContainer.element);
        done();
      });
    });

    describe('"keyboard"', () => {
      let renderer: TestDialogRenderer;
      beforeEach(async done => {
        renderer = createRenderer({ keyboard: true });
        await show(done, renderer);
        done();
      });

      it('and adds the controller to the DialogKeyboardService when showing', () => {
        expect(renderer.keyboardService.enlist).toHaveBeenCalledWith(renderer.__controller);
      });

      it('and adds the controller to the DialogKeyboardService when showing', async done => {
        await hide(done, renderer);
        expect(renderer.keyboardService.remove).toHaveBeenCalledWith(renderer.__controller);
        done();
      });
    });

    describe('"backdropDismiss"', () => {
      it('set to "false" by not closing the dialog when clicked outside it', async done => {
        const settings: DialogSettings = { overlayDismiss: false };
        const renderer = createRenderer(settings);
        await show(done, renderer);
        renderer.dialogContainer.element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        expect(renderer.__controller.cancel).not.toHaveBeenCalled();
        done();
      });

      it('set to "true" by closing the dialog when clicked outside it', async done => {
        const settings: DialogSettings = { overlayDismiss: true };
        const renderer = createRenderer(settings);
        await show(done, renderer);
        renderer.dialogContainer.element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
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
        const container = renderer.dialogContainer.element;
        expect(host.insertBefore).toHaveBeenCalledWith(container, null);
        await hide(done, renderer);
        expect(host.removeChild).toHaveBeenCalledWith(container);
        body.removeChild(host);
        done();
      });

      it('and when missing defaults to the "body" element', async done => {
        const renderer = createRenderer({ host: undefined });
        await show(done, renderer);
        expect(renderer.host.element).toBe(body);
        done();
      });
    });
  });

  describe('"backdropDismiss" handlers', () => {
    it('do not stop events propagation', async done => {
      const renderer = createRenderer();
      const event = new MouseEvent('click', { bubbles: true, cancelable: true });
      spyOn(event, 'stopPropagation').and.callThrough();
      spyOn(event, 'stopImmediatePropagation').and.callThrough();
      await show(done, renderer);
      renderer.dialogContainer.element.dispatchEvent(event);
      expect(event.stopPropagation).not.toHaveBeenCalled();
      expect(event.stopImmediatePropagation).not.toHaveBeenCalled();
      done();
    });

    it('do not cancel events', async done => {
      const renderer = createRenderer();
      const event = new MouseEvent('click');
      spyOn(event, 'preventDefault').and.callThrough();
      await show(done, renderer);
      renderer.dialogContainer.element.dispatchEvent(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
      done();
    });
  });
});
