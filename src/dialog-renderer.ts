import { DOM } from 'aurelia-pal';
import { transient } from 'aurelia-dependency-injection';
import { ViewSlot, Animator } from 'aurelia-templating';
import { ActionKey } from './dialog-settings';
import { Renderer } from './renderer';
import { InfrastructureDialogController } from './infrastructure-dialog-controller';

const containerTagName = 'ux-dialog-container';
const overlayTagName = 'ux-dialog-overlay';

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

@transient()
export class DialogRenderer implements Renderer {
  public static dialogControllers: InfrastructureDialogController[] = [];

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

  public static trackController(dialogController: InfrastructureDialogController): void {
    if (!DialogRenderer.dialogControllers.length) {
      DOM.addEventListener('keyup', DialogRenderer.keyboardEventHandler, false);
    }
    DialogRenderer.dialogControllers.push(dialogController);
  }

  public static untrackController(dialogController: InfrastructureDialogController): void {
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
  private viewSlot: ViewSlot;

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

  private attach(dialogController: InfrastructureDialogController): void {
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
    this.host.classList.add('ux-dialog-open'); // TODO: probably set after the animation is done
  }

  private detach(): void {
    this.host.removeChild(this.dialogOverlay);
    this.host.removeChild(this.dialogContainer);
    if (!DialogRenderer.dialogControllers.length) {
      this.host.classList.remove('ux-dialog-open');
    }
  }

  private setupClickHandling(dialogController: InfrastructureDialogController): void {
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

  public getDialogContainer(): Element {
    return this.anchor || (this.anchor = DOM.createElement('div'));
  }

  public showDialog(dialogController: InfrastructureDialogController): Promise<void> {
    if (!body) {
      body = DOM.querySelectorAll('body')[0] as HTMLBodyElement;
    }
    const settings = dialogController.settings;
    if (settings.host) {
      this.host = settings.host;
    } else {
      this.host = body;
    }
    this.viewSlot = new ViewSlot(this.anchor, true);
    this.attach(dialogController);
    if (typeof settings.position === 'function') {
      settings.position(this.dialogContainer, this.dialogOverlay);
    } else if (!settings.centerHorizontalOnly) {
      this.centerDialog();
    }

    DialogRenderer.trackController(dialogController);
    this.setupClickHandling(dialogController);
    this.viewSlot.attached();
    const addResult = this.viewSlot.add(dialogController.view);
    if (!addResult) {
      return Promise.resolve();
    }
    return Promise.all([
      addResult,
      (this.viewSlot as ViewSlot & { animator: Animator }).animator.enter(this.dialogOverlay)
    ]) as any;
  }

  public hideDialog(dialogController: InfrastructureDialogController): Promise<void> {
    this.clearClickHandling();
    DialogRenderer.untrackController(dialogController);
    const removeResult = this.viewSlot.remove(dialogController.view);
    if (!removeResult) {
      this.detach();
      return Promise.resolve();
    }
    return Promise.all([
      removeResult,
      (this.viewSlot as any).animator.leave(this.dialogOverlay)
    ]).then(() => this.detach());
  }
}
