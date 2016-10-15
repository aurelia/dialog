'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DialogRenderer = undefined;

var _dec, _class;

var _aureliaPal = require('aurelia-pal');

var _aureliaDependencyInjection = require('aurelia-dependency-injection');



var containerTagName = 'ai-dialog-container';
var overlayTagName = 'ai-dialog-overlay';
var transitionEvent = function () {
  var transition = null;

  return function () {
    if (transition) return transition;

    var t = void 0;
    var el = _aureliaPal.DOM.createElement('fakeelement');
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

var DialogRenderer = exports.DialogRenderer = (_dec = (0, _aureliaDependencyInjection.transient)(), _dec(_class = function () {
  function DialogRenderer() {
    var _this = this;

    

    this._escapeKeyEventHandler = function (e) {
      if (e.keyCode === 27) {
        var top = _this._dialogControllers[_this._dialogControllers.length - 1];
        if (top && top.settings.lock !== true) {
          top.cancel();
        }
      }
    };
  }

  DialogRenderer.prototype.getDialogContainer = function getDialogContainer() {
    return _aureliaPal.DOM.createElement('div');
  };

  DialogRenderer.prototype.showDialog = function showDialog(dialogController) {
    var _this2 = this;

    var settings = dialogController.settings;
    var body = _aureliaPal.DOM.querySelectorAll('body')[0];
    var wrapper = document.createElement('div');

    this.modalOverlay = _aureliaPal.DOM.createElement(overlayTagName);
    this.modalContainer = _aureliaPal.DOM.createElement(containerTagName);
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

    this.modalOverlay.style.zIndex = settings.startingZIndex;
    this.modalContainer.style.zIndex = settings.startingZIndex;

    var lastContainer = Array.from(body.querySelectorAll(containerTagName)).pop();

    if (lastContainer) {
      lastContainer.parentNode.insertBefore(this.modalContainer, lastContainer.nextSibling);
      lastContainer.parentNode.insertBefore(this.modalOverlay, lastContainer.nextSibling);
    } else {
      body.insertBefore(this.modalContainer, body.firstChild);
      body.insertBefore(this.modalOverlay, body.firstChild);
    }

    if (!this._dialogControllers.length) {
      _aureliaPal.DOM.addEventListener('keyup', this._escapeKeyEventHandler);
    }

    this._dialogControllers.push(dialogController);

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

    var settings = dialogController.settings;
    var body = _aureliaPal.DOM.querySelectorAll('body')[0];

    this.modalContainer.removeEventListener('click', this.closeModalClick);
    this.anchor.removeEventListener('click', this.stopPropagation);

    var i = this._dialogControllers.indexOf(dialogController);
    if (i !== -1) {
      this._dialogControllers.splice(i, 1);
    }

    if (!this._dialogControllers.length) {
      _aureliaPal.DOM.removeEventListener('keyup', this._escapeKeyEventHandler);
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

      if (!_this3._dialogControllers.length) {
        body.classList.remove('ai-dialog-open');
      }

      return Promise.resolve();
    });
  };

  return DialogRenderer;
}()) || _class);


DialogRenderer.prototype._dialogControllers = [];

function centerDialog(modalContainer) {
  var child = modalContainer.children[0];
  var vh = Math.max(_aureliaPal.DOM.querySelectorAll('html')[0].clientHeight, window.innerHeight || 0);

  child.style.marginTop = Math.max((vh - child.offsetHeight) / 2, 30) + 'px';
  child.style.marginBottom = Math.max((vh - child.offsetHeight) / 2, 30) + 'px';
}