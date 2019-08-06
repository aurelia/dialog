import { ComponentBind } from 'aurelia-templating';
import { DialogController } from '../dialog-controller';
export declare class UxDialogHeader implements ComponentBind {
    controller: DialogController;
    /**
     * @bindable
     */
    showCloseButton: boolean | undefined;
    constructor(controller: DialogController);
    bind(): void;
}
