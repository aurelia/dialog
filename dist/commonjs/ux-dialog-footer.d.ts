import { DialogController } from './dialog-controller';
/**
 * View-model for footer of Dialog.
 */
export declare class UxDialogFooter {
    controller: DialogController;
    static isCancelButton(value: string): boolean;
    buttons: any[];
    useDefaultButtons: boolean;
    constructor(controller: DialogController);
    close(buttonValue: string): void;
    useDefaultButtonsChanged(newValue: boolean): void;
}
