import { DOM } from 'aurelia-pal';
import { transient } from 'aurelia-dependency-injection';
import { transitionEvent, hasTransition } from './ux-dialog-renderer.js';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

var NativeDialogRenderer_1;
const containerTagName = 'dialog';
let body;
let NativeDialogRenderer = NativeDialogRenderer_1 = class NativeDialogRenderer {
    static keyboardEventHandler(e) {
        const key = (e.code || e.key) === 'Enter' || e.keyCode === 13
            ? 'Enter'
            : undefined;
        if (!key) {
            return;
        }
        const top = NativeDialogRenderer_1.dialogControllers[NativeDialogRenderer_1.dialogControllers.length - 1];
        if (!top || !top.settings.keyboard) {
            return;
        }
        const keyboard = top.settings.keyboard;
        if (key === 'Enter' && (keyboard === key || (Array.isArray(keyboard) && keyboard.indexOf(key) > -1))) {
            top.ok();
        }
    }
    static trackController(dialogController) {
        if (!NativeDialogRenderer_1.dialogControllers.length) {
            DOM.addEventListener('keyup', NativeDialogRenderer_1.keyboardEventHandler, false);
        }
        NativeDialogRenderer_1.dialogControllers.push(dialogController);
    }
    static untrackController(dialogController) {
        const i = NativeDialogRenderer_1.dialogControllers.indexOf(dialogController);
        if (i !== -1) {
            NativeDialogRenderer_1.dialogControllers.splice(i, 1);
        }
        if (!NativeDialogRenderer_1.dialogControllers.length) {
            DOM.removeEventListener('keyup', NativeDialogRenderer_1.keyboardEventHandler, false);
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
        const spacingWrapper = DOM.createElement('div');
        spacingWrapper.appendChild(this.anchor);
        this.dialogContainer = DOM.createElement(containerTagName);
        if (window.dialogPolyfill) {
            window.dialogPolyfill.registerDialog(this.dialogContainer);
        }
        this.dialogContainer.appendChild(spacingWrapper);
        const lastContainer = this.getOwnElements(this.host, containerTagName).pop();
        if (lastContainer && lastContainer.parentElement) {
            this.host.insertBefore(this.dialogContainer, lastContainer.nextSibling);
        }
        else {
            this.host.insertBefore(this.dialogContainer, this.host.firstChild);
        }
        dialogController.controller.attached();
        this.host.classList.add('ux-dialog-open');
    }
    detach(dialogController) {
        if (this.dialogContainer.hasAttribute('open')) {
            this.dialogContainer.close();
        }
        this.host.removeChild(this.dialogContainer);
        dialogController.controller.detached();
        if (!NativeDialogRenderer_1.dialogControllers.length) {
            this.host.classList.remove('ux-dialog-open');
        }
    }
    setAsActive() {
        this.dialogContainer.showModal();
        this.dialogContainer.classList.add('active');
    }
    setAsInactive() {
        this.dialogContainer.classList.remove('active');
    }
    setupEventHandling(dialogController) {
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
            }
            else {
                e.preventDefault();
            }
        };
        this.dialogContainer.addEventListener('click', this.closeDialogClick);
        this.dialogContainer.addEventListener('cancel', this.dialogCancel);
        this.anchor.addEventListener('click', this.stopPropagation);
    }
    clearEventHandling() {
        this.dialogContainer.removeEventListener('click', this.closeDialogClick);
        this.dialogContainer.removeEventListener('cancel', this.dialogCancel);
        this.anchor.removeEventListener('click', this.stopPropagation);
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
            settings.position(this.dialogContainer);
        }
        NativeDialogRenderer_1.trackController(dialogController);
        this.setupEventHandling(dialogController);
        return this.awaitTransition(() => this.setAsActive(), dialogController.settings.ignoreTransitions);
    }
    hideDialog(dialogController) {
        this.clearEventHandling();
        NativeDialogRenderer_1.untrackController(dialogController);
        return this.awaitTransition(() => this.setAsInactive(), dialogController.settings.ignoreTransitions)
            .then(() => { this.detach(dialogController); });
    }
};
NativeDialogRenderer.dialogControllers = [];
NativeDialogRenderer = NativeDialogRenderer_1 = __decorate([
    transient()
], NativeDialogRenderer);

export { NativeDialogRenderer };
//# sourceMappingURL=native-dialog-renderer.js.map
