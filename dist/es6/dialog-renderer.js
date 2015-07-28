import {ViewSlot} from 'aurelia-templating'

let currentZIndex = 1000;
let transitionEvent = (function(){
  var t,
      el = document.createElement("fakeelement");

  var transitions = {
    "transition"      : "transitionend",
    "OTransition"     : "oTransitionEnd",
    "MozTransition"   : "transitionend",
    "WebkitTransition": "webkitTransitionEnd"
  }

  for (t in transitions){
    if (el.style[t] !== undefined){
      return transitions[t];
    }
  }
})();

function getNextZIndex(){
  return ++currentZIndex;
}

export class DialogRenderer {
  defaultSettings = {
    lock: true
  };

  createDialogHost(controller){
    var settings = controller.settings,
        emptyParameters = {},
        modalOverlay = document.createElement('dialog-overlay'),
        modalContainer = document.createElement('dialog-container');

    modalOverlay.style.zIndex = getNextZIndex();
    modalContainer.style.zIndex = getNextZIndex();

    document.body.appendChild(modalOverlay);
    document.body.appendChild(modalContainer);

    controller.slot = new ViewSlot(modalContainer, true);
    controller.slot.add(controller.view);

    controller.showDialog = function(){
      controller.slot.attached();
      controller.centerDialog();

      document.onkeypress = function(e) {
        if (e.keyCode === 27 && settings.lock !== true) {
          controller.cancel();
        }
      };

      modalOverlay.onclick = () => {
        if (!settings.lock) {
          controller.cancel();
        } else {
          return false;
        }
      };

      return new Promise((resolve, reject) => {
        modalContainer.addEventListener(transitionEvent, onTransitionEnd);

        function onTransitionEnd(event) {
          modalContainer.removeEventListener(transitionEvent, onTransitionEnd);
          resolve();
        };

        modalOverlay.classList.add('active');
        modalContainer.classList.add('active');
      });
    };

    controller.hideDialog = () => {
      return new Promise((resolve, reject) => {
        modalContainer.addEventListener(transitionEvent, onTransitionEnd);

        function onTransitionEnd(event) {
          modalContainer.removeEventListener(transitionEvent, onTransitionEnd);
          resolve();
        };

        modalOverlay.classList.remove('active');
        modalContainer.classList.remove('active');
      });
    };

    controller.destroyDialogHost = () => {
      document.body.removeChild(modalOverlay);
      document.body.removeChild(modalContainer);
      controller.slot.detached();
      return Promise.resolve();
    };

    controller.centerDialog = () => {
      var child = modalContainer.children[0];

      if(!settings.centerHorizontalOnly){
        child.style.marginLeft = -(child.offsetWidth/2) + 'px';
      }

      child.style.marginTop = -(child.offsetHeight/2) + 'px';
    };

    return Promise.resolve();
  }

  showDialog(controller){
    return controller.showDialog();
  }

  hideDialog(controller){
    return controller.hideDialog();
  }

  destroyDialogHost(controller){
    return controller.destroyDialogHost();
  }
}
