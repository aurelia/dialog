declare module 'aurelia-dialog' {
  import { customElement, bindable, customAttribute, ViewSlot, CompositionEngine }  from 'aurelia-templating';
  import { Origin }  from 'aurelia-metadata';
  import { Container }  from 'aurelia-dependency-injection';
  export class AiDialogBody {
  }
  
  /**
   * * View-model for footer of Dialog.
   * */
  export class AiDialogFooter {
    static inject: any;
    buttons: any[];
    useDefaultButtons: boolean;
    constructor(controller: DialogController);
    close(buttonValue: string): any;
    useDefaultButtonsChanged(newValue: boolean): any;
    static isCancelButton(value: string): any;
  }
  export class AiDialogHeader {
    static inject: any;
    constructor(controller: any);
  }
  export class AiDialog {
  }
  export class AttachFocus {
    static inject: any;
    constructor(element: any);
    attached(): any;
  }
  export class DialogController {
    constructor(renderer: DialogRenderer, settings: any, resolve: Function, reject: Function);
    ok(result: DialogResult): any;
    cancel(result: DialogResult): any;
    error(message: any): any;
    close(ok: boolean, result: DialogResult): any;
  }
  class DialogResult {
    wasCancelled: any;
    output: any;
    constructor(cancelled: any, result: any);
  }
  export let globalSettings: any;
  export class DialogRenderer {
    defaultSettings: any;
    constructor();
    createDialogHost(dialogController: DialogController): any;
    showDialog(dialogController: DialogController): any;
    hideDialog(dialogController: DialogController): any;
    destroyDialogHost(dialogController: DialogController): any;
  }
  export class DialogService {
    static inject: any;
    constructor(container: Container, compositionEngine: any, renderer: any);
    open(settings: any): any;
  }
  export function invokeLifecycle(instance: any, name: string, model: any): any;
}