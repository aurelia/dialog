var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customElement, bindable, inlineView } from 'aurelia-templating';
import { DialogController } from './dialog-controller';
var UxDialogHeader = /** @class */ (function () {
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
    UxDialogHeader.inject = [DialogController];
    __decorate([
        bindable()
    ], UxDialogHeader.prototype, "showCloseButton", void 0);
    UxDialogHeader = __decorate([
        customElement('ux-dialog-header'),
        inlineView("\n  <template>\n    <button\n      type=\"button\"\n      class=\"dialog-close\"\n      aria-label=\"Close\"\n      if.bind=\"showCloseButton\"\n      click.trigger=\"controller.cancel()\">\n      <span aria-hidden=\"true\">&times;</span>\n    </button>\n\n    <div class=\"dialog-header-content\">\n      <slot></slot>\n    </div>\n  </template>\n")
    ], UxDialogHeader);
    return UxDialogHeader;
}());
export { UxDialogHeader };
