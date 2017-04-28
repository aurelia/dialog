define(["require", "exports", "./dialog-configuration", "./ux-dialog", "./ux-dialog-header", "./ux-dialog-body", "./ux-dialog-footer", "./attach-focus", "./dialog-settings", "./dialog-configuration", "./renderer", "./dialog-cancel-error", "./dialog-service", "./dialog-controller"], function (require, exports, dialog_configuration_1, ux_dialog_1, ux_dialog_header_1, ux_dialog_body_1, ux_dialog_footer_1, attach_focus_1, dialog_settings_1, dialog_configuration_2, renderer_1, dialog_cancel_error_1, dialog_service_1, dialog_controller_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(frameworkConfig, callback) {
        var applyConfig = null;
        var config = new dialog_configuration_1.DialogConfiguration(frameworkConfig, function (apply) { applyConfig = apply; });
        if (typeof callback === 'function') {
            callback(config);
        }
        else {
            config.useDefaults();
        }
        applyConfig();
    }
    exports.configure = configure;
    __export(ux_dialog_1);
    __export(ux_dialog_header_1);
    __export(ux_dialog_body_1);
    __export(ux_dialog_footer_1);
    __export(attach_focus_1);
    __export(dialog_settings_1);
    __export(dialog_configuration_2);
    __export(renderer_1);
    __export(dialog_cancel_error_1);
    __export(dialog_service_1);
    __export(dialog_controller_1);
});
