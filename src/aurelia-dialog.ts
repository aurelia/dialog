import {FrameworkConfiguration} from 'aurelia-framework';
import {DialogConfiguration} from './dialog-configuration';

 // tslint:disable-next-line:max-line-length
export function configure(frameworkConfig: FrameworkConfiguration, callback?: (config: DialogConfiguration) => void): void {
  let applyConfig: () => void = null as any;
  const config = new DialogConfiguration(frameworkConfig, (apply: () => void) => { applyConfig = apply; });
  if (typeof callback === 'function') {
    callback(config);
  } else {
    config.useDefaults();
  }
  applyConfig();
}

export {AiDialog} from './ai-dialog';
export {AiDialogHeader} from './ai-dialog-header';
export {AiDialogBody} from './ai-dialog-body';
export {AiDialogFooter} from './ai-dialog-footer';
export {AttachFocus} from './attach-focus';
export {DialogSettings, BaseDialogSettings} from './dialog-settings';
export {DialogConfiguration, DialogResourceName} from './dialog-configuration';
export {RendererStatic, Renderer} from './renderer';
export {DialogCancelError} from './dialog-cancel-error';
export {DialogOperationResult, DialogCancelResult, DialogOpenResult, DialogCloseResult} from './dialog-result';
export {DialogService} from './dialog-service';
export {DialogController} from './dialog-controller';
