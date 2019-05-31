import { DOM } from 'aurelia-pal';

class AttachFocus {
    constructor(element) {
        this.element = element;
        this.value = true;
    }
    static inject() {
        return [DOM.Element];
    }
    attached() {
        if (this.value === '' || (this.value && this.value !== 'false')) {
            this.element.focus();
        }
    }
}
AttachFocus.$resource = {
    type: 'attribute',
    name: 'attach-focus'
};

export { AttachFocus };
//# sourceMappingURL=attach-focus.js.map
