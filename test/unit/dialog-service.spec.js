import {DialogService} from '../../src/dialog-service';
import {Container} from 'aurelia-dependency-injection';
import {CompositionEngine} from 'aurelia-templating';
import {DialogRenderer} from '../../src/dialog-renderer';
import {TestElement} from '../fixtures/test-element';
import {TestModel} from '../fixtures/test-model';

describe('the Dialog Service', () => {
  let dialogService,
    container,
    compEng,
    renderer;

  beforeEach(() => {
    container = new Container();
    compEng = new CompositionEngine();
    renderer = new DialogRenderer();
    dialogService = new DialogService(container, compEng, renderer);
  });
  it('open with a model settings applied', () => {
    let model = new TestModel();
    let settings = { viewModel: TestElement, model: model };
    let result = dialogService.open(settings);
    result.then(resp => {
      spyOn(resp.renderer, 'showDialog');
      expect(resp.renderer.showDialog).toHaveBeenCalled();
    });
   });
});
