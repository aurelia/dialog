'use strict';

System.register(['aurelia-templating'], function (_export, _context) {
  "use strict";

  var customElement, inlineView, _dec, _dec2, _class, AiDialog;

  

  return {
    setters: [function (_aureliaTemplating) {
      customElement = _aureliaTemplating.customElement;
      inlineView = _aureliaTemplating.inlineView;
    }],
    execute: function () {
      _export('AiDialog', AiDialog = (_dec = customElement('ai-dialog'), _dec2 = inlineView('\n  <template>\n    <slot></slot>\n  </template>\n'), _dec(_class = _dec2(_class = function AiDialog() {
        
      }) || _class) || _class));

      _export('AiDialog', AiDialog);
    }
  };
});