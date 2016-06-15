'use strict';

System.register(['aurelia-templating'], function (_export, _context) {
  "use strict";

  var customElement, inlineView, _dec, _dec2, _class, AiDialogBody;

  

  return {
    setters: [function (_aureliaTemplating) {
      customElement = _aureliaTemplating.customElement;
      inlineView = _aureliaTemplating.inlineView;
    }],
    execute: function () {
      _export('AiDialogBody', AiDialogBody = (_dec = customElement('ai-dialog-body'), _dec2 = inlineView('\n  <template>\n    <slot></slot>\n  </template>\n'), _dec(_class = _dec2(_class = function AiDialogBody() {
        
      }) || _class) || _class));

      _export('AiDialogBody', AiDialogBody);
    }
  };
});