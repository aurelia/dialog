import {DialogController} from '../../src/dialog-controller';
import {DialogRenderer} from '../../src/dialog-renderer';
import {dialogOptions} from '../../src/dialog-options';
import {configure} from '../../src/aurelia-dialog';
import {TestElement} from '../fixtures/test-element';

describe('the Dialog Renderer', () => {
  it('calls position if specified', (done) => {
    const settings = {
      viewModel: TestElement,
      position: (modalContainer, modalOverlay) => {
        expect(modalContainer.tagName).toBe('AI-DIALOG-CONTAINER');
        expect(modalOverlay.tagName).toBe('AI-DIALOG-OVERLAY');
        done();
      }
    };

    let renderer = new DialogRenderer();
    let controller = new DialogController(renderer, settings, Function.prototype, Function.prototype);
    controller.slot = {
      attached: Function.prototype,
      anchor: document.createElement('ai-dialog')
    };

    renderer.showDialog(controller);
  });
});
