import { DialogConfiguration } from './dialog-configuration';

export function configure(aurelia, callback) {
  let config = new DialogConfiguration(aurelia);

  if (typeof callback === 'function') {
    callback(config);
    return;
  }

  config.useDefaults();
}