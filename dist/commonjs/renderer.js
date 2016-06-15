'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});



var Renderer = exports.Renderer = function () {
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
}();