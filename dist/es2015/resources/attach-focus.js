import { DOM } from 'aurelia-pal';
export class AttachFocus {
    constructor(element) {
        this.element = element;
        this.value = true;
    }
    /**
     * @internal
     */
    // tslint:disable-next-line:member-ordering
    static inject() {
        return [DOM.Element];
    }
    attached() {
        if (this.value === '' || (this.value && this.value !== 'false')) {
            this.element.focus();
        }
    }
}
/**
 * @internal
 */
AttachFocus.$resource = {
    type: 'attribute',
    name: 'attach-focus'
};
