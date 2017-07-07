import { ComponentAttached } from 'aurelia-templating';
export declare class AttachFocus implements ComponentAttached {
    private element;
    value: boolean | string;
    constructor(element: HTMLElement);
    attached(): void;
    valueChanged(newValue: string): void;
}
