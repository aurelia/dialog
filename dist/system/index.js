'use strict';

System.register(['./dialog-configuration'], function (_export, _context) {
  var DialogConfiguration;
  return {
    setters: [function (_dialogConfiguration) {
      DialogConfiguration = _dialogConfiguration.DialogConfiguration;
    }],
    execute: function () {
      function configure(aurelia, callback) {
        var config = new DialogConfiguration(aurelia);

        if (typeof callback === 'function') {
          callback(config);
          return;
        }

        config.useDefaults();
      }

      _export('configure', configure);
    }
  };
});