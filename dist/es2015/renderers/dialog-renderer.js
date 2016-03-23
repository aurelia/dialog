import { dialogOptions } from '../dialog-options';

let currentZIndex = 1000;

let transitionEvent = function () {
  let t;
  let el = document.createElement('fakeelement');

  let transitions = {
    'transition': 'transitionend',
    'OTransition': 'oTransitionEnd',
    'MozTransition': 'transitionend',
    'WebkitTransition': 'webkitTransitionEnd'
  };

  for (t in transitions) {
    if (el.style[t] !== undefined) {
      return transitions[t];
    }
  }
}();

function getNextZIndex() {
  return ++currentZIndex;
}

function centerDialog(modalContainer) {
  const child = modalContainer.children[0];
  const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

  child.style.marginTop = Math.max((vh - child.offsetHeight) / 2, 30) + 'px';
}

export let DialogRenderer = class DialogRenderer {
  constructor() {
    this.defaultSettings = dialogOptions;

    currentZIndex = dialogOptions.startingZIndex;
    this.dialogControllers = [];
    this.containerTagName = 'ai-dialog-container';
    document.addEventListener('keyup', e => {
      if (e.keyCode === 27) {
        let top = this.dialogControllers[this.dialogControllers.length - 1];
        if (top && top.settings.lock !== true) {
          top.cancel();
        }
      }
    });
  }

  getDialogContainer() {
    return document.createElement('ai-dialog-container');
  }

  createDialogHost(dialogController) {
    let settings = dialogController.settings;
    let modalOverlay = document.createElement('ai-dialog-overlay');
    let modalContainer = dialogController.slot.anchor;
    let body = document.body;

    modalOverlay.style.zIndex = getNextZIndex();
    modalContainer.style.zIndex = getNextZIndex();

    document.body.insertBefore(modalContainer, document.body.firstChild);
    document.body.insertBefore(modalOverlay, document.body.firstChild);

    dialogController.showDialog = () => {
      this.dialogControllers.push(dialogController);

      dialogController.slot.attached();
      if (typeof settings.position === 'function') {
        settings.position(modalContainer, modalOverlay);
      } else {
        dialogController.centerDialog();
      }

      modalOverlay.onclick = () => {
        if (!settings.lock) {
          dialogController.cancel();
        } else {
          return false;
        }
      };

      return new Promise(resolve => {
        modalContainer.addEventListener(transitionEvent, onTransitionEnd);

        function onTransitionEnd(e) {
          if (e.target !== modalContainer) {
            return;
          }
          modalContainer.removeEventListener(transitionEvent, onTransitionEnd);
          resolve();
        }

        modalOverlay.classList.add('active');
        modalContainer.classList.add('active');
        body.classList.add('ai-dialog-open');
      });
    };

    dialogController.hideDialog = () => {
      let i = this.dialogControllers.indexOf(dialogController);
      if (i !== -1) {
        this.dialogControllers.splice(i, 1);
      }

      return new Promise(resolve => {
        modalContainer.addEventListener(transitionEvent, onTransitionEnd);

        function onTransitionEnd() {
          modalContainer.removeEventListener(transitionEvent, onTransitionEnd);
          resolve();
        }

        modalOverlay.classList.remove('active');
        modalContainer.classList.remove('active');
        body.classList.remove('ai-dialog-open');
      });
    };

    dialogController.centerDialog = () => {
      if (settings.centerHorizontalOnly) return;
      centerDialog(modalContainer);
    };

    dialogController.destroyDialogHost = () => {
      document.body.removeChild(modalOverlay);
      document.body.removeChild(modalContainer);
      dialogController.slot.detached();
      return Promise.resolve();
    };

    return Promise.resolve();
  }

  showDialog(dialogController) {
    if (!dialogController.showDialog) {
      return this.createDialogHost(dialogController).then(() => {
        return dialogController.showDialog();
      });
    }

    return dialogController.showDialog();
  }

  hideDialog(dialogController) {
    return dialogController.hideDialog().then(() => {
      return dialogController.destroyDialogHost();
    });
  }
};