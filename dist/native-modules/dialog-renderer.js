import { DOM } from 'aurelia-pal';
import { transient } from 'aurelia-dependency-injection';
var containerTagName = 'ux-dialog-container';
var overlayTagName = 'ux-dialog-overlay';
export var transitionEvent = (function () {
    var transition;
    return function () {
        if (transition) {
            return transition;
        }
        var el = DOM.createElement('fakeelement');
        var transitions = {
            transition: 'transitionend',
            OTransition: 'oTransitionEnd',
            MozTransition: 'transitionend',
            WebkitTransition: 'webkitTransitionEnd'
        };
        for (var t in transitions) { // tslint:disable-line:prefer-const
            if (el.style[t] !== undefined) {
                transition = transitions[t];
                return transition;
            }
        }
        return '';
    };
})();
export var hasTransition = (function () {
    var unprefixedName = 'transitionDuration';
    var prefixedNames = ['webkitTransitionDuration', 'oTransitionDuration'];
    var el;
    var transitionDurationName;
    return function (element) {
        if (!el) {
            el = DOM.createElement('fakeelement');
            if (unprefixedName in el.style) {
                transitionDurationName = unprefixedName;
            }
            else {
                transitionDurationName = prefixedNames.find(function (prefixed) { return (prefixed in el.style); });
            }
        }
        return !!transitionDurationName && !!(DOM.getComputedStyle(element)[transitionDurationName]
            .split(',')
            .find(function (duration) { return !!parseFloat(duration); }));
    };
})();
var body;
function getActionKey(e) {
    if ((e.code || e.key) === 'Escape' || e.keyCode === 27) {
        return 'Escape';
    }
    if ((e.code || e.key) === 'Enter' || e.keyCode === 13) {
        return 'Enter';
    }
    return undefined;
}
var DialogRenderer = /** @class */ (function () {
    function DialogRenderer() {
    }
    DialogRenderer.keyboardEventHandler = function (e) {
        var key = getActionKey(e);
        if (!key) {
            return;
        }
        var top = DialogRenderer.dialogControllers[DialogRenderer.dialogControllers.length - 1];
        if (!top || !top.settings.keyboard) {
            return;
        }
        var keyboard = top.settings.keyboard;
        if (key === 'Escape'
            && (keyboard === true || keyboard === key || (Array.isArray(keyboard) && keyboard.indexOf(key) > -1))) {
            top.cancel();
        }
        else if (key === 'Enter' && (keyboard === key || (Array.isArray(keyboard) && keyboard.indexOf(key) > -1))) {
            top.ok();
        }
    };
    DialogRenderer.trackController = function (dialogController) {
        if (!DialogRenderer.dialogControllers.length) {
            DOM.addEventListener(dialogController.settings.keyEvent || 'keyup', DialogRenderer.keyboardEventHandler, false);
        }
        DialogRenderer.dialogControllers.push(dialogController);
    };
    DialogRenderer.untrackController = function (dialogController) {
        var i = DialogRenderer.dialogControllers.indexOf(dialogController);
        if (i !== -1) {
            DialogRenderer.dialogControllers.splice(i, 1);
        }
        if (!DialogRenderer.dialogControllers.length) {
            DOM.removeEventListener(dialogController.settings.keyEvent || 'keyup', DialogRenderer.keyboardEventHandler, false);
        }
    };
    DialogRenderer.prototype.getOwnElements = function (parent, selector) {
        var elements = parent.querySelectorAll(selector);
        var own = [];
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].parentElement === parent) {
                own.push(elements[i]);
            }
        }
        return own;
    };
    DialogRenderer.prototype.attach = function (dialogController) {
        var spacingWrapper = DOM.createElement('div'); // TODO: check if redundant
        spacingWrapper.appendChild(this.anchor);
        this.dialogContainer = DOM.createElement(containerTagName);
        this.dialogContainer.appendChild(spacingWrapper);
        this.dialogOverlay = DOM.createElement(overlayTagName);
        var zIndex = typeof dialogController.settings.startingZIndex === 'number'
            ? dialogController.settings.startingZIndex + ''
            : null;
        this.dialogOverlay.style.zIndex = zIndex;
        this.dialogContainer.style.zIndex = zIndex;
        var lastContainer = this.getOwnElements(this.host, containerTagName).pop();
        if (lastContainer && lastContainer.parentElement) {
            this.host.insertBefore(this.dialogContainer, lastContainer.nextSibling);
            this.host.insertBefore(this.dialogOverlay, lastContainer.nextSibling);
        }
        else {
            this.host.insertBefore(this.dialogContainer, this.host.firstChild);
            this.host.insertBefore(this.dialogOverlay, this.host.firstChild);
        }
        dialogController.controller.attached();
        this.host.classList.add('ux-dialog-open');
    };
    DialogRenderer.prototype.detach = function (dialogController) {
        this.host.removeChild(this.dialogOverlay);
        this.host.removeChild(this.dialogContainer);
        dialogController.controller.detached();
        if (!DialogRenderer.dialogControllers.length) {
            this.host.classList.remove('ux-dialog-open');
        }
    };
    DialogRenderer.prototype.setAsActive = function () {
        this.dialogOverlay.classList.add('active');
        this.dialogContainer.classList.add('active');
    };
    DialogRenderer.prototype.setAsInactive = function () {
        this.dialogOverlay.classList.remove('active');
        this.dialogContainer.classList.remove('active');
    };
    DialogRenderer.prototype.setupClickHandling = function (dialogController) {
        this.stopPropagation = function (e) { e._aureliaDialogHostClicked = true; };
        this.closeDialogClick = function (e) {
            if (dialogController.settings.overlayDismiss && !e._aureliaDialogHostClicked) {
                dialogController.cancel();
            }
        };
        this.dialogContainer.addEventListener('click', this.closeDialogClick);
        this.anchor.addEventListener('click', this.stopPropagation);
    };
    DialogRenderer.prototype.clearClickHandling = function () {
        this.dialogContainer.removeEventListener('click', this.closeDialogClick);
        this.anchor.removeEventListener('click', this.stopPropagation);
    };
    DialogRenderer.prototype.centerDialog = function () {
        var child = this.dialogContainer.children[0];
        var vh = Math.max(DOM.querySelectorAll('html')[0].clientHeight, window.innerHeight || 0);
        child.style.marginTop = Math.max((vh - child.offsetHeight) / 2, 30) + 'px';
        child.style.marginBottom = Math.max((vh - child.offsetHeight) / 2, 30) + 'px';
    };
    DialogRenderer.prototype.awaitTransition = function (setActiveInactive, ignore) {
        var _this = this;
        return new Promise(function (resolve) {
            // tslint:disable-next-line:no-this-assignment
            var renderer = _this;
            var eventName = transitionEvent();
            function onTransitionEnd(e) {
                if (e.target !== renderer.dialogContainer) {
                    return;
                }
                renderer.dialogContainer.removeEventListener(eventName, onTransitionEnd);
                resolve();
            }
            if (ignore || !hasTransition(_this.dialogContainer)) {
                resolve();
            }
            else {
                _this.dialogContainer.addEventListener(eventName, onTransitionEnd);
            }
            setActiveInactive();
        });
    };
    DialogRenderer.prototype.getDialogContainer = function () {
        return this.anchor || (this.anchor = DOM.createElement('div'));
    };
    DialogRenderer.prototype.showDialog = function (dialogController) {
        var _this = this;
        if (!body) {
            body = DOM.querySelectorAll('body')[0];
        }
        if (dialogController.settings.host) {
            this.host = dialogController.settings.host;
        }
        else {
            this.host = body;
        }
        var settings = dialogController.settings;
        this.attach(dialogController);
        if (typeof settings.position === 'function') {
            settings.position(this.dialogContainer, this.dialogOverlay);
        }
        else if (!settings.centerHorizontalOnly) {
            this.centerDialog();
        }
        DialogRenderer.trackController(dialogController);
        this.setupClickHandling(dialogController);
        return this.awaitTransition(function () { return _this.setAsActive(); }, dialogController.settings.ignoreTransitions);
    };
    DialogRenderer.prototype.hideDialog = function (dialogController) {
        var _this = this;
        this.clearClickHandling();
        DialogRenderer.untrackController(dialogController);
        return this.awaitTransition(function () { return _this.setAsInactive(); }, dialogController.settings.ignoreTransitions)
            .then(function () { _this.detach(dialogController); });
    };
    DialogRenderer.dialogControllers = [];
    return DialogRenderer;
}());
export { DialogRenderer };
// avoid unnecessary code
transient()(DialogRenderer);
