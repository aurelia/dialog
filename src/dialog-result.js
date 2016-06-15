/**
 * The result of a dialog open operation.
 */
export class DialogResult {
  /**
   * Indicates whether or not the dialog was cancelled.
   */
  wasCancelled: boolean = false;

  /**
   * The data returned from the dialog.
   */
  output: any;

  /**
   * Creates an instance of DialogResult (Used Internally)
   */
  constructor(cancelled: boolean, output: any) {
    this.wasCancelled = cancelled;
    this.output = output;
  }
}
