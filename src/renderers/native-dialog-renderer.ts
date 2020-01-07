import { DOM } from 'aurelia-pal';

import { transient } from 'aurelia-dependency-injection';

import { DialogController } from '../dialog-controller';
import { MouseEventType } from '../dialog-settings';
import { Renderer } from '../renderer';

import { transitionEvent, hasTransition } from './ux-dialog-renderer';

const containerTagName = 'dialog';
let body: HTMLBodyElement;

@transient()
export class NativeDialogRenderer implements Renderer {
  public static dialogControllers: DialogController[] = [];

  public static keyboardEventHandler(e: KeyboardEvent) {
    const key = (e.code || e.key) === 'Enter' || e.keyCode === 13
    ? 'Enter'
    : undefined;

    if (!key) { return; }
    const top = NativeDialogRenderer.dialogControllers[NativeDialogRenderer.dialogControllers.length - 1];
    if (!top || !top.settings.keyboard) { return; }
    const keyboard = top.settings.keyboard;
    if (key === 'Enter' && (keyboard === key || (Array.isArray(keyboard) && keyboard.indexOf(key) > -1))) {
      top.ok();
    }
  }

  public static trackController(dialogController: DialogController): void {
    if (!NativeDialogRenderer.dialogControllers.length) {
      DOM.addEventListener('keyup', NativeDialogRenderer.keyboardEventHandler, false);
    }
    NativeDialogRenderer.dialogControllers.push(dialogController);
  }

  public static untrackController(dialogController: DialogController): void {
    const i = NativeDialogRenderer.dialogControllers.indexOf(dialogController);
    if (i !== -1) {
      NativeDialogRenderer.dialogControllers.splice(i, 1);
    }
    if (!NativeDialogRenderer.dialogControllers.length) {
      DOM.removeEventListener('keyup', NativeDialogRenderer.keyboardEventHandler, false);
    }
  }

  private stopPropagation: (e: MouseEvent & { _aureliaDialogHostClicked: boolean }) => void;
  private closeDialogClick: (e: MouseEvent & { _aureliaDialogHostClicked: boolean }) => void;
  private dialogCancel: (e: Event) => void;

  public dialogContainer: HTMLDialogElement;
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
    this.dialogContainer = DOM.createElement(containerTagName) as HTMLDialogElement;
    if ((window as any).dialogPolyfill) {
      (window as any).dialogPolyfill.registerDialog(this.dialogContainer);
    }

    this.dialogContainer.appendChild(spacingWrapper);

    const lastContainer = this.getOwnElements(this.host, containerTagName).pop();
    if (lastContainer && lastContainer.parentElement) {
      this.host.insertBefore(this.dialogContainer, lastContainer.nextSibling);
    } else {
      this.host.insertBefore(this.dialogContainer, this.host.firstChild);
    }
    dialogController.controller.attached();
    this.host.classList.add('ux-dialog-open');
  }

  private detach(dialogController: DialogController): void {
    // This check only seems required for the polyfill
    if (this.dialogContainer.hasAttribute('open')) {
      this.dialogContainer.close();
    }

    this.host.removeChild(this.dialogContainer);
    dialogController.controller.detached();
    if (!NativeDialogRenderer.dialogControllers.length) {
      this.host.classList.remove('ux-dialog-open');
    }
    if (dialogController.settings.restoreFocus) {
      dialogController.settings.restoreFocus(this.lastActiveElement);
    }
  }

  private setAsActive(): void {
    this.dialogContainer.showModal();
    this.dialogContainer.classList.add('active');
  }

  private setAsInactive(): void {
    this.dialogContainer.classList.remove('active');
  }

  private setupEventHandling(dialogController: DialogController): void {
    this.stopPropagation = e => { e._aureliaDialogHostClicked = true; };
    this.closeDialogClick = e => {
      if (dialogController.settings.overlayDismiss && !e._aureliaDialogHostClicked) {
        dialogController.cancel();
      }
    };
    this.dialogCancel = e => {
      const keyboard = dialogController.settings.keyboard;
      const key = 'Escape';

      if (keyboard === true || keyboard === key || (Array.isArray(keyboard) && keyboard.indexOf(key) > -1)) {
        dialogController.cancel();
      } else {
        e.preventDefault();
      }
    };
    const mouseEvent: MouseEventType = dialogController.settings.mouseEvent || 'click';
    this.dialogContainer.addEventListener(mouseEvent, this.closeDialogClick);
    this.dialogContainer.addEventListener('cancel', this.dialogCancel);
    this.anchor.addEventListener(mouseEvent, this.stopPropagation);
  }

  private clearEventHandling(dialogController: DialogController): void {
    const mouseEvent: MouseEventType = dialogController.settings.mouseEvent || 'click';
    this.dialogContainer.removeEventListener(mouseEvent, this.closeDialogClick);
    this.dialogContainer.removeEventListener('cancel', this.dialogCancel);
    this.anchor.removeEventListener(mouseEvent, this.stopPropagation);
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
      settings.position(this.dialogContainer);
    }

    NativeDialogRenderer.trackController(dialogController);
    this.setupEventHandling(dialogController);
    return this.awaitTransition(() => this.setAsActive(), dialogController.settings.ignoreTransitions as boolean);
  }

  public hideDialog(dialogController: DialogController): Promise<void> {
    this.clearEventHandling(dialogController);
    NativeDialogRenderer.untrackController(dialogController);
    return this.awaitTransition(() => this.setAsInactive(), dialogController.settings.ignoreTransitions as boolean)
      .then(() => { this.detach(dialogController); });
  }
}
