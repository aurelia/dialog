import {globalSettings} from './dialog-renderer';
export {AiDialog} from './ai-dialog';
export {AiDialogHeader} from './ai-dialog-header';
export {AiDialogBody} from './ai-dialog-body';
export {AiDialogFooter} from './ai-dialog-footer';
export {AttachFocus} from './attach-focus';

export function configure(config, callback) {
  config.globalResources(
    './ai-dialog',
    './ai-dialog-header',
    './ai-dialog-body',
    './ai-dialog-footer',
    './attach-focus'
  );
  if (typeof callback === 'function') {
    callback(globalSettings);
  }
}

export * from './dialog-service';
export * from './dialog-controller';
