import {DialogService} from '../../src/dialog-service';
import {Renderer} from '../../src/renderers/renderer';
import {Container} from 'aurelia-dependency-injection';
import {CompositionEngine, BindingLanguage} from 'aurelia-templating';
import {TestElement} from '../fixtures/test-element';
import {initialize} from 'aurelia-pal-browser';
import {Loader} from 'aurelia-loader';
import {DefaultLoader} from 'aurelia-loader-default';
import {TemplatingBindingLanguage} from 'aurelia-templating-binding';

initialize();

describe('the Dialog Service', () => {
  let dialogService;
  let container;
  let compEng;
  let renderer;

  beforeEach(() => {
    initialize();

    renderer = {
      showDialog: function() {
        return Promise.resolve();
      },
      getDialogContainer: function() {
        return document.createElement('div');
      }
    };

    container = new Container();
    container.registerSingleton(Loader, DefaultLoader);
    container.registerSingleton(BindingLanguage, TemplatingBindingLanguage);
    container.registerAlias(BindingLanguage, TemplatingBindingLanguage);
    container.registerInstance(Renderer, renderer);

    compEng = container.get(CompositionEngine);
    dialogService = new DialogService(container, compEng, renderer);
  });

  it('open with a model settings applied', (done) => {
    const settings = { viewModel: TestElement };

    spyOn(renderer, 'showDialog').and.callFake((dialogController) => {
      done();
    });

    dialogService.open(settings);
  });

  it('reports no active dialog if no dialog is open', () => {
    const settings = { viewModel: TestElement };

    spyOn(renderer, 'showDialog').and.callFake((dialogController) => {
      dialogController.cancel();
      done();
    });

    expect(dialogService.hasActiveDialog).toBe(false);

    dialogService.open(settings)
      .then(() => {
        expect(dialogService.hasActiveDialog).toBe(false);
        done();
      });
  });

  it('reports an active dialog if a dialog is open', (done) => {
    const settings = { viewModel: TestElement };

    spyOn(renderer, 'showDialog').and.callFake((dialogController) => {
      expect(dialogService.hasActiveDialog).toBe(true);
      done();
    });

    dialogService.open(settings);
  });
});
