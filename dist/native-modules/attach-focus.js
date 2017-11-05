var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customAttribute } from 'aurelia-templating';
import { DOM } from 'aurelia-pal';
var AttachFocus = /** @class */ (function () {
    function AttachFocus(element) {
        this.element = element;
        this.value = true;
    }
    AttachFocus.prototype.attached = function () {
        if (this.value && this.value !== 'false') {
            this.element.focus();
        }
    };
    AttachFocus.prototype.valueChanged = function (newValue) {
        this.value = newValue;
    };
    /**
     * @internal
     */
    // tslint:disable-next-line:member-ordering
    AttachFocus.inject = [DOM.Element];
    AttachFocus = __decorate([
        customAttribute('attach-focus')
    ], AttachFocus);
    return AttachFocus;
}());
export { AttachFocus };
