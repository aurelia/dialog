import {customElement,bindable,customAttribute,CompositionEngine,ViewSlot} from 'aurelia-templating';
import {Origin} from 'aurelia-metadata';
import {Container} from 'aurelia-dependency-injection';

export let dialogOptions = {
  lock: true,
  centerHorizontalOnly: false,
  startingZIndex: 1000
};

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

  value = true;

  constructor(element) {
    this.element = element;
  }

  attached() {
    if (this.value && this.value !== 'false') {
      this.element.focus();
    }
  }

  valueChanged(newValue) {
    this.value = newValue;
  }
}


/**
 * Call a lifecycle method on a viewModel if it exists.
 * @function
 * @param instance The viewModel instance.
 * @param name The lifecycle method name.
 * @param model The model to pass to the lifecycle method.
 * @returns Promise The result of the lifecycle method.
 */
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

/**
 * A controller object for a Dialog instance.
 * @constructor
 */
export class DialogController {
  settings: any;
  constructor(renderer: DialogRenderer, settings: any, resolve: Function, reject: Function) {
    this._renderer = renderer;
    this.settings = settings;
    this._resolve = resolve;
    this._reject = reject;
  }

  /**
   * Closes the dialog with a successful result.
   * @param result The returned success result.
   */
  ok(result: any) {
    this.close(true, result);
  }

  /**
   * Closes the dialog with a cancel result.
   * @param result The returned cancel result.
   */
  cancel(result: any) {
    this.close(false, result);
  }

  /**
   * Closes the dialog with an error result.
   * @param message An error message.
   * @returns Promise An empty promise object.
   */
  error(message: any) {
    return invokeLifecycle(this.viewModel, 'deactivate')
      .then(() => {
        return this._renderer.hideDialog(this);
      }).then(() => {
        this.controller.unbind();
        this._reject(message);
      });
  }

  /**
   * Closes the dialog.
   * @param ok Whether or not the user input signified success.
   * @param result The specified result.
   * @returns Promise An empty promise object.
   */
  close(ok: boolean, result: any) {
    let returnResult = new DialogResult(!ok, result);
    return invokeLifecycle(this.viewModel, 'canDeactivate').then(canDeactivate => {
      if (canDeactivate) {
        return invokeLifecycle(this.viewModel, 'deactivate')
          .then(() => {
            return this._renderer.hideDialog(this);
          }).then(() => {
            this.controller.unbind();
            this._resolve(returnResult);
          });
      }
    });
  }
}

class DialogResult {
  wasCancelled: boolean = false;
  output: any;
  constructor(cancelled: boolean, result: any) {
    this.wasCancelled = cancelled;
    this.output = result;
  }
}

/**
 * An abstract base class for implementors of the basic Renderer API.
 */
export class Renderer {
  /**
   * Gets an anchor for the ViewSlot to insert a view into.
   * @returns A DOM element.
   */
  getDialogContainer(): any {
    throw new Error('DialogRenderer must implement getDialogContainer().');
  }

  /**
   * Displays the dialog.
   * @returns Promise A promise that resolves when the dialog has been displayed.
   */
  showDialog(dialogController: DialogController): Promise<any> {
    throw new Error('DialogRenderer must implement showDialog().');
  }

