import { DialogConfiguration } from './dialog-configuration';
export function configure(frameworkConfig, callback) {
    var applyConfig = null;
    var config = new DialogConfiguration(frameworkConfig, function (apply) { applyConfig = apply; });
    if (typeof callback === 'function') {
        callback(config);
    }
    else {
        config.useDefaults();
    }
    applyConfig();
}
export * from './ux-dialog';
export * from './ux-dialog-header';
export * from './ux-dialog-body';
export * from './ux-dialog-footer';
export * from './attach-focus';
export * from './dialog-settings';
export * from './dialog-configuration';
export * from './renderer';
export * from './dialog-cancel-error';
export * from './dialog-service';
export * from './dialog-controller';
