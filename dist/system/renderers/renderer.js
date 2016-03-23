'use strict';

System.register([], function (_export, _context) {
  var Renderer;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [],
    execute: function () {
      _export('Renderer', Renderer = function () {
        function Renderer() {
          _classCallCheck(this, Renderer);
        }

        Renderer.prototype.getDialogContainer = function getDialogContainer() {
          throw new Error('DialogRenderer must implement getDialogContainer().');
        };

        Renderer.prototype.showDialog = function showDialog(dialogController) {
          throw new Error('DialogRenderer must implement showDialog().');
        };

        Renderer.prototype.hideDialog = function hideDialog(dialogController) {
          throw new Error('DialogRenderer must implement hideDialog().');
        };

        return Renderer;
      }());

      _export('Renderer', Renderer);
    }
  };
});