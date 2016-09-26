import {DialogController} from '../../src/dialog-controller';
import {Container} from 'aurelia-dependency-injection';

describe('the Dialog Controller', () => {
  let dialogController;
  let renderer = {
    defaultSettings: {}
  };
  let settings;

  beforeEach(() => {
    new Container().makeGlobal();
    settings = { name: 'Test' };
    dialogController = new DialogController(renderer, settings);
  });

  it('should be created with a settings property', () => {
    expect(dialogController.settings).toEqual(settings);
  });

  it('should call close with success when ok method called', () => {
    let calledValue = 'Worked';
    spyOn(dialogController, 'close');
    dialogController.ok(calledValue);
    expect(dialogController.close).toHaveBeenCalledWith(true, calledValue);
  });

  it('should call close without success when cancel method called', () => {
    let calledValue = 'Didnt work';
    spyOn(dialogController, 'close');
    dialogController.cancel(calledValue);
    expect(dialogController.close).toHaveBeenCalledWith(false, calledValue);
  });

  it('should not be blocked from being closed if ".canDeactivate()" returns "false" once', (done) => {
    dialogController.viewModel = {
      canDeactivateCalls: 0,
      canDeactivate() {
        ++this.canDeactivateCalls;
        return this.canDeactivateCalls > 1;
      },
      deactivate() { }
    };
    dialogController.controller = {
      unbind() {}
    };
    dialogController._resolve = function () {};
    dialogController.renderer.hideDialog = function () {};
    
    spyOn(dialogController.renderer, 'hideDialog');
    dialogController.close(true).then(() => {
      expect(dialogController.renderer.hideDialog).not.toHaveBeenCalled();
      dialogController.close(true).then(() => {
        expect(dialogController.renderer.hideDialog).toHaveBeenCalled();
        done();
      });
    });
  });
});
