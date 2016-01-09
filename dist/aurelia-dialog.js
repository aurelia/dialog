import {customElement,bindable,customAttribute,ViewSlot,CompositionEngine} from 'aurelia-templating';
import {Origin} from 'aurelia-metadata';
import {Container} from 'aurelia-dependency-injection';

@customElement('ai-dialog-body')
export class AiDialogBody {

}

/**
 * * View-model for footer of Dialog.
 * */
@customElement('ai-dialog-footer')
export class AiDialogFooter {
  static inject = [DialogController];

  @bindable buttons: any[] = [];
  @bindable useDefaultButtons: boolean = false;

  constructor(controller: DialogController) {
    this.controller = controller;
  }

  close(buttonValue: string) {
    if (AiDialogFooter.isCancelButton(buttonValue)) {
      this.controller.cancel(buttonValue);
    } else {
      this.controller.ok(buttonValue);
    }
  }

  useDefaultButtonsChanged(newValue: boolean) {
    if (newValue) {
      this.buttons = ['Cancel', 'Ok'];
    }
  }

  static isCancelButton(value: string) {
    return value === 'Cancel';
  }
}


@customElement('ai-dialog-header')
export class AiDialogHeader {
  static inject = [DialogController];

  constructor(controller) {
    this.controller = controller;
  }
}

@customElement('ai-dialog')
export class AiDialog {

}

@customAttribute('attach-focus')
export class AttachFocus {
  static inject = [Element];

  constructor(element) {
    this.element = element;
  }

  attached() {
    this.element.focus();
  }
}


export class DialogController {
  constructor(renderer: DialogRenderer, settings: any, resolve: Function, reject: Function) {
    this._renderer = renderer;
    this.settings = settings;
    this._resolve = resolve;
    this._reject = reject;
  }

  ok(result: DialogResult) {
    this.close(true, result);
  }

  cancel(result: DialogResult) {
    this.close(false, result);
  }

  error(message: any) {
    return invokeLifecycle(this.viewModel, 'deactivate').then(() => {
      return this._renderer.hideDialog(this).then(() => {
        return this._renderer.destroyDialogHost(this).then(() => {
          this.controller.unbind();
          this._reject(message);
        });
      });
    });
  }

  close(ok: boolean, result: DialogResult) {
    let returnResult = new DialogResult(!ok, result);
    return invokeLifecycle(this.viewModel, 'canDeactivate').then(canDeactivate => {
      if (canDeactivate) {
        return invokeLifecycle(this.viewModel, 'deactivate').then(() => {
          return this._renderer.hideDialog(this).then(() => {
            return this._renderer.destroyDialogHost(this).then(() => {
              this.controller.unbind();
              this._resolve(returnResult);
            });
          });
        });
      }
    });
  }
}

class DialogResult {
  wasCancelled = false;
  output;
  constructor(cancelled, result) {
    this.wasCancelled = cancelled;
    this.output = result;
  }
}

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

      let vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      child.style.marginLeft = Math.max((vw - child.offsetWidth) / 2, 0) + 'px';

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

export class DialogService {
  static inject = [Container, CompositionEngine, DialogRenderer];

  constructor(container: Container, compositionEngine, renderer) {
    this.container = container;
    this.compositionEngine = compositionEngine;
    this.renderer = renderer;
  }

  _getViewModel(instruction) {
    if (typeof instruction.viewModel === 'function') {
      instruction.viewModel = Origin.get(instruction.viewModel).moduleId;
    }

    if (typeof instruction.viewModel === 'string') {
      return this.compositionEngine.ensureViewModel(instruction);
    }

    return Promise.resolve(instruction);
  }

  open(settings) {
    let _settings =  Object.assign({}, this.renderer.defaultSettings, settings);

    return new Promise((resolve, reject) => {
      let childContainer = this.container.createChild();
      let dialogController = new DialogController(this.renderer, _settings, resolve, reject);
      let instruction = {
        viewModel: _settings.viewModel,
        container: this.container,
        childContainer: childContainer,
        model: _settings.model
      };

      childContainer.registerInstance(DialogController, dialogController);

      return this._getViewModel(instruction).then(returnedInstruction => {
        dialogController.viewModel = returnedInstruction.viewModel;

        return invokeLifecycle(returnedInstruction.viewModel, 'canActivate', _settings.model).then(canActivate => {
          if (canActivate) {
            return this.compositionEngine.createController(returnedInstruction).then(controller => {
              dialogController.controller = controller;
              dialogController.view = controller.view;
              controller.automate();

              return this.renderer.createDialogHost(dialogController).then(() => {
                return this.renderer.showDialog(dialogController);
              });
            });
          }
        });
      });
    });
  }
}

export function invokeLifecycle(instance: any, name: string, model: any) {
  if (typeof instance[name] === 'function') {
    let result = instance[name](model);

    if (result instanceof Promise) {
      return result;
    }

    if (result !== null && result !== undefined) {
      return Promise.resolve(result);
    }

    return Promise.resolve(true);
  }

  return Promise.resolve(true);
}
