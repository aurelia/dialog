'use strict';

System.register([], function (_export, _context) {
  "use strict";

  var Renderer;

  

  return {
    setters: [],
    execute: function () {
      _export('Renderer', Renderer = function () {
        function Renderer() {
          
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