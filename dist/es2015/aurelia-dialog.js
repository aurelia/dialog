import { DialogConfiguration } from './dialog-configuration';
export function configure(frameworkConfig, callback) {
    let applyConfig = null;
    const config = new DialogConfiguration(frameworkConfig, (apply) => { applyConfig = apply; });
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
