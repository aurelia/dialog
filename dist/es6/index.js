export {Dialog} from './dialog';
export {DialogHeader} from './dialog-header';
export {DialogBody} from './dialog-body';
export {DialogFooter} from './dialog-footer';
export {AttachFocus} from './attach-focus';

export function configure(config) {
  config.globalResources(
    './dialog',
    './dialog-header',
    './dialog-body',
    './dialog-footer',
    './attach-focus'
  );
}

export * from './dialog-service';
export * from './dialog-controller';
