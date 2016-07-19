'use strict';

System.register(['aurelia-templating', './dialog-controller'], function (_export, _context) {
  "use strict";

  var customElement, inlineView, DialogController, _dec, _dec2, _class, _class2, _temp, AiDialogHeader;

  

  return {
    setters: [function (_aureliaTemplating) {
      customElement = _aureliaTemplating.customElement;
      inlineView = _aureliaTemplating.inlineView;
    }, function (_dialogController) {
      DialogController = _dialogController.DialogController;
    }],
    execute: function () {
      _export('AiDialogHeader', AiDialogHeader = (_dec = customElement('ai-dialog-header'), _dec2 = inlineView('\n  <template>\n    <button type="button" class="dialog-close" aria-label="Close" if.bind="!controller.settings.lock" click.trigger="controller.cancel()">\n      <span aria-hidden="true">&times;</span>\n    </button>\n\n    <div class="dialog-header-content">\n      <slot></slot>\n    </div>\n  </template>\n'), _dec(_class = _dec2(_class = (_temp = _class2 = function AiDialogHeader(controller) {
        

        this.controller = controller;
      }, _class2.inject = [DialogController], _temp)) || _class) || _class));

      _export('AiDialogHeader', AiDialogHeader);
    }
  };
});