
export let Renderer = class Renderer {
  getDialogContainer() {
    throw new Error('DialogRenderer must implement getDialogContainer().');
  }

  showDialog(dialogController) {
    throw new Error('DialogRenderer must implement showDialog().');
  }

  hideDialog(dialogController) {
    throw new Error('DialogRenderer must implement hideDialog().');
  }
};