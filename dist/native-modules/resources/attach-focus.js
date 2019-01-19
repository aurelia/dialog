import { DOM } from 'aurelia-pal';
var AttachFocus = /** @class */ (function () {
    function AttachFocus(element) {
        this.element = element;
        this.value = true;
    }
    /**
     * @internal
     */
    // tslint:disable-next-line:member-ordering
    AttachFocus.inject = function () {
        return [DOM.Element];
    };
    AttachFocus.prototype.attached = function () {
        if (this.value === '' || (this.value && this.value !== 'false')) {
            this.element.focus();
        }
    };
    /**
     * @internal
     */
    AttachFocus.$resource = {
        type: 'attribute',
        name: 'attach-focus'
    };
    return AttachFocus;
}());
export { AttachFocus };
