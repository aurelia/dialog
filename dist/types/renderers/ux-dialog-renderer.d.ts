import { Renderer } from '../renderer';
import { DialogController } from '../dialog-controller';
export declare const transitionEvent: () => string;
export declare const hasTransition: (element: Element) => boolean;
export declare class DialogRenderer implements Renderer {
    static dialogControllers: DialogController[];
    static keyboardEventHandler(e: KeyboardEvent): void;
    static trackController(dialogController: DialogController): void;
    static untrackController(dialogController: DialogController): void;
    private stopPropagation;
    private closeDialogClick;
    dialogContainer: HTMLElement;
    dialogOverlay: HTMLElement;
    host: Element;
    anchor: Element;
    private getOwnElements;
    private attach;
    private detach;
    private setAsActive;
    private setAsInactive;
    private setupClickHandling;
    private clearClickHandling;
    private centerDialog;
    private awaitTransition;
    getDialogContainer(): Element;
    showDialog(dialogController: DialogController): Promise<void>;
    hideDialog(dialogController: DialogController): Promise<void>;
}
export { DialogRenderer as UxDialogRenderer };
