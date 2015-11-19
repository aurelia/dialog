import {ViewSlot} from 'aurelia-templating';
import {CompositionEngine} from 'aurelia-templating';
import {invokeLifecycle} from './lifecycle';
import {Origin} from 'aurelia-metadata';
import {handleEventListeners} from './util';

let OVERLAY_SETTINGS = {
  tagName: 'ai-dialog-overlay',
  activeClass: 'active'
};

export let globalSettings = {
  lock: true,
  centerHorizontalOnly: false,
  currentZIndex: 5000,
  overlay: OVERLAY_SETTINGS
};

function getNextZIndex() {
  return ++globalSettings.currentZIndex;
}

export class DialogRenderer {
  static inject = [CompositionEngine];

  fragment = document.createDocumentFragment();
  overlay  = document.createElement(OVERLAY_SETTINGS.tagName);
  defaultSettings = globalSettings;
  dialogControllers = [];

  constructor(compositionEngine) {
    this.compositionEngine = compositionEngine;
    this._eventHandler = this._eventHandler.bind(this);
    // this.fragment.appendChild(this.overlay);
    this.overlay.style.zIndex = getNextZIndex();
  }

  getOverlay() {
    if (!this.overlay && this.dialogControllers.length) {
      this.overlay = document.createElement(OVERLAY_SETTINGS.tagName);
      document.body.appendChild(this.overlay);
    }
    return this.overlay;
  }

  _eventHandler(e) {
    if (e.type === 'keyup' && e.keyCode === 27) {
      this.cancelTop();
    }
    else if (e.type === 'click' || e.type === 'touchstart') {
      this.cancelTop();
    }
  }

  bindEventListeners() {
    if (this.isListening) return;
    let overlay = this.getOverlay();
        // overlay.addEventListener('click', this._eventHandler);
    document.addEventListener('keyup', this._eventHandler);
    this.isListening = true;
  }

  unbindEventListeners() {
    if (this.dialogControllers.length) return;
    if (!this.isListening) return;
    let overlay = this.getOverlay();
        // overlay.removeEventListener('click', this._eventHandler);
    document.removeEventListener('keyup', this._eventHandler);
    this.isListening = false;
  }

  cancelTop() {
    let top = this.dialogControllers[this.dialogControllers.length - 1];
    if (top && top.settings.lock !== true) {
      top.cancel();
    }
  }

  showOverlay() {
    if (!this.overlayAttached)
      // document.body.appendChild(this.overlay);
    this.overlayAttached = true;
    this.overlay.classList.add(OVERLAY_SETTINGS.activeClass);
  }

  hideOverlay() {
    if (this.dialogControllers.length) { return; }
    return handleEventListeners(this.overlay, 'transitionend', ()=> {
      this.overlay.classList.remove(OVERLAY_SETTINGS.activeClass);
    })
    // .then(()=> this.fragment.appendCh#FAFAFAild(this.overlay))
    .then(()=> this.overlayAttached = false);
  }

  activateLifecycle(dialogController, instruction, model, resolve) {
    dialogController.viewModel = instruction.viewModel;
    return invokeLifecycle(dialogController.viewModel, 'canActivate', model).then( canActivate => {
      if (canActivate) {
        return invokeLifecycle(dialogController.viewModel, 'activate')
          .then(() => this.createController(dialogController, instruction))
          .then(() => this.createHost(this, dialogController))
          .then(() => this.showDialog(dialogController));
      }
    });
  }

  deactivateLifecycle(dialogController, returnResult) {
    return invokeLifecycle(dialogController.viewModel, 'canDeactivate').then(canDeactivate => {
      if (canDeactivate) {
        return invokeLifecycle(dialogController.viewModel, 'deactivate')
          .then(() => this.hideDialog(dialogController))
          .then(() => this.destroyHost(dialogController))
          .then(() => this.destroyController(dialogController, returnResult));
      }
    });
  }

  createController(dialogController, instruction) {
    return this.compositionEngine.createController(instruction)
      .then(controller => {
        dialogController.controller = controller;
        dialogController.view = controller.view;
        controller.automate();
        return dialogController;
      });
  }

  destroyController(dialogController, returnResult) {
    dialogController.controller.unbind();
    dialogController._resolve(returnResult);
    return Promise.resolve(dialogController);
  }

  createHost(service, dialogController) {
    let element = document.createElement('ai-dialog-container');
    element.style.zIndex = getNextZIndex();
    document.body.appendChild(element);

    dialogController.slot = new ViewSlot(element, true);
    dialogController.slot.add(dialogController.view);
    dialogController.element = element;
    return Promise.resolve(dialogController);
  }

  destroyHost(dialogController) {
    dialogController.element.remove();
    dialogController.slot.detached();
    return Promise.resolve(dialogController);
  }

  showDialog(dialogController) {
    this.showOverlay();
    this.bindEventListeners();
    this.dialogControllers.push(dialogController);
    dialogController.slot.attached();
    return dialogController.showDialog();
  }

  hideDialog(dialogController) {
    let i = this.dialogControllers.indexOf(dialogController);
    if (i !== -1) {
      this.dialogControllers.splice(i, 1);
    }
    dialogController.hideDialog();
    this.hideOverlay()
    this.unbindEventListeners();
    return dialogController;
  }
}
