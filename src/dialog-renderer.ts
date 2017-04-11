import { DOM } from 'aurelia-pal';
import { transient } from 'aurelia-dependency-injection';
import { ActionKey } from './dialog-settings';
import { Renderer } from './renderer';
import { DialogController } from './dialog-controller';

const containerTagName = 'ux-dialog-container';
const overlayTagName = 'ux-dialog-overlay';

export const transitionEvent = (() => {
  let transition: string | undefined;
  return (): string => {
    if (transition) { return transition; }
    const el = DOM.createElement('fakeelement') as HTMLElement;
    const transitions: { [key: string]: string; } = {
      transition: 'transitionend',
      OTransition: 'oTransitionEnd',
      MozTransition: 'transitionend',
      WebkitTransition: 'webkitTransitionEnd'
    };
    for (let t in transitions) { // tslint:disable-line:prefer-const
      if ((el.style as any)[t] !== undefined) {
        transition = transitions[t];
        return transition;
      }
    }
    return '';
  };
})();

export const hasTransition = (() => {
  const unprefixedName: any = 'transitionDuration';
  const el = DOM.createElement('fakeelement') as HTMLElement;
  const prefixedNames = ['webkitTransitionDuration', 'oTransitionDuration'];
  let transitionDurationName: string | undefined;
  if (unprefixedName in el.style) {
    transitionDurationName = unprefixedName;
  } else {
    transitionDurationName = prefixedNames.find(prefixed => (prefixed in el.style));
  }
  return (element: Element) => {
    return !!transitionDurationName && !!((DOM.getComputedStyle(element) as any)[transitionDurationName]
      .split(',')
      .find((duration: string) => !!parseFloat(duration)));
  };
})();

const body = DOM.querySelectorAll('body')[0] as HTMLBodyElement;

function getActionKey(e: KeyboardEvent): ActionKey | undefined {
  if ((e.code || e.key) === 'Escape' || e.keyCode === 27) {
    return 'Escape';
  }
  if ((e.code || e.key) === 'Enter' || e.keyCode === 13) {
    return 'Enter';
  }
  return undefined;
}

@transient()
export class DialogRenderer implements Renderer {
  public static dialogControllers: DialogController[] = [];

  public static keyboardEventHandler(e: KeyboardEvent) {
    const key = getActionKey(e);
    if (!key) { return; }
    const top = DialogRenderer.dialogControllers[DialogRenderer.dialogControllers.length - 1];
    if (!top || !top.settings.keyboard) { return; }
    const keyboard = top.settings.keyboard;
    if (key === 'Escape'
      && (keyboard === true || keyboard === key || (Array.isArray(keyboard) && keyboard.indexOf(key) > -1))) {
      top.cancel();
    } else if (key === 'Enter' && (keyboard === key || (Array.isArray(keyboard) && keyboard.indexOf(key) > -1))) {
      top.ok();
    }
  }

  public static trackController(dialogController: DialogController): void {
    if (!DialogRenderer.dialogControllers.length) {
      DOM.addEventListener('keyup', DialogRenderer.keyboardEventHandler, false);
    }
    DialogRenderer.dialogControllers.push(dialogController);
  }

  public static untrackController(dialogController: DialogController): void {
    const i = DialogRenderer.dialogControllers.indexOf(dialogController);
    if (i !== -1) {
      DialogRenderer.dialogControllers.splice(i, 1);
    }
    if (!DialogRenderer.dialogControllers.length) {
      DOM.removeEventListener('keyup', DialogRenderer.keyboardEventHandler, false);
    }
  }

  private stopPropagation: (e: MouseEvent & { _aureliaDialogHostClicked: boolean }) => void;
  private closeDialogClick: (e: MouseEvent & { _aureliaDialogHostClicked: boolean }) => void;

  public dialogContainer: HTMLElement;
  public dialogOverlay: HTMLElement;
  public host: Element;
  public anchor: Element;

