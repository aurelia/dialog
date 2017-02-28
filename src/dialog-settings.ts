import {ViewStrategy} from 'aurelia-templating';

/**
 * All available dialog settings.
 */
export interface DialogSettings {
  [setting: string]: any;

  /**
   * The view model url, constructor or instance for the dialog.
   */
  viewModel?: string | { new (...params: any[]): any } | any;

  /**
   * The view url or view strategy to override the default view location convention.
   */
  view?: string | ViewStrategy;

  /**
   * Data to be passed to the "activate" hook on the view model.
   */
  model?: any;

  /**
   * When set to false allows the dialog to be closed with ESC key or clicking outside the dialog.
   * When set to true the dialog does not close on ESC key or clicking outside it.
   */
  lock?: boolean;

  /**
   * When set to true the dialog can be closed with the ESC key.
   */
  enableEscClose?: boolean;

  /**
   * The z-index of the dialog.
   * In the terms of the DialogRenderer it is applied to the dialog overlay and the dialog container.
   */
  startingZIndex?: number;

  /**
   * Centers the dialog only horizontally.
   */
  centerHorizontalOnly?: boolean;

  /**
   * When set to true conveys a cancellation as a rejection.
   */
  rejectOnCancel?: boolean;

  /**
   * When set to true transitions will not be awaited to end.
   */
  ignoreTransitions?: boolean;

  /**
   * Usde to provide custom positioning logic.
   * When invoked the function is passed the dialog container and the dialog overlay elements.
   */
  position?: (dialogContainer: Element, dialogOverlay: Element) => void;
}

/**
 * @internal
 */
export class DefaultDialogSettings implements DialogSettings {
  [setting: string]: any;
  public lock = true;
  public enableEscClose = false;
  public startingZIndex = 1000;
  public centerHorizontalOnly = false;
  public rejectOnCancel = false;
  public ignoreTransitions = false;
  public position?: (dialogContainer: Element, dialogOverlay: Element) => void;
}