  /**
   * Hides the dialog.
   * @returns Promise A promise that resolves when the dialog has been hidden.
   */
  hideDialog(dialogController: DialogController): Promise<any> {
    throw new Error('DialogRenderer must implement hideDialog().');
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

function centerDialog(modalContainer) {
  const child = modalContainer.children[0];
  const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

  child.style.marginTop = Math.max((vh - child.offsetHeight) / 2, 30) + 'px';
}

export class DialogRenderer {
  defaultSettings = dialogOptions;
  constructor() {
    currentZIndex = dialogOptions.startingZIndex;
    this.dialogControllers = [];
    this.containerTagName = 'ai-dialog-container';
    document.addEventListener('keyup', e => {
      if (e.keyCode === 27) {
        let top = this.dialogControllers[this.dialogControllers.length - 1];
        if (top && top.settings.lock !== true) {
          top.cancel();
        }
      }
    });
  }

  getDialogContainer() {
    return document.createElement('ai-dialog-container');
  }

  createDialogHost(dialogController: DialogController) {
    let settings = dialogController.settings;
    let modalOverlay = document.createElement('ai-dialog-overlay');
    let modalContainer = dialogController.slot.anchor;
    let body = document.body;

    modalOverlay.style.zIndex = getNextZIndex();
    modalContainer.style.zIndex = getNextZIndex();

    document.body.insertBefore(modalContainer, document.body.firstChild);
    document.body.insertBefore(modalOverlay, document.body.firstChild);

    dialogController.showDialog = () => {
      this.dialogControllers.push(dialogController);

      dialogController.slot.attached();
      if (typeof settings.position === 'function') {
        settings.position(modalContainer, modalOverlay);
      } else {
        dialogController.centerDialog();
      }

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

    dialogController.centerDialog = () => {
      if (settings.centerHorizontalOnly) return;
      centerDialog(modalContainer);
    };

    dialogController.destroyDialogHost = () => {
      document.body.removeChild(modalOverlay);
      document.body.removeChild(modalContainer);
      dialogController.slot.detached();
      return Promise.resolve();
    };

    return Promise.resolve();
  }

  showDialog(dialogController: DialogController) {
    if (!dialogController.showDialog) {
      return this.createDialogHost(dialogController).then(() => {
        return dialogController.showDialog();
      });
    }

    return dialogController.showDialog();
  }

  hideDialog(dialogController: DialogController) {
    return dialogController.hideDialog().then(() => {
      return dialogController.destroyDialogHost();
    });
  }
}

/**
 * A service allowing for the creation of dialogs.
 * @constructor
 */
export class DialogService {
  static inject = [Container, CompositionEngine, Renderer];

  constructor(container: Container, compositionEngine, renderer) {
    this.container = container;
    this.compositionEngine = compositionEngine;
    this.renderer = renderer;
    this.controllers = [];
    this.hasActiveDialog = false;
  }

  /**
   * Opens a new dialog.
   * @param settings Dialog settings for this dialog instance.
   * @return Promise A promise that settles when the dialog is closed.
   */
  open(settings?: Object) {
    let _settings = Object.assign({}, this.renderer.defaultSettings, settings);
    let dialogController;

    let promise = new Promise((resolve, reject) => {
      let childContainer = this.container.createChild();
      dialogController = new DialogController(this.renderer, _settings, resolve, reject);
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
            this.controllers.push(dialogController);
            this.hasActiveDialog = !!this.controllers.length;

            return this.compositionEngine.createController(returnedInstruction).then(controller => {
              dialogController.controller = controller;
              dialogController.view = controller.view;
              controller.automate();

              dialogController.slot = new ViewSlot(this.renderer.getDialogContainer(), true);
              dialogController.slot.add(dialogController.view);

              return this.renderer.showDialog(dialogController);
            });
          }
        });
      });
    });

    return promise.then((result) => {
      let i = this.controllers.indexOf(dialogController);
      if (i !== -1) {
        this.controllers.splice(i, 1);
        this.hasActiveDialog = !!this.controllers.length;
      }

      return result;
    });
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
}

let defaultRenderer = DialogRenderer;
let resources = {
  'ai-dialog': './resources/ai-dialog',
  'ai-dialog-header': './resources/ai-dialog-header',
  'ai-dialog-body': './resources/ai-dialog-body',
  'ai-dialog-footer': './resources/ai-dialog-footer',
  'attach-focus': './resources/attach-focus'
};

/**
 * A configuration builder for the dialog plugin.
 * @constructor
 */
export class DialogConfiguration {
  constructor(aurelia) {
    this.aurelia = aurelia;
    this.settings = dialogOptions;
  }

  /**
   * Selects the Aurelia conventional defaults for the dialog plugin.
   * @chainable
   */
  useDefaults(): DialogConfiguration {
    return this.useRenderer(defaultRenderer)
      .useResource('ai-dialog')
      .useResource('ai-dialog-header')
      .useResource('ai-dialog-body')
      .useResource('ai-dialog-footer')
      .useResource('attach-focus');
  }

  /**
   * Exports the chosen dialog element or view to Aurelia's global resources.
   * @param resourceName The name of the dialog resource to export.
   * @chainable
   */
  useResource(resourceName: string): DialogConfiguration {
    this.aurelia.globalResources(resources[resourceName]);
    return this;
  }

  /**
   * Configures the plugin to use a specific dialog renderer.
   * @param renderer An object with a Renderer interface.
   * @param settings Global settings for the renderer.
   * @chainable
   */
  useRenderer(renderer: Renderer, settings?: Object): DialogConfiguration {
    this.aurelia.singleton(Renderer, renderer);
    this.settings = Object.assign(dialogOptions, settings);
    return this;
  }
}
