
export let DialogResult = class DialogResult {
  constructor(cancelled, output) {
    this.wasCancelled = false;

    this.wasCancelled = cancelled;
    this.output = output;
  }
};