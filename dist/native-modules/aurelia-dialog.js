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
    return applyConfig();
}
export * from './dialog-settings';
export * from './dialog-configuration';
export * from './renderer';
export * from './dialog-cancel-error';
export * from './dialog-service';
export * from './dialog-controller';
