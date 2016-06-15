

export var DialogResult = function DialogResult(cancelled, output) {
  

  this.wasCancelled = false;

  this.wasCancelled = cancelled;
  this.output = output;
};