import { ComponentAttached } from 'aurelia-templating';
export default class AttachFocus implements ComponentAttached {
    private element;
    value: boolean | string;
    constructor(element: HTMLElement);
    attached(): void;
}
