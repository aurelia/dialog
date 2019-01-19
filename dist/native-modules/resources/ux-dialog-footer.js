import { DialogController } from '../dialog-controller';
/**
 * View-model for footer of Dialog.
 */
var UxDialogFooter = /** @class */ (function () {
    function UxDialogFooter(controller) {
        this.controller = controller;
        /**
         * @bindable
         */
        this.buttons = [];
        /**
         * @bindable
         */
        this.useDefaultButtons = false;
    }
    UxDialogFooter.isCancelButton = function (value) {
        return value === 'Cancel';
    };
    UxDialogFooter.prototype.close = function (buttonValue) {
        if (UxDialogFooter.isCancelButton(buttonValue)) {
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
    UxDialogFooter.inject = [DialogController];
    /**
     * @internal
     */
    // tslint:disable-next-line:member-ordering
    UxDialogFooter.$view = "<template>\n    <slot></slot>\n    <template if.bind=\"buttons.length > 0\">\n      <button type=\"button\"\n        class=\"btn btn-default\"\n        repeat.for=\"button of buttons\"\n        click.trigger=\"close(button)\">\n        ${button}\n      </button>\n    </template>\n  </template>";
    /**
     * @internal
     */
    // tslint:disable-next-line:member-ordering
    UxDialogFooter.$resource = {
        name: 'ux-dialog-footer',
        bindables: ['buttons', 'useDefaultButtons']
    };
    return UxDialogFooter;
}());
export { UxDialogFooter };
