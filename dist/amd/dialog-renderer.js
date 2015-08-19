define(["exports", "aurelia-templating"], function (exports, _aureliaTemplating) {
  "use strict";

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var currentZIndex = 1000;
  var transitionEvent = (function () {
    var t,
        el = document.createElement("fakeelement");

    var transitions = {
      "transition": "transitionend",
      "OTransition": "oTransitionEnd",
      "MozTransition": "transitionend",
      "WebkitTransition": "webkitTransitionEnd"
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

  var DialogRenderer = (function () {
    function DialogRenderer() {
      var _this = this;

      _classCallCheck(this, DialogRenderer);

      this.defaultSettings = {
        lock: true,
        centerHorizontalOnly: false
      };

      this.dialogControllers = [];

      document.addEventListener('keyup', function (e) {
        if (e.keyCode === 27) {
          var top = _this.dialogControllers[_this.dialogControllers.length - 1];
          if (top && top.settings.lock !== true) {
            top.cancel();
          }
        }
      });
    }

    DialogRenderer.prototype.createDialogHost = function createDialogHost(controller) {
      var _this2 = this;

      var settings = controller.settings,
          emptyParameters = {},
          modalOverlay = document.createElement('dialog-overlay'),
          modalContainer = document.createElement('dialog-container');

      modalOverlay.style.zIndex = getNextZIndex();
      modalContainer.style.zIndex = getNextZIndex();

      document.body.appendChild(modalOverlay);
      document.body.appendChild(modalContainer);

      controller.slot = new _aureliaTemplating.ViewSlot(modalContainer, true);
      controller.slot.add(controller.view);

      controller.showDialog = function () {
        _this2.dialogControllers.push(controller);

        controller.slot.attached();
        controller.centerDialog();

        modalOverlay.onclick = function () {
          if (!settings.lock) {
            controller.cancel();
          } else {
            return false;
          }
        };

        return new Promise(function (resolve, reject) {
          modalContainer.addEventListener(transitionEvent, onTransitionEnd);

          function onTransitionEnd(event) {
            modalContainer.removeEventListener(transitionEvent, onTransitionEnd);
            resolve();
          };

          modalOverlay.classList.add('active');
          modalContainer.classList.add('active');
        });
      };

      controller.hideDialog = function () {
        var i = _this2.dialogControllers.indexOf(controller);
        if (i !== -1) {
          _this2.dialogControllers.splice(i, 1);
        }

        return new Promise(function (resolve, reject) {
          modalContainer.addEventListener(transitionEvent, onTransitionEnd);

          function onTransitionEnd(event) {
            modalContainer.removeEventListener(transitionEvent, onTransitionEnd);
            resolve();
          };

          modalOverlay.classList.remove('active');
          modalContainer.classList.remove('active');
        });
      };

      controller.destroyDialogHost = function () {
        document.body.removeChild(modalOverlay);
        document.body.removeChild(modalContainer);
        controller.slot.detached();
        return Promise.resolve();
      };

      controller.centerDialog = function () {
        var child = modalContainer.children[0];

        child.style.marginLeft = -(child.offsetWidth / 2) + 'px';

        if (!settings.centerHorizontalOnly) {
          child.style.marginTop = -(child.offsetHeight / 2) + 'px';
        }
      };

      return Promise.resolve();
    };

    DialogRenderer.prototype.showDialog = function showDialog(controller) {
      return controller.showDialog();
    };

    DialogRenderer.prototype.hideDialog = function hideDialog(controller) {
      return controller.hideDialog();
    };

    DialogRenderer.prototype.destroyDialogHost = function destroyDialogHost(controller) {
      return controller.destroyDialogHost();
    };

    return DialogRenderer;
  })();

  exports.DialogRenderer = DialogRenderer;
});