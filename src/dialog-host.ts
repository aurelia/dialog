import { DOM } from 'aurelia-pal';

let body: HTMLBodyElement;

function matchLastOwnChild(parent: Element, selector: string): HTMLElement | null {
  let current = parent.lastChild;
  while (current && (current.nodeType !== 1 || !(current as HTMLElement).matches(selector))) {
    current = current.previousSibling;
  }
  return current as (HTMLElement | null);
}

const DIALOG_HOST_TARGET_CLASS = 'ux-dialog-host-target';
const DIALOG_HOST_TARGET_SELECTOR = `.${DIALOG_HOST_TARGET_CLASS}`;

const DIALOG_HOST_KEY = '__ux-dialog-host__';
type DialogHostElement = Element & { [DIALOG_HOST_KEY]?: DialogHost };

/**
 * @internal
 */
export class DialogHost {
  public static getInstance(hostElement?: Element): DialogHost {
    if (!hostElement) {
      if (!body) {
        body = DOM.querySelectorAll('body')[0] as HTMLBodyElement;
      }
      hostElement = body;
    }
    if (!(hostElement as DialogHostElement)[DIALOG_HOST_KEY]) { // TODO: refactor with WeakMap when possible
      Object.defineProperty(hostElement, DIALOG_HOST_KEY, { value: new DialogHost(hostElement), configurable: true });
    }
    return (hostElement as DialogHostElement)[DIALOG_HOST_KEY]!;
  }

  private dialogsCount: number = 0;

  public readonly element: Element;
  public readonly openDialogsClass: string;

  private constructor(element: Element) {
    if (!element) { throw new Error(`Invalid parameter. "element" can not be "${element}"`); }
    this.element = element;
    // TODO: add option to specify diffrent class using an attribute on the host, maybe and target marker class
    this.openDialogsClass = 'ux-dialog-open';
  }

  public addDialog<T extends Element>(newChild: T): T {
    const ref = matchLastOwnChild(this.element, DIALOG_HOST_TARGET_SELECTOR);
    if (ref) {
      this.element.insertBefore(newChild, ref.nextSibling);
    } else {
      this.element.insertBefore(newChild, this.element.firstChild);
    }
    newChild.classList.add(DIALOG_HOST_TARGET_CLASS);
    this.dialogsCount++;
    if (this.dialogsCount === 1) {
      this.element.classList.add(this.openDialogsClass);
    }
    return newChild;
  }

  public removeDialog<T extends Element>(child: T): T {
    this.element.removeChild(child);
    child.classList.remove(DIALOG_HOST_TARGET_CLASS);
    this.dialogsCount--;
    if (!this.dialogsCount) {
      this.element.classList.remove(this.openDialogsClass);
    }
    return child;
  }
}
