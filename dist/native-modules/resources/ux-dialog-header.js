import { DialogController } from '../dialog-controller';
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
    /**
     * @internal
     */
    // tslint:disable-next-line:member-ordering
    UxDialogHeader.$view = "<template>\n    <button\n      type=\"button\"\n      class=\"dialog-close\"\n      aria-label=\"Close\"\n      if.bind=\"showCloseButton\"\n      click.trigger=\"controller.cancel()\">\n      <span aria-hidden=\"true\">&times;</span>\n    </button>\n\n    <div class=\"dialog-header-content\">\n      <slot></slot>\n    </div>\n  </template>";
    /**
     * @internal
     */
    // tslint:disable-next-line:member-ordering
    UxDialogHeader.$resource = {
        name: 'ux-dialog-header',
        bindables: ['showCloseButton']
    };
    return UxDialogHeader;
}());
export { UxDialogHeader };
