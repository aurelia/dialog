import { DialogConfiguration } from './dialog-configuration';
export { AiDialog } from './resources/ai-dialog';
export { AiDialogHeader } from './resources/ai-dialog-header';
export { AiDialogBody } from './resources/ai-dialog-body';
export { AiDialogFooter } from './resources/ai-dialog-footer';
export { AttachFocus } from './resources/attach-focus';

export function configure(aurelia, callback) {
  let config = new DialogConfiguration(aurelia);

  if (typeof callback === 'function') {
    callback(config);
    return;
  }

  config.useDefaults();
}

export { DialogConfiguration } from './dialog-configuration';
export { DialogService } from './dialog-service';
export { DialogController, DialogResult } from './dialog-controller';