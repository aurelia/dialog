import { transient, Container } from 'aurelia-dependency-injection';
import { DOM } from 'aurelia-pal';
import { Animator } from 'aurelia-templating';
import { DialogSettings } from './dialog-settings';
import { InfrastructureDialogController } from './infrastructure-dialog-controller';
import { Renderer } from './renderer';
import { DialogHost } from './dialog-host';
import { DialogContainer } from './dialog-container';
import { DialogKeyboardService } from './dialog-keyboard-service';

const CONTAINER_TAG_NAME = 'ux-dialog-container';
const OVERLAY_TAG_NAME = 'ux-dialog-overlay';
const LAYOUT_TAG_NAME = 'ux-dialog-layout';
const CONTENT_INBOUND_CLICK = '__ux-dialog-inbound-click__';

@transient()
export class DialogRendererDefault implements Renderer {
  /**
   * @internal
   */
  public keyboardService: DialogKeyboardService;

  /**
   * @internal
   */
  public contentInboundClick: (eo: MouseEvent & { [CONTENT_INBOUND_CLICK]?: boolean }) => void;

  /**
   * @internal
   */
  public contentOutboundClick: (eo: MouseEvent & { [CONTENT_INBOUND_CLICK]?: boolean }) => void;

  /**
   * @internal
   */
  public dialogContainer: DialogContainer<HTMLElement>;

  /**
   * @internal
   */
  public dialogOverlay: HTMLElement;

  /**
   * @internal
   */
  public dialogLayout: Element;

  /**
   * @internal
   */
  public host: DialogHost;

  // tslint:disable-next-line:member-ordering
  public static inject = [Container];
  constructor(private container: Container) { }

  private setupLayout(settings: DialogSettings): void {
    this.dialogOverlay = DOM.createElement(OVERLAY_TAG_NAME) as HTMLElement;
    const zIndex = typeof settings.startingZIndex === 'number'
      ? settings.startingZIndex + ''
      : null;
    this.dialogOverlay.style.zIndex = zIndex;
    (this.dialogContainer.element).style.zIndex = zIndex;
    this.dialogLayout = DOM.createElement(LAYOUT_TAG_NAME);
    this.dialogLayout.appendChild(this.dialogOverlay);
    this.dialogLayout.appendChild(this.dialogContainer.element);
  }

  private clearLayout(): void {
    (this.dialogContainer as any) = undefined;
    (this.dialogOverlay as any) = undefined;
    (this.dialogLayout as any) = undefined;
  }

  private setupClickDismissHandling(dialogController: InfrastructureDialogController): void {
    this.contentInboundClick = eo => {
      // TODO: if (!dialogController.settings.modal) {
      //   set as focused
      // }
      eo[CONTENT_INBOUND_CLICK] = true;
    };
    this.contentOutboundClick = eo => {
      if (dialogController.settings.overlayDismiss && !eo[CONTENT_INBOUND_CLICK]) {
        dialogController.cancel();
      }
    };
    this.dialogContainer.element.addEventListener('click', this.contentInboundClick);
    this.dialogLayout.addEventListener('click', this.contentOutboundClick);
  }

  private clearClickDismissHandling(): void {
    this.dialogContainer.element.removeEventListener('click', this.contentInboundClick);
    this.dialogLayout.removeEventListener('click', this.contentOutboundClick);
  }

  private centerDialog() {
    const child = this.dialogContainer.element;
    const vh = Math.max((DOM.querySelectorAll('html')[0] as HTMLElement).clientHeight, window.innerHeight || 0);
    child.style.marginTop = Math.max((vh - child.offsetHeight) / 2, 30) + 'px';
    child.style.marginBottom = Math.max((vh - child.offsetHeight) / 2, 30) + 'px';
  }

  private attach(): void {
    this.host.addDialog(this.dialogLayout);
  }

  private detach(): void {
    this.host.removeDialog(this.dialogLayout);
    this.clearLayout();
  }

  public getDialogContainer(): Element {
    if (!this.dialogContainer) {
      this.dialogContainer =
        new DialogContainer(this.container.get(Animator), DOM.createElement(CONTAINER_TAG_NAME) as HTMLElement);
    }
    return this.dialogContainer.element;
  }

  public showDialog(dialogController: InfrastructureDialogController): Promise<void> {
    this.keyboardService = this.container.get(DialogKeyboardService);
    const settings = dialogController.settings;
    this.host = DialogHost.getInstance(settings.host);
    this.setupLayout(settings);

    if (typeof settings.position === 'function') {
      settings.position(this.dialogContainer.element, this.dialogOverlay);
    } else if (!settings.centerHorizontalOnly) {
      this.centerDialog();
    }

    this.keyboardService.enlist(dialogController);
    this.setupClickDismissHandling(dialogController);
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
