System.register([], function (exports) {
  'use strict';
  return {
    execute: function () {

      var UxDialogBody = exports('UxDialogBody', (function () {
          function UxDialogBody() {
          }
          UxDialogBody.$view = "<template><slot></slot></template>";
          UxDialogBody.$resource = 'ux-dialog-body';
          return UxDialogBody;
      }()));

    }
  };
});
//# sourceMappingURL=ux-dialog-body.js.map
