import { FrameworkConfiguration } from 'aurelia-framework';
import { DialogConfiguration } from './dialog-configuration';

export function configure(
  frameworkConfig: FrameworkConfiguration,
  callback?: (config: DialogConfiguration) => void): void {
  let applyConfig: () => void = null as any;
  const config = new DialogConfiguration(frameworkConfig, (apply: () => void) => { applyConfig = apply; });
  if (typeof callback === 'function') {
    callback(config);
  } else {
    config.useDefaults();
  }
  applyConfig();
}

export * from './ai-dialog';
export * from './ai-dialog-header';
export * from './ai-dialog-body';
export * from './ai-dialog-footer';
export * from './attach-focus';
export * from './interfaces';
export * from './dialog-settings';
export * from './dialog-configuration';
export * from './renderer';
export * from './dialog-cancel-error';
export * from './dialog-result';
export * from './dialog-service';
export * from './dialog-controller';
