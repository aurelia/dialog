'use strict';

System.register(['aurelia-templating'], function (_export, _context) {
  var customAttribute, _dec, _class, _class2, _temp, AttachFocus;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_aureliaTemplating) {
      customAttribute = _aureliaTemplating.customAttribute;
    }],
    execute: function () {
      _export('AttachFocus', AttachFocus = (_dec = customAttribute('attach-focus'), _dec(_class = (_temp = _class2 = function () {
        function AttachFocus(element) {
          _classCallCheck(this, AttachFocus);

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
      }(), _class2.inject = [Element], _temp)) || _class));

      _export('AttachFocus', AttachFocus);
    }
  };
});