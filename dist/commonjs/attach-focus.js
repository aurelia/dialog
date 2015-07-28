'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _aureliaTemplating = require('aurelia-templating');

var AttachFocus = (function () {
  function AttachFocus(element) {
    _classCallCheck(this, _AttachFocus);

    this.element = element;
  }

  var _AttachFocus = AttachFocus;

  _AttachFocus.prototype.attached = function attached() {
    this.element.focus();
  };

  _createClass(_AttachFocus, null, [{
    key: 'inject',
    value: [Element],
    enumerable: true
  }]);

  AttachFocus = _aureliaTemplating.customAttribute('attach-focus')(AttachFocus) || AttachFocus;
  return AttachFocus;
})();

exports.AttachFocus = AttachFocus;