var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { DOM } from 'aurelia-pal';
import { transient } from 'aurelia-dependency-injection';
const containerTagName = 'ux-dialog-container';
const overlayTagName = 'ux-dialog-overlay';
export const transitionEvent = (() => {
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
export const hasTransition = (() => {
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
let DialogRenderer = DialogRenderer_1 = class DialogRenderer {
    static keyboardEventHandler(e) {
        const key = getActionKey(e);
        if (!key) {
            return;
        }
        const top = DialogRenderer_1.dialogControllers[DialogRenderer_1.dialogControllers.length - 1];
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
        if (!DialogRenderer_1.dialogControllers.length) {
            DOM.addEventListener('keyup', DialogRenderer_1.keyboardEventHandler, false);
        }
        DialogRenderer_1.dialogControllers.push(dialogController);
    }
    static untrackController(dialogController) {
        const i = DialogRenderer_1.dialogControllers.indexOf(dialogController);
        if (i !== -1) {
            DialogRenderer_1.dialogControllers.splice(i, 1);
        }
        if (!DialogRenderer_1.dialogControllers.length) {
            DOM.removeEventListener('keyup', DialogRenderer_1.keyboardEventHandler, false);
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
        const spacingWrapper = DOM.createElement('div'); // TODO: check if redundant
        spacingWrapper.appendChild(this.anchor);
        this.dialogContainer = DOM.createElement(containerTagName);
        this.dialogContainer.appendChild(spacingWrapper);
        this.dialogOverlay = DOM.createElement(overlayTagName);
        const zIndex = typeof dialogController.settings.startingZIndex === 'number'
            ? dialogController.settings.startingZIndex + ''
            : null;
        this.dialogOverlay.style.zIndex = zIndex;
        this.dialogContainer.style.zIndex = zIndex;
        const lastContainer = this.getOwnElements(this.host, containerTagName).pop();
        if (lastContainer && lastContainer.parentElement) {
            this.host.insertBefore(this.dialogContainer, lastContainer.nextSibling);
            this.host.insertBefore(this.dialogOverlay, lastContainer.nextSibling);
        }
        else {
            this.host.insertBefore(this.dialogContainer, this.host.firstChild);
            this.host.insertBefore(this.dialogOverlay, this.host.firstChild);
        }
        dialogController.controller.attached();
        this.host.classList.add('ux-dialog-open');
    }
    detach(dialogController) {
        this.host.removeChild(this.dialogOverlay);
        this.host.removeChild(this.dialogContainer);
        dialogController.controller.detached();
        if (!DialogRenderer_1.dialogControllers.length) {
            this.host.classList.remove('ux-dialog-open');
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
            // tslint:disable-next-line:no-this-assignment
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
            body = DOM.querySelectorAll('body')[0];
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
        DialogRenderer_1.trackController(dialogController);
        this.setupClickHandling(dialogController);
        return this.awaitTransition(() => this.setAsActive(), dialogController.settings.ignoreTransitions);
    }
    hideDialog(dialogController) {
        this.clearClickHandling();
        DialogRenderer_1.untrackController(dialogController);
        return this.awaitTransition(() => this.setAsInactive(), dialogController.settings.ignoreTransitions)
            .then(() => { this.detach(dialogController); });
    }
};
DialogRenderer.dialogControllers = [];
DialogRenderer = DialogRenderer_1 = __decorate([
    transient()
], DialogRenderer);
export { DialogRenderer };
var DialogRenderer_1;
