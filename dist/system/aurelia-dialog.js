System.register(["./dialog-configuration", "./dialog-settings", "./renderer", "./dialog-cancel-error", "./dialog-service", "./dialog-controller"], function (exports_1, context_1) {
    "use strict";
    var dialog_configuration_1;
    var __moduleName = context_1 && context_1.id;
    function configure(frameworkConfig, callback) {
        var applyConfig = null;
        var config = new dialog_configuration_1.DialogConfiguration(frameworkConfig, function (apply) { applyConfig = apply; });
        if (typeof callback === 'function') {
            callback(config);
        }
        else {
            config.useDefaults();
        }
        return applyConfig();
    }
    exports_1("configure", configure);
    var exportedNames_1 = {
        "configure": true
    };
    function exportStar_1(m) {
        var exports = {};
        for (var n in m) {
            if (n !== "default" && !exportedNames_1.hasOwnProperty(n)) exports[n] = m[n];
        }
        exports_1(exports);
    }
    return {
        setters: [
            function (dialog_configuration_1_1) {
                dialog_configuration_1 = dialog_configuration_1_1;
                exportStar_1(dialog_configuration_1_1);
            },
            function (dialog_settings_1_1) {
                exportStar_1(dialog_settings_1_1);
            },
            function (renderer_1_1) {
                exportStar_1(renderer_1_1);
            },
            function (dialog_cancel_error_1_1) {
                exportStar_1(dialog_cancel_error_1_1);
            },
            function (dialog_service_1_1) {
                exportStar_1(dialog_service_1_1);
            },
            function (dialog_controller_1_1) {
                exportStar_1(dialog_controller_1_1);
            }
        ],
        execute: function () {
        }
    };
});
