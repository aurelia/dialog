import { Container } from 'aurelia-dependency-injection';
import { Animator } from 'aurelia-templating';
import { DOM } from 'aurelia-pal';
import { DialogController } from '../../src/dialog-controller';
import { DialogRendererDefault } from '../../src/dialog-renderer-default';
import { DefaultDialogSettings, DialogSettings } from '../../src/dialog-settings';
import { DialogKeyboardService } from '../../src/dialog-keyboard-service';

type TestDialogRenderer =
  DialogRendererDefault & { __controller: DialogController };

describe('DialogRendererDefault', () => {
  const body = DOM.querySelectorAll('body')[0] as HTMLBodyElement;
  const rendereres = [] as TestDialogRenderer[];
  (Animator as any).instance = new Animator();

  function createRenderer(settings: DialogSettings = {}): TestDialogRenderer {
    const container = new Container();
    const keyboardService =
      jasmine.createSpyObj('DialogKeyboardService', ['enlist', 'remove']) as DialogKeyboardService;
    container.registerInstance(DialogKeyboardService, keyboardService);
    const renderer = container.get(DialogRendererDefault) as TestDialogRenderer;
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

  // async function wait(timeout: number): Promise<any> {
  //   return new Promise(res => setTimeout(res, timeout));
  // }

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
          .toHaveBeenCalledWith(renderer.dialogContainer.element, renderer.dialogOverlay);
        done();
      });
    });

    // TODO: add test that the controller is enlisted with the DialogKeyboardService
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
        renderer.dialogOverlay.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        expect(renderer.__controller.cancel).not.toHaveBeenCalled();
        done();
      });

      it('set to "true" by closing the dialog when clicked outside it', async done => {
        const settings: DialogSettings = { overlayDismiss: true };
        const renderer = createRenderer(settings);
        await show(done, renderer);
        spyOn(renderer, 'contentInboundClick').and.callThrough();
        renderer.dialogOverlay.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        expect(renderer.contentInboundClick).not.toHaveBeenCalled();
        expect(renderer.__controller.cancel).toHaveBeenCalled();
        done();
      });
    });

    describe('"host"', () => {
      it('and when provided parents the dialog', async done => {
        const hostElement = DOM.createElement('div');
        spyOn(hostElement, 'insertBefore').and.callThrough();
        spyOn(hostElement, 'removeChild').and.callThrough();
        body.appendChild(hostElement);
        const settings: DialogSettings = { host: hostElement };
        const renderer = createRenderer(settings);
        await show(done, renderer);
        expect(hostElement.insertBefore).toHaveBeenCalledWith(renderer.dialogLayout, null);
        const layout = renderer.dialogLayout;
        await hide(done, renderer);
        expect(hostElement.removeChild).toHaveBeenCalledWith(layout);
        body.removeChild(hostElement);
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
      const event = new MouseEvent('click', { bubbles: true, cancelable: true });
      spyOn(event, 'preventDefault').and.callThrough();
      await show(done, renderer);
      renderer.dialogContainer.element.dispatchEvent(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
      done();
    });
  });

  describe('when showing a dialog', () => {
    it('adds it to the "container"', async done => {
      const renderer = createRenderer();
      const order = [] as string[];
      const view = renderer.__controller.view;
      (view.appendNodesTo as jasmine.Spy).and.callFake(() => { order.push('appendNodesTo'); });
      (view.attached as jasmine.Spy).and.callFake(() => { order.push('attached'); });
      await show(done, renderer);
      expect(view.appendNodesTo).toHaveBeenCalledWith(renderer.dialogContainer.element);
      expect(view.attached).toHaveBeenCalled();
      expect(order).toEqual(['appendNodesTo', 'attached']);
      done();
    });

    // it('awaits adding it to the "ViewSlot"', async done => {
    //   const renderer = createRenderer();
    //   let asyncWorkDone = false;
    //   spyOn(renderer.viewSlot, 'add').and.callFake(async () => {
    //     await wait(400);
    //     asyncWorkDone = true;
    //   });
    //   await show(done, renderer);
    //   expect(asyncWorkDone).toBe(true);
    //   done();
    // });
  });

  describe('when hiding a dialog', () => {
    it('removes it from the "ViewSlot"', async done => {
      const renderer = createRenderer();
      const order = [] as string[];
      const view = renderer.__controller.view;
      (view.removeNodes as jasmine.Spy).and.callFake(() => { order.push('removeNodes'); });
      (view.detached as jasmine.Spy).and.callFake(() => { order.push('detached'); });
      await show(done, renderer);
      await hide(done, renderer);
      expect(view.removeNodes).toHaveBeenCalled();
      expect(view.detached).toHaveBeenCalled();
      expect(order).toEqual(['removeNodes', 'detached']);
      done();
    });

    // it('awaits removing it from the "ViewSlot"', async done => {
    //   const renderer = createRenderer();
    //   let asyncWorkDone = false;
    //   spyOn(renderer.viewSlot, 'remove').and.callFake(async () => {
    //     await wait(400);
    //     asyncWorkDone = true;
    //   });
    //   await show(done, renderer);
    //   await hide(done, renderer);
    //   expect(asyncWorkDone).toBe(true);
    //   done();
    // });
  });
});
