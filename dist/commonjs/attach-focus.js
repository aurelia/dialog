'use strict';

var aureliaPal = require('aurelia-pal');

var AttachFocus = (function () {
    function AttachFocus(element) {
        this.element = element;
        this.value = true;
    }
    AttachFocus.inject = function () {
        return [aureliaPal.DOM.Element];
    };
    AttachFocus.prototype.attached = function () {
        if (this.value === '' || (this.value && this.value !== 'false')) {
            this.element.focus();
        }
    };
    AttachFocus.$resource = {
        type: 'attribute',
        name: 'attach-focus'
    };
    return AttachFocus;
}());

exports.AttachFocus = AttachFocus;
//# sourceMappingURL=attach-focus.js.map
