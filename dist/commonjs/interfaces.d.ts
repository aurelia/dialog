import { DialogCloseError } from './dialog-close-error';
import { DialogCloseResult } from './dialog-result';
/**
 * An optional interface describing the dialog canActivate convention.
 */
export interface DialogComponentCanActivate<T> {
    /**
     * Implement this hook if you want to control whether or not the dialog can be open.
     * To cancel the opening of the dialog return false or a promise that resolves to false.
     * Any other returned value is coerced to true.
     */
    canActivate(model?: T): boolean | Promise<boolean> | PromiseLike<boolean>;
}
/**
 * An optional interface describing the dialog activate convention.
 */
export interface DialogComponentActivate<T> {
    /**
     * Implement this hook if you want to perform custom logic just before the dialog is open.
     */
    activate(model?: T): void | Promise<void> | PromiseLike<void>;
}
/**
 * An optional interface describing the dialog canDeactivate convention.
 */
export interface DialogComponentCanDeactivate {
    /**
     * Implement this hook if you want to control whether or not the dialog can be closed.
     * To cancel the closing of the dialog return false or a promise that resolves to false.
     * Any other returned value is coerced to true.
     */
    canDeactivate(result: DialogCloseResult): boolean | Promise<boolean> | PromiseLike<boolean>;
}
/**
 * An optional interface describing the dialog deactivate convention.
 */
export interface DialogComponentDeactivate {
    /**
     * Implement this hook if you want to perform custom logic when the dialog is being closed.
     */
    deactivate(result: DialogCloseResult | DialogCloseError): void | Promise<void> | PromiseLike<void>;
}
