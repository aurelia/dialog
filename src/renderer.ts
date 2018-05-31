import { InfrastructureDialogController } from './infrastructure-dialog-controller';

export interface RendererStatic {
  new (...params: any[]): Renderer;
}

/**
 * An abstract base class for implementors of the basic Renderer API.
 */
export class Renderer {
  /**
   * Gets an anchor for the ViewSlot to insert a view into.
   * @returns A DOM element.
   */
  public getDialogContainer(): Element {
    throw new Error('DialogRenderer must implement getDialogContainer().');
  }

  /**
   * Displays the dialog.
   * @returns Promise A promise that resolves when the dialog has been displayed.
   */
  public showDialog(dialogController: InfrastructureDialogController): Promise<any> {
    throw new Error('DialogRenderer must implement showDialog().');
  }

  /**
   * Hides the dialog.
   * @returns Promise A promise that resolves when the dialog has been hidden.
   */
  public hideDialog(dialogController: InfrastructureDialogController): Promise<any> {
    throw new Error('DialogRenderer must implement hideDialog().');
  }
}
