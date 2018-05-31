import { transient, Container } from 'aurelia-dependency-injection';
import { DOM } from 'aurelia-pal';
import { Animator } from 'aurelia-templating';
import { InfrastructureDialogController } from './infrastructure-dialog-controller';
import { Renderer } from './renderer';
import { DialogHost } from './dialog-host';
import { DialogContainer } from './dialog-container';
import { DialogKeyboardService } from './dialog-keyboard-service';

const CONTAINER_TAG_NAME = 'dialog';

@transient()
export class DialogRendererNative implements Renderer {
  private clickDismissHandler: (eo: MouseEvent) => void;
  private dialogCancel: (eo: Event) => void;

  /**
   * @internal
   */
  public keyboardService: DialogKeyboardService;

  /**
   * @internal
   */
  public dialogContainer: DialogContainer<HTMLDialogElement>;

  /**
   * @internal
   */
  public host: DialogHost;

  // tslint:disable-next-line:member-ordering
  public static inject = [Container];
  constructor(private container: Container) { }

  private clearLayout(): void {
    (this.dialogContainer as any) = undefined;
  }

  private setupClickDismissHandling(dialogController: InfrastructureDialogController): void {
    this.clickDismissHandler = eo => {
      if ((eo.target || eo.srcElement) !== eo.currentTarget) { return; }
      if (dialogController.settings.overlayDismiss) {
        dialogController.cancel();
      }
    };
    this.dialogContainer.element.addEventListener('click', this.clickDismissHandler);
  }

  private clearClickDismissHandling(): void {
    this.dialogContainer.element.removeEventListener('click', this.clickDismissHandler);
  }

  private attach(): void {
    this.host.addDialog(this.dialogContainer.element);
    if ((window as any).dialogPolyfill) {
      (window as any).dialogPolyfill.registerDialog(this.dialogContainer);
    }
    this.dialogContainer.element.showModal();
  }

  private detach(): void {
    // This check only seems required for the polyfill
    if (this.dialogContainer.element.hasAttribute('open')) {
      this.dialogContainer.element.close();
    }
    this.dialogContainer.element.removeEventListener('cancel', this.dialogCancel);
    this.host.removeDialog(this.dialogContainer.element);
    this.clearLayout();
  }

  public getDialogContainer(): Element {
    if (!this.dialogContainer) {
      this.dialogContainer =
        new DialogContainer(this.container.get(Animator), DOM.createElement(CONTAINER_TAG_NAME) as HTMLDialogElement);
    }
    return this.dialogContainer.element;
  }

  public showDialog(dialogController: InfrastructureDialogController): Promise<void> {
    this.keyboardService = this.container.get(DialogKeyboardService);
    const settings = dialogController.settings;
    this.host = DialogHost.getInstance(settings.host);

    if (typeof settings.position === 'function') {
      settings.position(this.dialogContainer.element);
    }

    this.keyboardService.enlist(dialogController);
    this.setupClickDismissHandling(dialogController);
    this.dialogCancel = eo => {
      if ((eo.target || eo.srcElement) !== eo.currentTarget) { return; }
      eo.preventDefault();
      eo.stopPropagation();
    };
    this.dialogContainer.element.addEventListener('cancel', this.dialogCancel);
    this.attach();
    return this.dialogContainer.addView(dialogController.view);
  }

  public hideDialog(dialogController: InfrastructureDialogController): Promise<void> {
    this.clearClickDismissHandling();
    this.keyboardService.remove(dialogController);
    return this.dialogContainer.removeView(dialogController.view)
      .then(() => this.detach());
  }
}
