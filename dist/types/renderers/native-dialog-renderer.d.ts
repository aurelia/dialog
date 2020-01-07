import { DialogController } from '../dialog-controller';
import { Renderer } from '../renderer';
export declare class NativeDialogRenderer implements Renderer {
    static dialogControllers: DialogController[];
    static keyboardEventHandler(e: KeyboardEvent): void;
    static trackController(dialogController: DialogController): void;
    static untrackController(dialogController: DialogController): void;
    private stopPropagation;
    private closeDialogClick;
    private dialogCancel;
    dialogContainer: HTMLDialogElement;
    lastActiveElement: HTMLElement;
    host: Element;
    anchor: Element;
    private getOwnElements;
    private attach;
    private detach;
    private setAsActive;
    private setAsInactive;
    private setupEventHandling;
    private clearEventHandling;
    private awaitTransition;
    getDialogContainer(): Element;
    showDialog(dialogController: DialogController): Promise<void>;
    hideDialog(dialogController: DialogController): Promise<void>;
}
