import { DialogKeyboardService } from '../../src/dialog-keyboard-service';
import { DialogService } from '../../src/dialog-service';
import { DOM } from 'aurelia-pal';
import { DialogController, ActionKey, KeyEventType } from '../../src/aurelia-dialog';

describe(`${DialogKeyboardService.name}`, () => {
  function createDialogService(controllers: DialogController[] = []): DialogService {
    return {
      controllers
    } as DialogService;
  }

  function createKeyboardService(...controllers: DialogController[]): DialogKeyboardService {
    const service = new DialogKeyboardService(createDialogService(controllers));
    controllers.forEach(c => service.enlist(c));
    return service;
  }

  function createController(keyboard?: boolean | ActionKey | ActionKey[], keyType?: KeyEventType): DialogController;
  function createController(keyboard?: boolean | ActionKey | ActionKey[], keyType?: KeyEventType): DialogController {
    const controller = jasmine.createSpyObj(`${DialogController.name}Spy`, ['ok', 'cancel']) as DialogController;
    controller.settings = { keyboard };

    if (keyType) {
      controller.settings.keyEvent = keyType;
    }

    return controller;
  }

  it('setups keyboard listener on first added controller with meaningful "keyboard" setting', () => {
    const service = createKeyboardService();
    spyOn(DOM, 'addEventListener');
    service.enlist(createController(true));
    expect(DOM.addEventListener).toHaveBeenCalled();
  });

  it('skips adding controller if the "keyboard" setting is not meaningful', () => {
    const service = createKeyboardService();
    spyOn(DOM, 'addEventListener');
    service.enlist(createController(false));
    expect(DOM.addEventListener).not.toHaveBeenCalled();
  });

  it('clears keyboard listener on last removed controller', () => {
    const controllersCount = 5;
    const controllers = [] as DialogController[];
    for (let i = 0; i < controllersCount; i++) { controllers.push(createController(true)); }
    const service = createKeyboardService(...controllers);
    spyOn(DOM, 'removeEventListener');
    const controllersToRemove = controllersCount - 1;
    for (let i = 0; i < controllersToRemove; i++) { service.remove(controllers.pop()!); }
    expect(DOM.removeEventListener).not.toHaveBeenCalled();
    service.remove(controllers.pop()!);
    expect(DOM.removeEventListener).toHaveBeenCalled();
  });

  it('closes the top dialog if enlisted with it', () => {
    const first = createController(true);
    const top = createController(true);
    const service = createKeyboardService(first, top);
    // tslint:disable-next-line:no-unused-expression
    service;
    DOM.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape', bubbles: true }));
    expect(first.cancel).not.toHaveBeenCalled();
    expect(top.cancel).toHaveBeenCalled();
  });

  it('does not close the top dialog if not enlisted with it', () => {
    const first = createController(true);
    const top = createController(true);
    const service = createKeyboardService(first, top);
    service.remove(top);
    DOM.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape', bubbles: true }));
    expect(first.cancel).not.toHaveBeenCalled();
    expect(top.cancel).not.toHaveBeenCalled();
  });

  describe('cancels the top dialog when the "keyboard" setting is set to', () => {
    function cancelOnEscapeKeySpec(keyboard?: boolean | ActionKey | ActionKey[]) {
      const controller = createController(keyboard);
      const service = createKeyboardService(controller);
      // tslint:disable-next-line:no-unused-expression
      service;
      DOM.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape', bubbles: true }));
      expect(controller.cancel).toHaveBeenCalled();
    }

    it('"true"', () => {
      cancelOnEscapeKeySpec(true);
    });

    it('"Escape"', () => {
      cancelOnEscapeKeySpec('Escape');
    });

    it('Array containing "Escape"', () => {
      cancelOnEscapeKeySpec(['Escape']);
    });
  });

  describe('OKs the top dialog when the "keyboard" setting is set to', () => {
    function okOnEnterKeySpec(keyboard: ActionKey | ActionKey[], keyType: KeyEventType = 'keyup'): void {
      const controller = createController(keyboard, keyType);
      const service = createKeyboardService(controller);
      // tslint:disable-next-line:no-unused-expression
      service;
      DOM.dispatchEvent(new KeyboardEvent(keyType, { key: 'Enter', bubbles: true }));
      expect(controller.ok).toHaveBeenCalled();
    }

    it('"Enter"', () => {
      okOnEnterKeySpec('Enter');
    });

    it('"Enter" using keydown event', () => {
      okOnEnterKeySpec('Enter', 'keydown');
    });

    it('Array containing "Enter"', () => {
      okOnEnterKeySpec(['Enter']);
    });
  });
});
