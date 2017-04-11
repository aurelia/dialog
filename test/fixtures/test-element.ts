import {customElement, inlineView} from 'aurelia-templating';

@inlineView('<template></template>')
@customElement('test-element')
export class TestElement {
    public canActivate() { return; }
    public activate() { return; };
    public canDeactivate() { return; }
}
