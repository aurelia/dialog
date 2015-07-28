'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _aureliaTemplating = require('aurelia-templating');

var _aureliaFramework = require('aurelia-framework');

var Element = document.createElement('dialog');

var AttachFocus = (function () {
  function AttachFocus(element) {
    _classCallCheck(this, _AttachFocus);

    this.element = element;
  }

  AttachFocus.prototype.attached = function attached() {
    this.element.focus();
  };

  var _AttachFocus = AttachFocus;
  AttachFocus = _aureliaFramework.inject(Element)(AttachFocus) || AttachFocus;
  AttachFocus = _aureliaTemplating.customAttribute('attach-focus')(AttachFocus) || AttachFocus;
  return AttachFocus;
})();

exports.AttachFocus = AttachFocus;