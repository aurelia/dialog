var _dec, _class;



import { dialogOptions } from './dialog-options';
import { DOM } from 'aurelia-pal';
import { transient } from 'aurelia-dependency-injection';

var containerTagName = 'ai-dialog-container';
var overlayTagName = 'ai-dialog-overlay';
var transitionEvent = function () {
  var transition = null;

  return function () {
    if (transition) return transition;

    var t = void 0;
    var el = DOM.createElement('fakeelement');
    var transitions = {
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
}();

export var DialogRenderer = (_dec = transient(), _dec(_class = function () {
  function DialogRenderer() {
    var _this = this;

    

    this.dialogControllers = [];

    this.escapeKeyEvent = function (e) {
      if (e.keyCode === 27) {
        var top = _this.dialogControllers[_this.dialogControllers.length - 1];
        if (top && top.settings.lock !== true) {
          top.cancel();
        }
      }
    };

    this.defaultSettings = dialogOptions;
  }

  DialogRenderer.prototype.getDialogContainer = function getDialogContainer() {
    return DOM.createElement('div');
  };

  DialogRenderer.prototype.showDialog = function showDialog(dialogController) {
    var _this2 = this;

    var settings = Object.assign({}, this.defaultSettings, dialogController.settings);
    var body = DOM.querySelectorAll('body')[0];
    var wrapper = document.createElement('div');

    this.modalOverlay = DOM.createElement(overlayTagName);
    this.modalContainer = DOM.createElement(containerTagName);
    this.anchor = dialogController.slot.anchor;
    wrapper.appendChild(this.anchor);
    this.modalContainer.appendChild(wrapper);

    this.stopPropagation = function (e) {
      e._aureliaDialogHostClicked = true;
    };
    this.closeModalClick = function (e) {
      if (!settings.lock && !e._aureliaDialogHostClicked) {
        dialogController.cancel();
      } else {
        return false;
      }
    };

    dialogController.centerDialog = function () {
      if (settings.centerHorizontalOnly) return;
      centerDialog(_this2.modalContainer);
    };

    this.modalOverlay.style.zIndex = this.defaultSettings.startingZIndex;
    this.modalContainer.style.zIndex = this.defaultSettings.startingZIndex;

    var lastContainer = Array.from(body.querySelectorAll(containerTagName)).pop();

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

    return new Promise(function (resolve) {
      var renderer = _this2;
      if (settings.ignoreTransitions) {
        resolve();
      } else {
        _this2.modalContainer.addEventListener(transitionEvent(), onTransitionEnd);
      }

      _this2.modalOverlay.classList.add('active');
      _this2.modalContainer.classList.add('active');
      body.classList.add('ai-dialog-open');

      function onTransitionEnd(e) {
        if (e.target !== renderer.modalContainer) {
          return;
        }
        renderer.modalContainer.removeEventListener(transitionEvent(), onTransitionEnd);
        resolve();
      }
    });
  };

  DialogRenderer.prototype.hideDialog = function hideDialog(dialogController) {
    var _this3 = this;

    var settings = Object.assign({}, this.defaultSettings, dialogController.settings);
    var body = DOM.querySelectorAll('body')[0];

    this.modalContainer.removeEventListener('click', this.closeModalClick);
    this.anchor.removeEventListener('click', this.stopPropagation);

    var i = this.dialogControllers.indexOf(dialogController);
    if (i !== -1) {
      this.dialogControllers.splice(i, 1);
    }

    if (!this.dialogControllers.length) {
      DOM.removeEventListener('keyup', this.escapeKeyEvent);
    }

    return new Promise(function (resolve) {
      var renderer = _this3;
      if (settings.ignoreTransitions) {
        resolve();
      } else {
        _this3.modalContainer.addEventListener(transitionEvent(), onTransitionEnd);
      }

      _this3.modalOverlay.classList.remove('active');
      _this3.modalContainer.classList.remove('active');

      function onTransitionEnd() {
        renderer.modalContainer.removeEventListener(transitionEvent(), onTransitionEnd);
        resolve();
      }
    }).then(function () {
      body.removeChild(_this3.modalOverlay);
      body.removeChild(_this3.modalContainer);
      dialogController.slot.detached();

      if (!_this3.dialogControllers.length) {
        body.classList.remove('ai-dialog-open');
      }

      return Promise.resolve();
    });
  };

  return DialogRenderer;
}()) || _class);

function centerDialog(modalContainer) {
  var child = modalContainer.children[0];
  var vh = Math.max(DOM.querySelectorAll('html')[0].clientHeight, window.innerHeight || 0);

  child.style.marginTop = Math.max((vh - child.offsetHeight) / 2, 30) + 'px';
  child.style.marginBottom = Math.max((vh - child.offsetHeight) / 2, 30) + 'px';
}