  private getOwnElements(parent: Element, selector: string): Element[] {
    const elements = parent.querySelectorAll(selector);
    const own: Element[] = [];
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].parentElement === parent) {
        own.push(elements[i]);
      }
    }
    return own;
  }

  private attach(dialogController: DialogController): void {
    const spacingWrapper = DOM.createElement('div'); // TODO: check if redundant
    spacingWrapper.appendChild(this.anchor);
    this.dialogContainer = DOM.createElement(containerTagName) as HTMLElement;
    this.dialogContainer.appendChild(spacingWrapper);
    this.dialogOverlay = DOM.createElement(overlayTagName) as HTMLElement;
    const zIndex = typeof dialogController.settings.startingZIndex === 'number'
      ? dialogController.settings.startingZIndex + ''
      : null;
    this.dialogOverlay.style.zIndex = zIndex;
    this.dialogContainer.style.zIndex = zIndex;
    const lastContainer = this.getOwnElements(this.host, containerTagName).pop();
    if (lastContainer && lastContainer.parentElement) {
      this.host.insertBefore(this.dialogContainer, lastContainer.nextSibling);
      this.host.insertBefore(this.dialogOverlay, lastContainer.nextSibling);
    } else {
      this.host.insertBefore(this.dialogContainer, this.host.firstChild);
      this.host.insertBefore(this.dialogOverlay, this.host.firstChild);
    }
    dialogController.controller.attached();
    this.host.classList.add('ux-dialog-open');
  }

  private detach(dialogController: DialogController): void {
    this.host.removeChild(this.dialogOverlay);
    this.host.removeChild(this.dialogContainer);
    dialogController.controller.detached();
    if (!DialogRenderer.dialogControllers.length) {
      this.host.classList.remove('ux-dialog-open');
    }
  }

  private setAsActive(): void {
    this.dialogOverlay.classList.add('active');
    this.dialogContainer.classList.add('active');
  }

  private setAsInactive(): void {
    this.dialogOverlay.classList.remove('active');
    this.dialogContainer.classList.remove('active');
  }

  private setupClickHandling(dialogController: DialogController): void {
    this.stopPropagation = e => { e._aureliaDialogHostClicked = true; };
    this.closeDialogClick = e => {
      if (dialogController.settings.overlayDismiss && !e._aureliaDialogHostClicked) {
        dialogController.cancel();
        return;
      }
      if (e && typeof e.preventDefault === 'function') {
        e.preventDefault();
      }
      return false;
    };
    this.dialogContainer.addEventListener('click', this.closeDialogClick);
    this.anchor.addEventListener('click', this.stopPropagation);
  }

  private clearClickHandling(): void {
    this.dialogContainer.removeEventListener('click', this.closeDialogClick);
    this.anchor.removeEventListener('click', this.stopPropagation);
  }

  private centerDialog() {
    const child = this.dialogContainer.children[0] as HTMLElement;
    const vh = Math.max((DOM.querySelectorAll('html')[0] as HTMLElement).clientHeight, window.innerHeight || 0);
    child.style.marginTop = Math.max((vh - child.offsetHeight) / 2, 30) + 'px';
    child.style.marginBottom = Math.max((vh - child.offsetHeight) / 2, 30) + 'px';
  }

  private awaitTransition(setActiveInactive: () => void, ignore: boolean): Promise<void> {
    return new Promise<void>(resolve => {
      const renderer = this;
      const eventName = transitionEvent();
      function onTransitionEnd(e: TransitionEvent): void {
        if (e.target !== renderer.dialogContainer) {
          return;
        }
        renderer.dialogContainer.removeEventListener(eventName, onTransitionEnd);
        resolve();
      }

      if (ignore || !hasTransition(this.dialogContainer)) {
        resolve();
      } else {
        this.dialogContainer.addEventListener(eventName, onTransitionEnd);
      }
      setActiveInactive();
    });
  }

  public getDialogContainer(): Element {
    return this.anchor || (this.anchor = DOM.createElement('div'));
  }

  public showDialog(dialogController: DialogController): Promise<void> {
    if (dialogController.settings.host) {
      this.host = dialogController.settings.host;
    } else {
      this.host = body;
    }
    const settings = dialogController.settings;
    this.attach(dialogController);

    if (typeof settings.position === 'function') {
      settings.position(this.dialogContainer, this.dialogOverlay);
    } else if (!settings.centerHorizontalOnly) {
      this.centerDialog();
    }

    DialogRenderer.trackController(dialogController);
    this.setupClickHandling(dialogController);
    return this.awaitTransition(() => this.setAsActive(), dialogController.settings.ignoreTransitions as boolean);
  }

  public hideDialog(dialogController: DialogController) {
    this.clearClickHandling();
    DialogRenderer.untrackController(dialogController);
    return this.awaitTransition(() => this.setAsInactive(), dialogController.settings.ignoreTransitions as boolean)
      .then(() => { this.detach(dialogController); });
  }
}
