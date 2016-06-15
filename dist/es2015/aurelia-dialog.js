import { DialogConfiguration } from './dialog-configuration';
export { AiDialog } from './ai-dialog';
export { AiDialogHeader } from './ai-dialog-header';
export { AiDialogBody } from './ai-dialog-body';
export { AiDialogFooter } from './ai-dialog-footer';
export { AttachFocus } from './attach-focus';

export function configure(aurelia, callback) {
  let config = new DialogConfiguration(aurelia);

  if (typeof callback === 'function') {
    callback(config);
  } else {
    config.useDefaults();
  }

  config._apply();
}

export { DialogConfiguration } from './dialog-configuration';
export { DialogService } from './dialog-service';
export { DialogController } from './dialog-controller';
export { DialogResult } from './dialog-result';