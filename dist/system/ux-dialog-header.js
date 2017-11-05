System.register(["aurelia-templating", "./dialog-controller"], function (exports_1, context_1) {
    "use strict";
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __moduleName = context_1 && context_1.id;
    var aurelia_templating_1, dialog_controller_1, UxDialogHeader;
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
            UxDialogHeader = /** @class */ (function () {
                function UxDialogHeader(controller) {
                    this.controller = controller;
                }
                UxDialogHeader.prototype.bind = function () {
                    if (typeof this.showCloseButton !== 'boolean') {
                        this.showCloseButton = !this.controller.settings.lock;
                    }
                };
                /**
                 * @internal
                 */
                // tslint:disable-next-line:member-ordering
                UxDialogHeader.inject = [dialog_controller_1.DialogController];
                __decorate([
                    aurelia_templating_1.bindable()
                ], UxDialogHeader.prototype, "showCloseButton", void 0);
                UxDialogHeader = __decorate([
                    aurelia_templating_1.customElement('ux-dialog-header'),
                    aurelia_templating_1.inlineView("\n  <template>\n    <button\n      type=\"button\"\n      class=\"dialog-close\"\n      aria-label=\"Close\"\n      if.bind=\"showCloseButton\"\n      click.trigger=\"controller.cancel()\">\n      <span aria-hidden=\"true\">&times;</span>\n    </button>\n\n    <div class=\"dialog-header-content\">\n      <slot></slot>\n    </div>\n  </template>\n")
                ], UxDialogHeader);
                return UxDialogHeader;
            }());
            exports_1("UxDialogHeader", UxDialogHeader);
        }
    };
});
