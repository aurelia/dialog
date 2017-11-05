var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customElement, bindable, inlineView } from 'aurelia-templating';
import { DialogController } from './dialog-controller';
/**
 * View-model for footer of Dialog.
 */
let UxDialogFooter = UxDialogFooter_1 = class UxDialogFooter {
    constructor(controller) {
        this.controller = controller;
        this.buttons = [];
        this.useDefaultButtons = false;
    }
    static isCancelButton(value) {
        return value === 'Cancel';
    }
    close(buttonValue) {
        if (UxDialogFooter_1.isCancelButton(buttonValue)) {
            this.controller.cancel(buttonValue);
        }
        else {
            this.controller.ok(buttonValue);
        }
    }
    useDefaultButtonsChanged(newValue) {
        if (newValue) {
            this.buttons = ['Cancel', 'Ok'];
        }
    }
};
/**
 * @internal
 */
// tslint:disable-next-line:member-ordering
UxDialogFooter.inject = [DialogController];
__decorate([
    bindable
], UxDialogFooter.prototype, "buttons", void 0);
__decorate([
    bindable
], UxDialogFooter.prototype, "useDefaultButtons", void 0);
UxDialogFooter = UxDialogFooter_1 = __decorate([
    customElement('ux-dialog-footer'),
    inlineView(`
  <template>
    <slot></slot>
    <template if.bind="buttons.length > 0">
      <button type="button"
        class="btn btn-default"
        repeat.for="button of buttons"
        click.trigger="close(button)">
        \${button}
      </button>
    </template>
  </template>
`)
], UxDialogFooter);
export { UxDialogFooter };
var UxDialogFooter_1;
