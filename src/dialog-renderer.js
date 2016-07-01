import {dialogOptions} from './dialog-options';
import {DOM} from 'aurelia-pal';
import {transient} from 'aurelia-dependency-injection';

let containerTagName = 'ai-dialog-container';
let overlayTagName = 'ai-dialog-overlay';
let transitionEvent = (function() {
  let transition = null;

  return function() {
    if (transition) return transition;

    let t;
    let el = DOM.createElement('fakeelement');
    let transitions = {
      'transition': 'transitionend',
      'OTransition': 'oTransitionEnd',
      'MozTransition': 'transitionend',
      'WebkitTransition': 'webkitTransitionEnd'
    };
    for (t in transitions) {
      if (el.style[t] !== undefined) {
        transition = transitions[t];
        return transition;
      }
    }
  };
}());

@transient()
export class DialogRenderer {
  dialogControllers = [];
  escapeKeyEvent = (e) => {
    if (e.keyCode === 27) {
      let top = this.dialogControllers[this.dialogControllers.length - 1];
      if (top && top.settings.lock !== true) {
        top.cancel();
      }
    }
  };

  constructor() {
    this.defaultSettings = dialogOptions;
  }

  getDialogContainer() {
    return DOM.createElement('div');
  }

  showDialog(dialogController: DialogController) {
    let settings = Object.assign({}, this.defaultSettings, dialogController.settings);
    let body = DOM.querySelectorAll('body')[0];
    let wrapper = document.createElement('div');

    this.modalOverlay = DOM.createElement(overlayTagName);
    this.modalContainer = DOM.createElement(containerTagName);
    this.anchor = dialogController.slot.anchor;
    wrapper.appendChild(this.anchor);
    this.modalContainer.appendChild(wrapper);

    this.stopPropagation = (e) => { e._aureliaDialogHostClicked = true; };
    this.closeModalClick = (e) => {
      if (!settings.lock && !e._aureliaDialogHostClicked) {
        dialogController.cancel();
      } else {
        return false;
      }
    };

    dialogController.centerDialog = () => {
      if (settings.centerHorizontalOnly) return;
      centerDialog(this.modalContainer);
    };

    this.modalOverlay.style.zIndex = this.defaultSettings.startingZIndex;
    this.modalContainer.style.zIndex = this.defaultSettings.startingZIndex;

    let lastContainer = Array.from(body.querySelectorAll(containerTagName)).pop();

    if (lastContainer) {
      lastContainer.parentNode.insertBefore(this.modalContainer, lastContainer.nextSibling);
      lastContainer.parentNode.insertBefore(this.modalOverlay, lastContainer.nextSibling);
    } else {
      body.insertBefore(this.modalContainer, body.firstChild);
      body.insertBefore(this.modalOverlay, body.firstChild);
    }

    if (!this.dialogControllers.length) {
      DOM.addEventListener('keyup', this.escapeKeyEvent);
    }

    this.dialogControllers.push(dialogController);

    dialogController.slot.attached();

    if (typeof settings.position === 'function') {
      settings.position(this.modalContainer, this.modalOverlay);
    } else {
      dialogController.centerDialog();
    }

    this.modalContainer.addEventListener('click', this.closeModalClick);
    this.anchor.addEventListener('click', this.stopPropagation);

    return new Promise((resolve) => {
      let renderer = this;
      if (settings.ignoreTransitions) {
        resolve();
      } else {
        this.modalContainer.addEventListener(transitionEvent(), onTransitionEnd);
      }

      this.modalOverlay.classList.add('active');
      this.modalContainer.classList.add('active');
      body.classList.add('ai-dialog-open');

      function onTransitionEnd(e) {
        if (e.target !== renderer.modalContainer) {
          return;
        }
        renderer.modalContainer.removeEventListener(transitionEvent(), onTransitionEnd);
        resolve();
      }
    });
  }

  hideDialog(dialogController: DialogController) {
    let settings = Object.assign({}, this.defaultSettings, dialogController.settings);
    let body = DOM.querySelectorAll('body')[0];

    this.modalContainer.removeEventListener('click', this.closeModalClick);
    this.anchor.removeEventListener('click', this.stopPropagation);

    let i = this.dialogControllers.indexOf(dialogController);
    if (i !== -1) {
      this.dialogControllers.splice(i, 1);
    }

    if (!this.dialogControllers.length) {
      DOM.removeEventListener('keyup', this.escapeKeyEvent);
    }

    return new Promise((resolve) => {
      let renderer = this;
      if (settings.ignoreTransitions) {
        resolve();
      } else {
        this.modalContainer.addEventListener(transitionEvent(), onTransitionEnd);
      }

      this.modalOverlay.classList.remove('active');
      this.modalContainer.classList.remove('active');

      function onTransitionEnd() {
        renderer.modalContainer.removeEventListener(transitionEvent(), onTransitionEnd);
        resolve();
      }
    })
      .then(() => {
        body.removeChild(this.modalOverlay);
        body.removeChild(this.modalContainer);
        dialogController.slot.detached();

        if (!this.dialogControllers.length) {
          body.classList.remove('ai-dialog-open');
        }

        return Promise.resolve();
      });
  }
}

function centerDialog(modalContainer) {
  const child = modalContainer.children[0];
  const vh = Math.max(DOM.querySelectorAll('html')[0].clientHeight, window.innerHeight || 0);

  child.style.marginTop = Math.max((vh - child.offsetHeight) / 2, 30) + 'px';
  child.style.marginBottom = Math.max((vh - child.offsetHeight) / 2, 30) + 'px';
}
