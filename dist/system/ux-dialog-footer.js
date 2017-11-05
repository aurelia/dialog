System.register(["aurelia-templating", "./dialog-controller"], function (exports_1, context_1) {
    "use strict";
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __moduleName = context_1 && context_1.id;
    var aurelia_templating_1, dialog_controller_1, UxDialogFooter;
    return {
        setters: [
            function (aurelia_templating_1_1) {
                aurelia_templating_1 = aurelia_templating_1_1;
            },
            function (dialog_controller_1_1) {
                dialog_controller_1 = dialog_controller_1_1;
            }
        ],
        execute: function () {
            UxDialogFooter = /** @class */ (function () {
                function UxDialogFooter(controller) {
                    this.controller = controller;
                    this.buttons = [];
                    this.useDefaultButtons = false;
                }
                UxDialogFooter_1 = UxDialogFooter;
                UxDialogFooter.isCancelButton = function (value) {
                    return value === 'Cancel';
                };
                UxDialogFooter.prototype.close = function (buttonValue) {
                    if (UxDialogFooter_1.isCancelButton(buttonValue)) {
                        this.controller.cancel(buttonValue);
                    }
                    else {
                        this.controller.ok(buttonValue);
                    }
                };
                UxDialogFooter.prototype.useDefaultButtonsChanged = function (newValue) {
                    if (newValue) {
                        this.buttons = ['Cancel', 'Ok'];
                    }
                };
                /**
                 * @internal
                 */
                // tslint:disable-next-line:member-ordering
                UxDialogFooter.inject = [dialog_controller_1.DialogController];
                __decorate([
                    aurelia_templating_1.bindable
                ], UxDialogFooter.prototype, "buttons", void 0);
                __decorate([
                    aurelia_templating_1.bindable
                ], UxDialogFooter.prototype, "useDefaultButtons", void 0);
                UxDialogFooter = UxDialogFooter_1 = __decorate([
                    aurelia_templating_1.customElement('ux-dialog-footer'),
                    aurelia_templating_1.inlineView("\n  <template>\n    <slot></slot>\n    <template if.bind=\"buttons.length > 0\">\n      <button type=\"button\"\n        class=\"btn btn-default\"\n        repeat.for=\"button of buttons\"\n        click.trigger=\"close(button)\">\n        ${button}\n      </button>\n    </template>\n  </template>\n")
                ], UxDialogFooter);
                return UxDialogFooter;
                var UxDialogFooter_1;
            }());
            exports_1("UxDialogFooter", UxDialogFooter);
        }
    };
});
