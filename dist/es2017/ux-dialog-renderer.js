import { DOM } from 'aurelia-pal';
import { transient } from 'aurelia-dependency-injection';

const containerTagName = 'ux-dialog-container';
const overlayTagName = 'ux-dialog-overlay';
const transitionEvent = (() => {
    let transition;
    return () => {
        if (transition) {
            return transition;
        }
        const el = DOM.createElement('fakeelement');
        const transitions = {
            transition: 'transitionend',
            OTransition: 'oTransitionEnd',
            MozTransition: 'transitionend',
            WebkitTransition: 'webkitTransitionEnd'
        };
        for (let t in transitions) {
            if (el.style[t] !== undefined) {
                transition = transitions[t];
                return transition;
            }
        }
        return '';
    };
})();
const hasTransition = (() => {
    const unprefixedName = 'transitionDuration';
    const prefixedNames = ['webkitTransitionDuration', 'oTransitionDuration'];
    let el;
    let transitionDurationName;
    return (element) => {
        if (!el) {
            el = DOM.createElement('fakeelement');
            if (unprefixedName in el.style) {
                transitionDurationName = unprefixedName;
            }
            else {
                transitionDurationName = prefixedNames.find(prefixed => (prefixed in el.style));
            }
        }
        return !!transitionDurationName && !!(DOM.getComputedStyle(element)[transitionDurationName]
            .split(',')
            .find((duration) => !!parseFloat(duration)));
    };
})();
let body;
function getActionKey(e) {
    if ((e.code || e.key) === 'Escape' || e.keyCode === 27) {
        return 'Escape';
    }
    if ((e.code || e.key) === 'Enter' || e.keyCode === 13) {
        return 'Enter';
    }
    return undefined;
}
class DialogRenderer {
    static keyboardEventHandler(e) {
        const key = getActionKey(e);
        if (!key) {
            return;
        }
        const top = DialogRenderer.dialogControllers[DialogRenderer.dialogControllers.length - 1];
        if (!top || !top.settings.keyboard) {
            return;
        }
        const keyboard = top.settings.keyboard;
        if (key === 'Escape'
            && (keyboard === true || keyboard === key || (Array.isArray(keyboard) && keyboard.indexOf(key) > -1))) {
            top.cancel();
        }
        else if (key === 'Enter' && (keyboard === key || (Array.isArray(keyboard) && keyboard.indexOf(key) > -1))) {
            top.ok();
        }
    }
    static trackController(dialogController) {
        const trackedDialogControllers = DialogRenderer.dialogControllers;
        if (!trackedDialogControllers.length) {
            DOM.addEventListener(dialogController.settings.keyEvent || 'keyup', DialogRenderer.keyboardEventHandler, false);
        }
        trackedDialogControllers.push(dialogController);
    }
    static untrackController(dialogController) {
        const trackedDialogControllers = DialogRenderer.dialogControllers;
        const i = trackedDialogControllers.indexOf(dialogController);
        if (i !== -1) {
            trackedDialogControllers.splice(i, 1);
        }
        if (!trackedDialogControllers.length) {
            DOM.removeEventListener(dialogController.settings.keyEvent || 'keyup', DialogRenderer.keyboardEventHandler, false);
        }
    }
    getOwnElements(parent, selector) {
        const elements = parent.querySelectorAll(selector);
        const own = [];
        for (let i = 0; i < elements.length; i++) {
            if (elements[i].parentElement === parent) {
                own.push(elements[i]);
            }
        }
        return own;
    }
    attach(dialogController) {
        if (dialogController.settings.restoreFocus) {
            this.lastActiveElement = DOM.activeElement;
        }
        const spacingWrapper = DOM.createElement('div');
        spacingWrapper.appendChild(this.anchor);
        const dialogContainer = this.dialogContainer = DOM.createElement(containerTagName);
        dialogContainer.appendChild(spacingWrapper);
        const dialogOverlay = this.dialogOverlay = DOM.createElement(overlayTagName);
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
        }
        else {
            host.insertBefore(dialogContainer, host.firstChild);
            host.insertBefore(dialogOverlay, host.firstChild);
        }
        dialogController.controller.attached();
        host.classList.add('ux-dialog-open');
    }
    detach(dialogController) {
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
    setAsActive() {
        this.dialogOverlay.classList.add('active');
        this.dialogContainer.classList.add('active');
    }
    setAsInactive() {
        this.dialogOverlay.classList.remove('active');
        this.dialogContainer.classList.remove('active');
    }
    setupClickHandling(dialogController) {
        this.stopPropagation = e => { e._aureliaDialogHostClicked = true; };
        this.closeDialogClick = e => {
            if (dialogController.settings.overlayDismiss && !e._aureliaDialogHostClicked) {
                dialogController.cancel();
            }
        };
        this.dialogContainer.addEventListener('click', this.closeDialogClick);
        this.anchor.addEventListener('click', this.stopPropagation);
    }
    clearClickHandling() {
        this.dialogContainer.removeEventListener('click', this.closeDialogClick);
        this.anchor.removeEventListener('click', this.stopPropagation);
    }
    centerDialog() {
        const child = this.dialogContainer.children[0];
        const vh = Math.max(DOM.querySelectorAll('html')[0].clientHeight, window.innerHeight || 0);
        child.style.marginTop = Math.max((vh - child.offsetHeight) / 2, 30) + 'px';
        child.style.marginBottom = Math.max((vh - child.offsetHeight) / 2, 30) + 'px';
    }
    awaitTransition(setActiveInactive, ignore) {
        return new Promise(resolve => {
            const renderer = this;
            const eventName = transitionEvent();
            function onTransitionEnd(e) {
                if (e.target !== renderer.dialogContainer) {
                    return;
                }
                renderer.dialogContainer.removeEventListener(eventName, onTransitionEnd);
                resolve();
            }
            if (ignore || !hasTransition(this.dialogContainer)) {
                resolve();
            }
            else {
                this.dialogContainer.addEventListener(eventName, onTransitionEnd);
            }
            setActiveInactive();
        });
    }
    getDialogContainer() {
        return this.anchor || (this.anchor = DOM.createElement('div'));
    }
    showDialog(dialogController) {
        if (!body) {
            body = DOM.querySelector('body');
        }
        if (dialogController.settings.host) {
            this.host = dialogController.settings.host;
        }
        else {
            this.host = body;
        }
        const settings = dialogController.settings;
        this.attach(dialogController);
        if (typeof settings.position === 'function') {
            settings.position(this.dialogContainer, this.dialogOverlay);
        }
        else if (!settings.centerHorizontalOnly) {
            this.centerDialog();
        }
        DialogRenderer.trackController(dialogController);
        this.setupClickHandling(dialogController);
        return this.awaitTransition(() => this.setAsActive(), dialogController.settings.ignoreTransitions);
    }
    hideDialog(dialogController) {
        this.clearClickHandling();
        DialogRenderer.untrackController(dialogController);
        return this.awaitTransition(() => this.setAsInactive(), dialogController.settings.ignoreTransitions)
            .then(() => { this.detach(dialogController); });
    }
}
DialogRenderer.dialogControllers = [];
transient()(DialogRenderer);

export { DialogRenderer, DialogRenderer as UxDialogRenderer, hasTransition, transitionEvent };
//# sourceMappingURL=ux-dialog-renderer.js.map
