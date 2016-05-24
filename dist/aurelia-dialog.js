import {customElement,bindable,customAttribute,CompositionEngine,ViewSlot} from 'aurelia-templating';
import {DOM} from 'aurelia-pal';
import {transient,Container} from 'aurelia-dependency-injection';
import {Origin} from 'aurelia-metadata';

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
    this.settings = Object.assign({}, this._renderer.defaultSettings, settings);
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

export class DialogResult {
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

let containerTagName = 'ai-dialog-container';
let overlayTagName = 'ai-dialog-overlay';
let transitionEvent = (function() {
  let transition = null;

  return function() {
    if (transition) return transition;

    let t;
    let el = DOM.createElement('fakeelement');
    let transitions = {
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
}());

@transient()
export class DialogRenderer {
  dialogControllers = [];
  escapeKeyEvent = (e) => {
    if (e.keyCode === 27) {
      let top = this.dialogControllers[this.dialogControllers.length - 1];
      if (top && top.settings.lock !== true) {
        top.cancel();
      }
    }
  };

  constructor() {
    this.defaultSettings = dialogOptions;
  }

  getDialogContainer() {
    return DOM.createElement('div');
  }

  showDialog(dialogController: DialogController) {
    if (!dialogController.showDialog) {
      return this._createDialogHost(dialogController).then(() => {
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

  _createDialogHost(dialogController: DialogController) {
    let settings = dialogController.settings;
    let modalOverlay = DOM.createElement(overlayTagName);
    let modalContainer = DOM.createElement(containerTagName);
    let wrapper = document.createElement('div');
    let anchor = dialogController.slot.anchor;
    wrapper.appendChild(anchor);
    modalContainer.appendChild(wrapper);
    let body = DOM.querySelectorAll('body')[0];
    let closeModalClick = (e) => {
      if (!settings.lock && !e._aureliaDialogHostClicked) {
        dialogController.cancel();
      } else {
        return false;
      }
    };

    let stopPropagation = (e) => { e._aureliaDialogHostClicked = true; };

    let dialogHost = modalContainer.querySelector('ai-dialog');

    dialogController.showDialog = () => {
      if (!this.dialogControllers.length) {
        DOM.addEventListener('keyup', this.escapeKeyEvent);
      }

      this.dialogControllers.push(dialogController);

      dialogController.slot.attached();

      if (typeof settings.position === 'function') {
        settings.position(modalContainer, modalOverlay);
      } else {
        dialogController.centerDialog();
      }

      modalContainer.addEventListener('click', closeModalClick);
      dialogHost.addEventListener('click', stopPropagation);

      return new Promise((resolve) => {
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

    dialogController.hideDialog = () => {
      modalContainer.removeEventListener('click', closeModalClick);
      dialogHost.removeEventListener('click', stopPropagation);

      let i = this.dialogControllers.indexOf(dialogController);
      if (i !== -1) {
        this.dialogControllers.splice(i, 1);
      }

      if (!this.dialogControllers.length) {
        DOM.removeEventListener('keyup', this.escapeKeyEvent);
      }

      return new Promise((resolve) => {
        modalContainer.addEventListener(transitionEvent(), onTransitionEnd);

        function onTransitionEnd() {
          modalContainer.removeEventListener(transitionEvent(), onTransitionEnd);
          resolve();
        }

        modalOverlay.classList.remove('active');
        modalContainer.classList.remove('active');

        if (!this.dialogControllers.length) {
          body.classList.remove('ai-dialog-open');
        }
      });
    };

    dialogController.centerDialog = () => {
      if (settings.centerHorizontalOnly) return;
      centerDialog(modalContainer);
    };

    dialogController.destroyDialogHost = () => {
      body.removeChild(modalOverlay);
      body.removeChild(modalContainer);
      dialogController.slot.detached();
      return Promise.resolve();
    };

    modalOverlay.style.zIndex = this.defaultSettings.startingZIndex;
    modalContainer.style.zIndex = this.defaultSettings.startingZIndex;

    let lastContainer = Array.from(body.querySelectorAll(containerTagName)).pop();

    if (lastContainer) {
      lastContainer.parentNode.insertBefore(modalContainer, lastContainer.nextSibling);
      lastContainer.parentNode.insertBefore(modalOverlay, lastContainer.nextSibling);
    } else {
      body.insertBefore(modalContainer, body.firstChild);
      body.insertBefore(modalOverlay, body.firstChild);
    }

    return Promise.resolve();
  }
}

function centerDialog(modalContainer) {
  const child = modalContainer.children[0];
  const vh = Math.max(DOM.querySelectorAll('html')[0].clientHeight, window.innerHeight || 0);

  child.style.marginTop = Math.max((vh - child.offsetHeight) / 2, 30) + 'px';
  child.style.marginBottom = Math.max((vh - child.offsetHeight) / 2, 30) + 'px';
}

/**
 * A service allowing for the creation of dialogs.
 * @constructor
 */
export class DialogService {
  static inject = [Container, CompositionEngine];

  constructor(container: Container, compositionEngine) {
    this.container = container;
    this.compositionEngine = compositionEngine;
    this.controllers = [];
    this.hasActiveDialog = false;
  }

  /**
   * Opens a new dialog.
   * @param settings Dialog settings for this dialog instance.
   * @return Promise A promise that settles when the dialog is closed.
   */
  open(settings?: Object) {
    let dialogController;

    let promise = new Promise((resolve, reject) => {
      let childContainer = this.container.createChild();
      dialogController = new DialogController(childContainer.get(Renderer), settings, resolve, reject);
      childContainer.registerInstance(DialogController, dialogController);
      let host = dialogController._renderer.getDialogContainer();

      let instruction = {
        container: this.container,
        childContainer: childContainer,
        model: dialogController.settings.model,
        viewModel: dialogController.settings.viewModel,
        viewSlot: new ViewSlot(host, true),
        host: host
      };

      return _getViewModel(instruction, this.compositionEngine).then(returnedInstruction => {
        dialogController.viewModel = returnedInstruction.viewModel;
        dialogController.slot = returnedInstruction.viewSlot;

        return invokeLifecycle(dialogController.viewModel, 'canActivate', dialogController.settings.model).then(canActivate => {
          if (canActivate) {
            this.controllers.push(dialogController);
            this.hasActiveDialog = !!this.controllers.length;

            return this.compositionEngine.compose(returnedInstruction).then(controller => {
              dialogController.controller = controller;
              dialogController.view = controller.view;

              return dialogController._renderer.showDialog(dialogController);
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
}

function _getViewModel(instruction, compositionEngine) {
  if (typeof instruction.viewModel === 'function') {
    instruction.viewModel = Origin.get(instruction.viewModel).moduleId;
  }

  if (typeof instruction.viewModel === 'string') {
    return compositionEngine.ensureViewModel(instruction);
  }

  return Promise.resolve(instruction);
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
