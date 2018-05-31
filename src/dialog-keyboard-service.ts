import { DOM } from 'aurelia-pal';
import { DialogController } from './dialog-controller';
import { ActionKey } from './dialog-settings';
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

  private addListener(): void {
    DOM.addEventListener('keyup', this.keyboardHandler, false);
  }

  private removeListener(): void {
    DOM.removeEventListener('keyup', this.keyboardHandler, false);
  }

  public enlist(controller: DialogController): void {
    if (!controller.settings.keyboard) { return; }
    if (!this.controllers.size) {
      this.addListener();
    }
    this.controllers.add(controller);
  }

  public remove(controller: DialogController): void {
    if (!this.controllers.has(controller)) { return; }
    this.controllers.delete(controller);
    if (!this.controllers.size) {
      this.removeListener();
    }
  }
}
