define(["require", "exports", "aurelia-pal"], function (require, exports, aurelia_pal_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
            return [aurelia_pal_1.DOM.Element];
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
    exports.AttachFocus = AttachFocus;
});
