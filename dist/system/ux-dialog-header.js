System.register(['./chunk.js'], function (exports, module) {
  'use strict';
  var DialogController;
  return {
    setters: [function (module) {
      DialogController = module.d;
    }],
    execute: function () {

      var UxDialogHeader = exports('UxDialogHeader', (function () {
          function UxDialogHeader(controller) {
              this.controller = controller;
          }
          UxDialogHeader.prototype.bind = function () {
              if (typeof this.showCloseButton !== 'boolean') {
                  this.showCloseButton = !this.controller.settings.lock;
              }
          };
          UxDialogHeader.inject = [DialogController];
          UxDialogHeader.$view = "<template>\n  <button\n    type=\"button\"\n    class=\"dialog-close\"\n    aria-label=\"Close\"\n    if.bind=\"showCloseButton\"\n    click.trigger=\"controller.cancel()\">\n    <span aria-hidden=\"true\">&times;</span>\n  </button>\n\n  <div class=\"dialog-header-content\">\n    <slot></slot>\n  </div>\n</template>";
          UxDialogHeader.$resource = {
              name: 'ux-dialog-header',
              bindables: ['showCloseButton']
          };
          return UxDialogHeader;
      }()));

    }
  };
});
//# sourceMappingURL=ux-dialog-header.js.map
