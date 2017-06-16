"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var dialog_configuration_1 = require("./dialog-configuration");
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
__export(require("./ux-dialog"));
__export(require("./ux-dialog-header"));
__export(require("./ux-dialog-body"));
__export(require("./ux-dialog-footer"));
__export(require("./attach-focus"));
__export(require("./dialog-settings"));
__export(require("./dialog-configuration"));
__export(require("./renderer"));
__export(require("./dialog-cancel-error"));
__export(require("./dialog-service"));
__export(require("./dialog-controller"));
