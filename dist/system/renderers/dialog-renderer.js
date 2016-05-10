'use strict';

System.register(['../dialog-options', 'aurelia-pal', 'aurelia-dependency-injection'], function (_export, _context) {
  var dialogOptions, DOM, transient, _dec, _class, containerTagName, overlayTagName, transitionEvent, DialogRenderer;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function centerDialog(modalContainer) {
    var child = modalContainer.children[0];
    var vh = Math.max(DOM.querySelectorAll('html')[0].clientHeight, window.innerHeight || 0);

    child.style.marginTop = Math.max((vh - child.offsetHeight) / 2, 30) + 'px';
    child.style.marginBottom = Math.max((vh - child.offsetHeight) / 2, 30) + 'px';
  }
  return {
    setters: [function (_dialogOptions) {
      dialogOptions = _dialogOptions.dialogOptions;
    }, function (_aureliaPal) {
      DOM = _aureliaPal.DOM;
    }, function (_aureliaDependencyInjection) {
      transient = _aureliaDependencyInjection.transient;
    }],
    execute: function () {
      containerTagName = 'ai-dialog-container';
      overlayTagName = 'ai-dialog-overlay';

      transitionEvent = function () {
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

      _export('DialogRenderer', DialogRenderer = (_dec = transient(), _dec(_class = function () {
        function DialogRenderer() {
          var _this = this;

          _classCallCheck(this, DialogRenderer);

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
          if (!dialogController.showDialog) {
            return this._createDialogHost(dialogController).then(function () {
              return dialogController.showDialog();
            });
          }
          return dialogController.showDialog();
        };

        DialogRenderer.prototype.hideDialog = function hideDialog(dialogController) {
          return dialogController.hideDialog().then(function () {
            return dialogController.destroyDialogHost();
          });
        };

        DialogRenderer.prototype._createDialogHost = function _createDialogHost(dialogController) {
          var _this2 = this;

          var settings = dialogController.settings;
          var modalOverlay = DOM.createElement(overlayTagName);
          var modalContainer = DOM.createElement(containerTagName);
          var wrapper = document.createElement('div');
          var anchor = dialogController.slot.anchor;
          wrapper.appendChild(anchor);
          modalContainer.appendChild(wrapper);
          var body = DOM.querySelectorAll('body')[0];
          var closeModalClick = function closeModalClick(e) {
            if (!settings.lock && !e._aureliaDialogHostClicked) {
              dialogController.cancel();
            } else {
              return false;
            }
          };

          var stopPropagation = function stopPropagation(e) {
            e._aureliaDialogHostClicked = true;
          };

          var dialogHost = modalContainer.querySelector('ai-dialog');

          dialogController.showDialog = function () {
            if (!_this2.dialogControllers.length) {
              DOM.addEventListener('keyup', _this2.escapeKeyEvent);
            }

            _this2.dialogControllers.push(dialogController);

            dialogController.slot.attached();

            if (typeof settings.position === 'function') {
              settings.position(modalContainer, modalOverlay);
            } else {
              dialogController.centerDialog();
            }

            modalContainer.addEventListener('click', closeModalClick);
            dialogHost.addEventListener('click', stopPropagation);

            return new Promise(function (resolve) {
              modalContainer.addEventListener(transitionEvent(), onTransitionEnd);

              function onTransitionEnd(e) {
                if (e.target !== modalContainer) {
                  return;
                }
                modalContainer.removeEventListener(transitionEvent(), onTransitionEnd);
                resolve();
              }

              modalOverlay.classList.add('active');
              modalContainer.classList.add('active');
              body.classList.add('ai-dialog-open');
            });
          };

          dialogController.hideDialog = function () {
            modalContainer.removeEventListener('click', closeModalClick);
            dialogHost.removeEventListener('click', stopPropagation);

            var i = _this2.dialogControllers.indexOf(dialogController);
            if (i !== -1) {
              _this2.dialogControllers.splice(i, 1);
            }

            if (!_this2.dialogControllers.length) {
              DOM.removeEventListener('keyup', _this2.escapeKeyEvent);
            }

            return new Promise(function (resolve) {
              modalContainer.addEventListener(transitionEvent(), onTransitionEnd);

              function onTransitionEnd() {
                modalContainer.removeEventListener(transitionEvent(), onTransitionEnd);
                resolve();
              }

              modalOverlay.classList.remove('active');
              modalContainer.classList.remove('active');

              if (!_this2.dialogControllers.length) {
                body.classList.remove('ai-dialog-open');
              }
            });
          };

          dialogController.centerDialog = function () {
            if (settings.centerHorizontalOnly) return;
            centerDialog(modalContainer);
          };

          dialogController.destroyDialogHost = function () {
            body.removeChild(modalOverlay);
            body.removeChild(modalContainer);
            dialogController.slot.detached();
            return Promise.resolve();
          };

          modalOverlay.style.zIndex = this.defaultSettings.startingZIndex;
          modalContainer.style.zIndex = this.defaultSettings.startingZIndex;

          var lastContainer = Array.from(body.querySelectorAll(containerTagName)).pop();

          if (lastContainer) {
            lastContainer.parentNode.insertBefore(modalContainer, lastContainer.nextSibling);
            lastContainer.parentNode.insertBefore(modalOverlay, lastContainer.nextSibling);
          } else {
            body.insertBefore(modalContainer, body.firstChild);
            body.insertBefore(modalOverlay, body.firstChild);
          }

          return Promise.resolve();
        };

        return DialogRenderer;
      }()) || _class));

      _export('DialogRenderer', DialogRenderer);
    }
  };
});