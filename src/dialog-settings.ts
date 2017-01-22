// TODO: add doc

export interface DialogSettings {
  [setting: string]: any;
  viewModel?: any;
  view?: any;
  model?: any;
  lock?: boolean;
  enableEscClose?: boolean;
  startingZIndex?: number;
  centerHorizontalOnly?: boolean;
  rejectOnCancel?: boolean;
  ignoreTransitions?: boolean;
  position?: (dialogContainer: Element, dialogOverlay: Element) => void;
}

export interface BaseDialogSettings extends DialogSettings {
  lock: boolean;
  centerHorizontalOnly: boolean;
  startingZIndex: number;
  ignoreTransitions: boolean;
  rejectOnCancel: boolean;
  enableEscClose: boolean;
}

export class DefaultDialogSettings implements BaseDialogSettings {
  [setting: string]: any;
  public viewModel?: any;
  public view?: any;
  public model?: any;
  public lock = true;
  public enableEscClose = false;
  public startingZIndex = 1000;
  public centerHorizontalOnly = false;
  public rejectOnCancel = false;
  public ignoreTransitions = false;
  public position?: (dialogContainer: Element, dialogOverlay: Element) => void;
};
