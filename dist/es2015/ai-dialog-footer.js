var _dec, _dec2, _class, _desc, _value, _class2, _descriptor, _descriptor2, _class3, _temp;

function _initDefineProp(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

function _initializerWarningHelper(descriptor, context) {
  throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

import { customElement, bindable, inlineView } from 'aurelia-templating';
import { DialogController } from './dialog-controller';

export let AiDialogFooter = (_dec = customElement('ai-dialog-footer'), _dec2 = inlineView(`
  <template>
    <slot></slot>

    <template if.bind="buttons.length > 0">
      <button type="button" class="btn btn-default" repeat.for="button of buttons" click.trigger="close(button)">\${button}</button>
    </template>
  </template>
`), _dec(_class = _dec2(_class = (_class2 = (_temp = _class3 = class AiDialogFooter {

  constructor(controller) {
    _initDefineProp(this, 'buttons', _descriptor, this);

    _initDefineProp(this, 'useDefaultButtons', _descriptor2, this);

    this.controller = controller;
  }

  close(buttonValue) {
    if (AiDialogFooter.isCancelButton(buttonValue)) {
      this.controller.cancel(buttonValue);
    } else {
      this.controller.ok(buttonValue);
    }
  }

  useDefaultButtonsChanged(newValue) {
    if (newValue) {
      this.buttons = ['Cancel', 'Ok'];
    }
  }

  static isCancelButton(value) {
    return value === 'Cancel';
  }
}, _class3.inject = [DialogController], _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'buttons', [bindable], {
  enumerable: true,
  initializer: function () {
    return [];
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'useDefaultButtons', [bindable], {
  enumerable: true,
  initializer: function () {
    return false;
  }
})), _class2)) || _class) || _class);