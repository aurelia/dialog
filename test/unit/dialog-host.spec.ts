import { DOM } from 'aurelia-pal';
import { DialogHost } from '../../src/dialog-host';

describe('DialogHost', () => {
  function createHost(...dialogs: Element[]): DialogHost {
    const host = DialogHost.getInstance(DOM.createElement('div'));
    dialogs.forEach(d => host.addDialog(d));
    return host;
  }

  describe('.getInstance', () => {
    it(`reuses instances`, () => {
      const hostElement = DOM.createElement('div') as HTMLDivElement;
      expect(DialogHost.getInstance(hostElement)).toBe(DialogHost.getInstance(hostElement));
    });

    it('falls back to the "body" element if no host element is provided', () => {
      const actualElement = DialogHost.getInstance().element as HTMLBodyElement;
      const expectedElement = DOM.querySelectorAll('body')[0] as HTMLBodyElement;
      expect(actualElement).toBe(expectedElement);
    });
  });

  it('adds the "has open dialogs" class to the host element on first added dialog', () => {
    const host = createHost();
    expect(host.element.classList.contains(host.openDialogsClass)).toBe(false);
    host.addDialog(DOM.createElement('div'));
    expect(host.element.classList.contains(host.openDialogsClass)).toBe(true);
  });

  it('removes the "has open dialogs" class from the host element on last removed dialog', () => {
    const dialogs = [] as Element[];
    const dialogsCount = 5;
    for (let i = 0; i < dialogsCount; i++) { dialogs.push(DOM.createElement('div')); }
    const host = createHost(...dialogs);
    expect(host.element.classList.contains(host.openDialogsClass)).toBe(true);
    const dialogsToRemove = dialogsCount - 1;
    for (let i = 0; i < dialogsToRemove; i++) { host.removeDialog(dialogs.pop()!); }
    expect(host.element.classList.contains(host.openDialogsClass)).toBe(true);
    host.removeDialog(dialogs.pop()!);
    expect(host.element.classList.contains(host.openDialogsClass)).toBe(false);
  });

  it('adds dialogs before any prexisting children', () => {
    const preexistingElement = DOM.createElement('div') as Element;
    const host = createHost();
    host.element.appendChild(preexistingElement);
    const dialog = DOM.createElement('div');
    host.addDialog(dialog);
    expect(host.element.firstChild).toBe(dialog);
    expect(host.element.lastChild).toBe(preexistingElement);
  });

  it('adds the dialogs after each other', () => {
    const host = createHost();
    const preexistingElement = DOM.createElement('div');
    host.element.appendChild(preexistingElement);
    const firstDialog = DOM.createElement('div');
    host.addDialog(firstDialog);
    const secondDialog = DOM.createElement('div');
    host.addDialog(secondDialog);
    expect(host.element.firstChild).toBe(firstDialog);
    expect(firstDialog.nextSibling).toBe(secondDialog);
    expect(secondDialog.nextSibling).toBe(preexistingElement);
  });

  it('removes the specified dialog from the host element', () => {
    const host = createHost();
    const preexistingElement = DOM.createElement('div');
    host.element.appendChild(preexistingElement);
    const firstDialog = DOM.createElement('div');
    host.addDialog(firstDialog);
    const secondDialog = DOM.createElement('div');
    host.addDialog(secondDialog);
    host.removeDialog(firstDialog);
    expect(host.element.firstChild).toBe(secondDialog);
    expect(secondDialog.nextSibling).toBe(preexistingElement);
    host.removeDialog(secondDialog);
    expect(host.element.firstChild).toBe(preexistingElement);
    expect(host.element.lastChild).toBe(host.element.lastChild);
  });
});
