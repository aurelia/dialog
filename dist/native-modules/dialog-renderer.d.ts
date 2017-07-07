import { Renderer } from './renderer';
import { DialogController } from './dialog-controller';
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
    private getOwnElements(parent, selector);
    private attach(dialogController);
    private detach(dialogController);
    private setAsActive();
    private setAsInactive();
    private setupClickHandling(dialogController);
    private clearClickHandling();
    private centerDialog();
    private awaitTransition(setActiveInactive, ignore);
    getDialogContainer(): Element;
    showDialog(dialogController: DialogController): Promise<void>;
    hideDialog(dialogController: DialogController): Promise<void>;
}
