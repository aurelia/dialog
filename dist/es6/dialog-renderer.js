import {ViewSlot} from 'aurelia-templating';

let currentZIndex = 1000;
let transitionEvent = (function() {
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
})();

function getNextZIndex() {
  return ++currentZIndex;
}

export let globalSettings = {
  lock: true,
  centerHorizontalOnly: false
};

export class DialogRenderer {
  defaultSettings = globalSettings;
  constructor() {
    this.dialogControllers = [];
    document.addEventListener('keyup', e => {
      if (e.keyCode === 27) {
        let top = this.dialogControllers[this.dialogControllers.length - 1];
        if (top && top.settings.lock !== true) {
          top.cancel();
        }
      }
    });
  }

  createDialogHost(dialogController: DialogController) {
    let settings = dialogController.settings;
    let modalOverlay = document.createElement('ai-dialog-overlay');
    let modalContainer = document.createElement('ai-dialog-container');
    let body = document.body;

    modalOverlay.style.zIndex = getNextZIndex();
    modalContainer.style.zIndex = getNextZIndex();

    document.body.appendChild(modalOverlay);
    document.body.appendChild(modalContainer);

    dialogController.slot = new ViewSlot(modalContainer, true);
    dialogController.slot.add(dialogController.view);

    dialogController.showDialog = () => {
      this.dialogControllers.push(dialogController);

      dialogController.slot.attached();
      dialogController.centerDialog();

      modalOverlay.onclick = () => {
        if (!settings.lock) {
          dialogController.cancel();
        } else {
          return false;
        }
      };

      return new Promise((resolve) => {
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

      return new Promise((resolve) => {
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

    dialogController.destroyDialogHost = () => {
      document.body.removeChild(modalOverlay);
      document.body.removeChild(modalContainer);
      dialogController.slot.detached();
      return Promise.resolve();
    };

    dialogController.centerDialog = () => {
      let child = modalContainer.children[0];

      if (!settings.centerHorizontalOnly) {
        let vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        // Left at least 30px from the top
        child.style.marginTop = Math.max((vh - child.offsetHeight) / 2, 30) + 'px';
      }
    };

    return Promise.resolve();
  }

  showDialog(dialogController: DialogController) {
    return dialogController.showDialog();
  }

  hideDialog(dialogController: DialogController) {
    return dialogController.hideDialog();
  }

  destroyDialogHost(dialogController: DialogController) {
    return dialogController.destroyDialogHost();
  }
}
