'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AttachFocus = undefined;

var _dec, _class, _class2, _temp;

var _aureliaTemplating = require('aurelia-templating');



var AttachFocus = exports.AttachFocus = (_dec = (0, _aureliaTemplating.customAttribute)('attach-focus'), _dec(_class = (_temp = _class2 = function () {
  function AttachFocus(element) {
    

    this.value = true;

    this.element = element;
  }

  AttachFocus.prototype.attached = function attached() {
    if (this.value && this.value !== 'false') {
      this.element.focus();
    }
  };

  AttachFocus.prototype.valueChanged = function valueChanged(newValue) {
    this.value = newValue;
  };

  return AttachFocus;
}(), _class2.inject = [Element], _temp)) || _class);