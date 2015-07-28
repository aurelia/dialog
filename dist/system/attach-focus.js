System.register(['aurelia-templating', 'aurelia-framework'], function (_export) {
  'use strict';

  var customAttribute, inject, Element, AttachFocus;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_aureliaTemplating) {
      customAttribute = _aureliaTemplating.customAttribute;
    }, function (_aureliaFramework) {
      inject = _aureliaFramework.inject;
    }],
    execute: function () {
      Element = document.createElement('dialog');

      AttachFocus = (function () {
        function AttachFocus(element) {
          _classCallCheck(this, _AttachFocus);

          this.element = element;
        }

        AttachFocus.prototype.attached = function attached() {
          this.element.focus();
        };

        var _AttachFocus = AttachFocus;
        AttachFocus = inject(Element)(AttachFocus) || AttachFocus;
        AttachFocus = customAttribute('attach-focus')(AttachFocus) || AttachFocus;
        return AttachFocus;
      })();

      _export('AttachFocus', AttachFocus);
    }
  };
});