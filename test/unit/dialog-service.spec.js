import {DialogService} from '../../src/dialog-service';
import {Container} from 'aurelia-dependency-injection';
import {CompositionEngine, BindingLanguage} from 'aurelia-templating';
import {DialogRenderer} from '../../src/dialog-renderer';
import {TestElement} from '../fixtures/test-element';
import {initialize} from 'aurelia-pal-browser';
import {Loader} from 'aurelia-loader';
import {DefaultLoader} from 'aurelia-loader-default';
import {TemplatingBindingLanguage} from 'aurelia-templating-binding';

describe('the Dialog Service', () => {
  let dialogService,
    container,
    compEng,
    renderer;

  beforeEach(() => {
    initialize();

    container = new Container();
    container.registerSingleton(Loader, DefaultLoader);
    container.registerSingleton(BindingLanguage, TemplatingBindingLanguage);
    container.registerAlias(BindingLanguage, TemplatingBindingLanguage);

    compEng = container.get(CompositionEngine);
    renderer = new DialogRenderer();
    dialogService = new DialogService(container, compEng, renderer);
  });

  it('open with a model settings applied', (done) => {
    const settings = { viewModel: TestElement };

    spyOn(renderer, 'showDialog').and.callFake((dialogController) => {
      done();
    });

    dialogService.open(settings);
  });

  it('calls position if specified', (done) => {
    const settings = {
      viewModel: TestElement,
      position: (modalContainer, modalOverlay) => {
        expect(modalContainer.tagName).toBe('AI-DIALOG-CONTAINER');
        expect(modalOverlay.tagName).toBe('AI-DIALOG-OVERLAY');
        done();
      }
    };

    dialogService.open(settings);
  });
});
