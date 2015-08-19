System.register(['aurelia-templating'], function (_export) {
  'use strict';

  var customAttribute, AttachFocus;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_aureliaTemplating) {
      customAttribute = _aureliaTemplating.customAttribute;
    }],
    execute: function () {
      AttachFocus = (function () {
        _createClass(AttachFocus, null, [{
          key: 'inject',
          value: [Element],
          enumerable: true
        }]);

        function AttachFocus(element) {
          _classCallCheck(this, _AttachFocus);

          this.element = element;
        }

        AttachFocus.prototype.attached = function attached() {
          this.element.focus();
        };

        var _AttachFocus = AttachFocus;
        AttachFocus = customAttribute('attach-focus')(AttachFocus) || AttachFocus;
        return AttachFocus;
      })();

      _export('AttachFocus', AttachFocus);
    }
  };
});