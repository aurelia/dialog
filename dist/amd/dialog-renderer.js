define(['exports', 'aurelia-templating'], function (exports, _aureliaTemplating) {
  'use strict';

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var currentZIndex = 1000;

  var transitionEvent = (function () {
    var t = undefined;
    var el = document.createElement('fakeelement');

    var transitions = {
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

  function centerDialog(modalContainer) {
    var child = modalContainer.children[0];
    var vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    child.style.marginTop = Math.max((vh - child.offsetHeight) / 2, 30) + 'px';
  }

  var globalSettings = {
    lock: true,
    centerHorizontalOnly: false,
    startingZIndex: 1000
  };

  exports.globalSettings = globalSettings;

  var DialogRenderer = (function () {
    function DialogRenderer() {
      var _this = this;

      _classCallCheck(this, DialogRenderer);

      this.defaultSettings = globalSettings;

      currentZIndex = globalSettings.startingZIndex;
      this.dialogControllers = [];
      document.addEventListener('keyup', function (e) {
        if (e.keyCode === 27) {
          var _top = _this.dialogControllers[_this.dialogControllers.length - 1];
          if (_top && _top.settings.lock !== true) {
            _top.cancel();
          }
        }
      });
    }

    DialogRenderer.prototype.createDialogHost = function createDialogHost(dialogController) {
      var _this2 = this;

      var settings = dialogController.settings;
      var modalOverlay = document.createElement('ai-dialog-overlay');
      var modalContainer = document.createElement('ai-dialog-container');
      var body = document.body;

      modalOverlay.style.zIndex = getNextZIndex();
      modalContainer.style.zIndex = getNextZIndex();

      document.body.insertBefore(modalContainer, document.body.firstChild);
      document.body.insertBefore(modalOverlay, document.body.firstChild);

      dialogController.slot = new _aureliaTemplating.ViewSlot(modalContainer, true);
      dialogController.slot.add(dialogController.view);

      dialogController.showDialog = function () {
        _this2.dialogControllers.push(dialogController);

        dialogController.slot.attached();
        if (typeof settings.position === 'function') {
          settings.position(modalContainer, modalOverlay);
        } else {
          dialogController.centerDialog();
        }

        modalOverlay.onclick = function () {
          if (!settings.lock) {
            dialogController.cancel();
          } else {
            return false;
          }
        };

        return new Promise(function (resolve) {
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

      dialogController.hideDialog = function () {
        var i = _this2.dialogControllers.indexOf(dialogController);
        if (i !== -1) {
          _this2.dialogControllers.splice(i, 1);
        }

        return new Promise(function (resolve) {
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

      dialogController.centerDialog = function () {
        if (settings.centerHorizontalOnly) return;
        centerDialog(modalContainer);
      };

      dialogController.destroyDialogHost = function () {
        document.body.removeChild(modalOverlay);
        document.body.removeChild(modalContainer);
        dialogController.slot.detached();
        return Promise.resolve();
      };

      return Promise.resolve();
    };

    DialogRenderer.prototype.showDialog = function showDialog(dialogController) {
      return dialogController.showDialog();
    };

    DialogRenderer.prototype.hideDialog = function hideDialog(dialogController) {
      return dialogController.hideDialog();
    };

    DialogRenderer.prototype.destroyDialogHost = function destroyDialogHost(dialogController) {
      return dialogController.destroyDialogHost();
    };

    return DialogRenderer;
  })();

  exports.DialogRenderer = DialogRenderer;
});