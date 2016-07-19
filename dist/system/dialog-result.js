"use strict";

System.register([], function (_export, _context) {
  "use strict";

  var DialogResult;

  

  return {
    setters: [],
    execute: function () {
      _export("DialogResult", DialogResult = function DialogResult(cancelled, output) {
        

        this.wasCancelled = false;

        this.wasCancelled = cancelled;
        this.output = output;
      });

      _export("DialogResult", DialogResult);
    }
  };
});