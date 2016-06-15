'use strict';

System.register(['aurelia-templating'], function (_export, _context) {
  "use strict";

  var customAttribute, _dec, _class, _class2, _temp, AttachFocus;

  

  return {
    setters: [function (_aureliaTemplating) {
      customAttribute = _aureliaTemplating.customAttribute;
    }],
    execute: function () {
      _export('AttachFocus', AttachFocus = (_dec = customAttribute('attach-focus'), _dec(_class = (_temp = _class2 = function () {
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
      }(), _class2.inject = [Element], _temp)) || _class));

      _export('AttachFocus', AttachFocus);
    }
  };
});