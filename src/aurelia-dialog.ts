import { FrameworkConfiguration } from 'aurelia-framework';
import { DialogConfiguration } from './dialog-configuration';

export function configure(
  frameworkConfig: FrameworkConfiguration,
  callback?: (config: DialogConfiguration) => void): void | Promise<void> {
  let applyConfig: () => void | Promise<void> = null as any;
  const config = new DialogConfiguration(frameworkConfig, (apply: () => void) => { applyConfig = apply; });
  if (typeof callback === 'function') {
    callback(config);
  } else {
    config.useDefaults();
  }
  return applyConfig();
}

export * from './interfaces';
export * from './dialog-settings';
export * from './dialog-configuration';
export * from './renderer';
export * from './dialog-cancel-error';
export * from './dialog-result';
export * from './dialog-service';
export * from './dialog-controller';
export * from './dialog-renderer-default';
export * from './dialog-renderer-native';
export * from './infrastructure-dialog-controller';
