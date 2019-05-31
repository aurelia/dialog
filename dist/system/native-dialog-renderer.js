System.register(['aurelia-pal', 'aurelia-dependency-injection', './ux-dialog-renderer.js'], function (exports, module) {
    'use strict';
    var DOM, transient, transitionEvent, hasTransition;
    return {
        setters: [function (module) {
            DOM = module.DOM;
        }, function (module) {
            transient = module.transient;
        }, function (module) {
            transitionEvent = module.transitionEvent;
            hasTransition = module.hasTransition;
        }],
        execute: function () {

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

            var containerTagName = 'dialog';
            var body;
            var NativeDialogRenderer = exports('NativeDialogRenderer', (function () {
                function NativeDialogRenderer() {
                }
                NativeDialogRenderer_1 = NativeDialogRenderer;
                NativeDialogRenderer.keyboardEventHandler = function (e) {
                    var key = (e.code || e.key) === 'Enter' || e.keyCode === 13
                        ? 'Enter'
                        : undefined;
                    if (!key) {
                        return;
                    }
                    var top = NativeDialogRenderer_1.dialogControllers[NativeDialogRenderer_1.dialogControllers.length - 1];
                    if (!top || !top.settings.keyboard) {
                        return;
                    }
                    var keyboard = top.settings.keyboard;
                    if (key === 'Enter' && (keyboard === key || (Array.isArray(keyboard) && keyboard.indexOf(key) > -1))) {
                        top.ok();
                    }
                };
                NativeDialogRenderer.trackController = function (dialogController) {
                    if (!NativeDialogRenderer_1.dialogControllers.length) {
                        DOM.addEventListener('keyup', NativeDialogRenderer_1.keyboardEventHandler, false);
                    }
                    NativeDialogRenderer_1.dialogControllers.push(dialogController);
                };
                NativeDialogRenderer.untrackController = function (dialogController) {
                    var i = NativeDialogRenderer_1.dialogControllers.indexOf(dialogController);
                    if (i !== -1) {
                        NativeDialogRenderer_1.dialogControllers.splice(i, 1);
                    }
                    if (!NativeDialogRenderer_1.dialogControllers.length) {
                        DOM.removeEventListener('keyup', NativeDialogRenderer_1.keyboardEventHandler, false);
                    }
                };
                NativeDialogRenderer.prototype.getOwnElements = function (parent, selector) {
                    var elements = parent.querySelectorAll(selector);
                    var own = [];
                    for (var i = 0; i < elements.length; i++) {
                        if (elements[i].parentElement === parent) {
                            own.push(elements[i]);
                        }
                    }
                    return own;
                };
                NativeDialogRenderer.prototype.attach = function (dialogController) {
                    var spacingWrapper = DOM.createElement('div');
                    spacingWrapper.appendChild(this.anchor);
                    this.dialogContainer = DOM.createElement(containerTagName);
                    if (window.dialogPolyfill) {
                        window.dialogPolyfill.registerDialog(this.dialogContainer);
                    }
                    this.dialogContainer.appendChild(spacingWrapper);
                    var lastContainer = this.getOwnElements(this.host, containerTagName).pop();
                    if (lastContainer && lastContainer.parentElement) {
                        this.host.insertBefore(this.dialogContainer, lastContainer.nextSibling);
                    }
                    else {
                        this.host.insertBefore(this.dialogContainer, this.host.firstChild);
                    }
                    dialogController.controller.attached();
                    this.host.classList.add('ux-dialog-open');
                };
                NativeDialogRenderer.prototype.detach = function (dialogController) {
                    if (this.dialogContainer.hasAttribute('open')) {
                        this.dialogContainer.close();
                    }
                    this.host.removeChild(this.dialogContainer);
                    dialogController.controller.detached();
                    if (!NativeDialogRenderer_1.dialogControllers.length) {
                        this.host.classList.remove('ux-dialog-open');
                    }
                };
                NativeDialogRenderer.prototype.setAsActive = function () {
                    this.dialogContainer.showModal();
                    this.dialogContainer.classList.add('active');
                };
                NativeDialogRenderer.prototype.setAsInactive = function () {
                    this.dialogContainer.classList.remove('active');
                };
                NativeDialogRenderer.prototype.setupEventHandling = function (dialogController) {
                    this.stopPropagation = function (e) { e._aureliaDialogHostClicked = true; };
                    this.closeDialogClick = function (e) {
                        if (dialogController.settings.overlayDismiss && !e._aureliaDialogHostClicked) {
                            dialogController.cancel();
                        }
                    };
                    this.dialogCancel = function (e) {
                        var keyboard = dialogController.settings.keyboard;
                        var key = 'Escape';
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
                };
                NativeDialogRenderer.prototype.clearEventHandling = function () {
                    this.dialogContainer.removeEventListener('click', this.closeDialogClick);
                    this.dialogContainer.removeEventListener('cancel', this.dialogCancel);
                    this.anchor.removeEventListener('click', this.stopPropagation);
                };
                NativeDialogRenderer.prototype.awaitTransition = function (setActiveInactive, ignore) {
                    var _this = this;
                    return new Promise(function (resolve) {
                        var renderer = _this;
                        var eventName = transitionEvent();
                        function onTransitionEnd(e) {
                            if (e.target !== renderer.dialogContainer) {
                                return;
                            }
                            renderer.dialogContainer.removeEventListener(eventName, onTransitionEnd);
                            resolve();
                        }
                        if (ignore || !hasTransition(_this.dialogContainer)) {
                            resolve();
                        }
                        else {
                            _this.dialogContainer.addEventListener(eventName, onTransitionEnd);
                        }
                        setActiveInactive();
                    });
                };
                NativeDialogRenderer.prototype.getDialogContainer = function () {
                    return this.anchor || (this.anchor = DOM.createElement('div'));
                };
                NativeDialogRenderer.prototype.showDialog = function (dialogController) {
                    var _this = this;
                    if (!body) {
                        body = DOM.querySelector('body');
                    }
                    if (dialogController.settings.host) {
                        this.host = dialogController.settings.host;
                    }
                    else {
                        this.host = body;
                    }
                    var settings = dialogController.settings;
                    this.attach(dialogController);
                    if (typeof settings.position === 'function') {
                        settings.position(this.dialogContainer);
                    }
                    NativeDialogRenderer_1.trackController(dialogController);
                    this.setupEventHandling(dialogController);
                    return this.awaitTransition(function () { return _this.setAsActive(); }, dialogController.settings.ignoreTransitions);
                };
                NativeDialogRenderer.prototype.hideDialog = function (dialogController) {
                    var _this = this;
                    this.clearEventHandling();
                    NativeDialogRenderer_1.untrackController(dialogController);
                    return this.awaitTransition(function () { return _this.setAsInactive(); }, dialogController.settings.ignoreTransitions)
                        .then(function () { _this.detach(dialogController); });
                };
                var NativeDialogRenderer_1;
                NativeDialogRenderer.dialogControllers = [];
                NativeDialogRenderer = NativeDialogRenderer_1 = __decorate([
                    transient()
                ], NativeDialogRenderer);
                return NativeDialogRenderer;
            }()));

        }
    };
});
//# sourceMappingURL=native-dialog-renderer.js.map
