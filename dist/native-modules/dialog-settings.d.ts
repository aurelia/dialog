import { Container } from 'aurelia-dependency-injection';
import { ViewStrategy } from 'aurelia-templating';
export declare type ActionKey = 'Escape' | 'Enter';
/**
 * All available dialog settings.
 */
export interface DialogSettings {
    [setting: string]: any;
    /**
     * The view model url, constructor or instance for the dialog.
     */
    viewModel?: string | {
        new (...params: any[]): object;
    } | object;
    /**
     * The view url or view strategy to override the default view location convention.
     */
    view?: string | ViewStrategy;
    /**
     * Data to be passed to the "activate" hook on the view model.
     */
    model?: any;
    /**
     * The element that will parent the dialog.
     */
    host?: Element;
    /**
     * The child Container for the dialog creation.
     * One will be created from the root if not provided.
     */
    childContainer?: Container;
    /**
     * When set to "false" allows the dialog to be closed with ESC key or clicking outside the dialog.
     * When set to "true" the dialog does not close on ESC key or clicking outside of it.
     */
    lock?: boolean;
    /**
     * Allows for closing the top most dialog via the keyboard.
     * When set to "false" no action will be taken.
     * If set to "true", "Escape" or an array containing "Escape"
     * the dialog will be "cancel" closed when the ESC key is pressed.
     * If set to "Enter" or and array containing "Enter"
     * the dialog will be "ok" closed  when the ENTER key is pressed.
     * Using the array format allows combining the ESC and ENTER keys.
     */
    keyboard?: boolean | ActionKey | ActionKey[];
    /**
     * When set to "true" allows for the dismissal of the dialog by clicking outside of it.
     */
    overlayDismiss?: boolean;
    /**
     * The z-index of the dialog.
     * In the terms of the DialogRenderer it is applied to the dialog overlay and the dialog container.
     */
    startingZIndex?: number;
    /**
     * Centers the dialog only horizontally.
     */
    centerHorizontalOnly?: boolean;
    /**
     * When set to true conveys a cancellation as a rejection.
     */
    rejectOnCancel?: boolean;
    /**
     * When set to true transitions will not be awaited to end.
     */
    ignoreTransitions?: boolean;
    /**
     * Usde to provide custom positioning logic.
     * When invoked the function is passed the dialog container and the dialog overlay elements.
     */
    position?: (dialogContainer: Element, dialogOverlay: Element) => void;
}
