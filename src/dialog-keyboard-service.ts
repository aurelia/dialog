import { DOM } from 'aurelia-pal';
import { DialogController } from './dialog-controller';
import { ActionKey, KeyEventType } from './dialog-settings';
import { DialogService } from './dialog-service';

function getActionKey(eo: KeyboardEvent): ActionKey | undefined {
  if ((eo.code || eo.key) === 'Escape' || eo.keyCode === 27) {
    return 'Escape';
  }
  if ((eo.code || eo.key) === 'Enter' || eo.keyCode === 13) {
    return 'Enter';
  }
  return undefined;
}

/**
 * @internal
 */
export class DialogKeyboardService {
  private controllers: Set<DialogController> = new Set();
  private keyboardHandler: (eo: KeyboardEvent) => void;

  // tslint:disable-next-line:member-ordering
  public static inject = [DialogService];
  public constructor(dialogService: DialogService) {
    this.keyboardHandler = eo => {
      const key = getActionKey(eo);
      if (!key) { return; }
      const top = dialogService.controllers[dialogService.controllers.length - 1];
      if (!top || !this.controllers.has(top)) { return; }
      const keyboard = top.settings.keyboard;
      if (key === 'Escape'
        && (keyboard === true || keyboard === key || (Array.isArray(keyboard) && keyboard.indexOf(key) > -1))) {
        top.cancel();
      } else if (key === 'Enter'
        && (keyboard === key || (Array.isArray(keyboard) && keyboard.indexOf(key) > -1))) {
        top.ok();
      }
    };
  }

  private addListener(keyEvent: KeyEventType = 'keyup'): void {
    DOM.addEventListener(keyEvent, this.keyboardHandler, false);
  }

  private removeListener(keyEvent: KeyEventType = 'keyup'): void {
    DOM.removeEventListener(keyEvent, this.keyboardHandler, false);
  }

  public enlist(controller: DialogController): void {
    if (!controller.settings.keyboard) { return; }
    const controllers = this.controllers;
    if (!controllers.size) {
      this.addListener(controller.settings.keyEvent);
    }
    controllers.add(controller);
  }

  public remove(controller: DialogController): void {
    const controllers = this.controllers;

    if (!controllers.has(controller)) {
      return;
    }

    controllers.delete(controller);

    if (!controllers.size) {
      this.removeListener();
    }
  }
}
