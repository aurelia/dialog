interface DialogSettings {
  viewModel: any;
  view?: any;
  model?: any;
  lock?: boolean;
  startingZIndex?: number;
  centerHorizontalOnly?: boolean;
  throwOnCancel?: boolean;
  yieldController?: boolean;
  ignoreTransitions?: boolean;
  position?: (modalContainer: Element, modalOverlay: Element) => void;
}

interface CloseDialogResult {
  wasCancelled: boolean;
  output?: any;
}

interface OpenDialogResult {
  wasCancelled: boolean; // see aurelia/dialog#223
  controller?: DialogController;
  closeResult?: Promise<CloseDialogResult>;
}
