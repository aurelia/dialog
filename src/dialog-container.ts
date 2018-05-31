import { ViewSlot, Animator, View } from 'aurelia-templating';

/**
 * @internal
 */
export class DialogContainer<T extends Element> {
    private viewSlot: ViewSlot;

    constructor(animator: Animator, public readonly element: T) {
        this.viewSlot = new ViewSlot(element, true, animator);
        this.viewSlot.attached();
    }

    public addView(view: View): Promise<void> {
        return Promise.resolve(this.viewSlot.add(view));
    }

    public removeView(view: View): Promise<void> {
        return Promise.resolve(this.viewSlot.remove(view) as any)
            .then(() => { this.viewSlot!.detached(); });
    }
}
