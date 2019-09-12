System.register([], function (exports) {
  'use strict';
  return {
    execute: function () {

      var UxDialog = exports('UxDialog', (function () {
          function UxDialog() {
          }
          UxDialog.$view = "<template><slot></slot></template>";
          UxDialog.$resource = 'ux-dialog';
          return UxDialog;
      }()));

    }
  };
});
//# sourceMappingURL=ux-dialog.js.map
