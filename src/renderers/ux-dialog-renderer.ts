import { DOM } from 'aurelia-pal';
import { transient } from 'aurelia-dependency-injection';
import { ActionKey } from '../dialog-settings';
import { Renderer } from '../renderer';
import { DialogController } from '../dialog-controller';

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
  const prefixedNames = ['webkitTransitionDuration', 'oTransitionDuration'];
  let el: HTMLElement;
  let transitionDurationName: string | undefined;
  return (element: Element) => {
    if (!el) {
      el = DOM.createElement('fakeelement') as HTMLElement;
      if (unprefixedName in el.style) {
        transitionDurationName = unprefixedName;
      } else {
        transitionDurationName = prefixedNames.find(prefixed => (prefixed in el.style));
      }
    }
    return !!transitionDurationName && !!((DOM.getComputedStyle(element) as any)[transitionDurationName]
      .split(',')
      .find((duration: string) => !!parseFloat(duration)));
  };
})();

let body: HTMLBodyElement;

function getActionKey(e: KeyboardEvent): ActionKey | undefined {
  if ((e.code || e.key) === 'Escape' || e.keyCode === 27) {
    return 'Escape';
  }
  if ((e.code || e.key) === 'Enter' || e.keyCode === 13) {
    return 'Enter';
  }
  return undefined;
}

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
    const trackedDialogControllers = DialogRenderer.dialogControllers;
    if (!trackedDialogControllers.length) {
      DOM.addEventListener(dialogController.settings.keyEvent || 'keyup', DialogRenderer.keyboardEventHandler, false);
    }
    trackedDialogControllers.push(dialogController);
  }

  public static untrackController(dialogController: DialogController): void {
    const trackedDialogControllers = DialogRenderer.dialogControllers;
    const i = trackedDialogControllers.indexOf(dialogController);
    if (i !== -1) {
      trackedDialogControllers.splice(i, 1);
    }
    if (!trackedDialogControllers.length) {
      DOM.removeEventListener(
        dialogController.settings.keyEvent || 'keyup',
        DialogRenderer.keyboardEventHandler,
        false
      );
    }
  }

  private stopPropagation: (e: MouseEvent & { _aureliaDialogHostClicked: boolean }) => void;
  private closeDialogClick: (e: MouseEvent & { _aureliaDialogHostClicked: boolean }) => void;

  public dialogContainer: HTMLElement;
  public dialogOverlay: HTMLElement;
  public lastActiveElement: HTMLElement;
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
    if (dialogController.settings.restoreFocus) {
      this.lastActiveElement = DOM.activeElement as HTMLElement;
    }

    const spacingWrapper = DOM.createElement('div'); // TODO: check if redundant
    spacingWrapper.appendChild(this.anchor);

    const dialogContainer = this.dialogContainer = DOM.createElement(containerTagName) as HTMLElement;
    dialogContainer.appendChild(spacingWrapper);

    const dialogOverlay = this.dialogOverlay = DOM.createElement(overlayTagName) as HTMLElement;
    const zIndex = typeof dialogController.settings.startingZIndex === 'number'
      ? dialogController.settings.startingZIndex + ''
      : null;

    dialogOverlay.style.zIndex = zIndex;
    dialogContainer.style.zIndex = zIndex;

    const host = this.host;
    const lastContainer = this.getOwnElements(host, containerTagName).pop();

    if (lastContainer && lastContainer.parentElement) {
      host.insertBefore(dialogContainer, lastContainer.nextSibling);
      host.insertBefore(dialogOverlay, lastContainer.nextSibling);
    } else {
      host.insertBefore(dialogContainer, host.firstChild);
      host.insertBefore(dialogOverlay, host.firstChild);
    }
    dialogController.controller.attached();
    host.classList.add('ux-dialog-open');
  }

  private detach(dialogController: DialogController): void {
    const host = this.host;
    host.removeChild(this.dialogOverlay);
    host.removeChild(this.dialogContainer);
    dialogController.controller.detached();
    if (!DialogRenderer.dialogControllers.length) {
      host.classList.remove('ux-dialog-open');
    }
    if (dialogController.settings.restoreFocus) {
      dialogController.settings.restoreFocus(this.lastActiveElement);
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
      }
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
      // tslint:disable-next-line:no-this-assignment
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
    if (!body) {
      body = DOM.querySelector('body') as HTMLBodyElement;
    }
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

// avoid unnecessary code
transient()(DialogRenderer);

export { DialogRenderer as UxDialogRenderer }
