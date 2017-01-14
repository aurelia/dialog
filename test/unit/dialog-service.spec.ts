import {Container} from 'aurelia-dependency-injection';
import {CompositionContext, CompositionEngine, Controller} from 'aurelia-templating';
import {DOM} from 'aurelia-pal';
import {DialogOpenResult, DialogCloseResult, DialogCancelResult, DialogOperationResult} from '../../src/dialog-result';
import {DefaultDialogSettings, DialogSettings} from '../../src/dialog-settings';
import {Renderer} from '../../src/renderer';
import {DialogController} from '../../src/dialog-controller';
import {DialogService} from '../../src/dialog-service';
// tslint:disable
describe('DialogService', () => {
  const defaultSettings = new DefaultDialogSettings();
  defaultSettings.viewModel = {};
  defaultSettings.yieldController = true;
  let dialogService: DialogService;
  let container: Container;
  let childContainer: Container;
  let compositionEngine: CompositionEngine;
  let renderer: Renderer;

  const createRenderer = (): Renderer => {
    const renderer = jasmine.createSpyObj('rendererSpy', ['getDialogContainer', 'showDialog']) as Renderer;
    (renderer.getDialogContainer as jasmine.Spy).and.callFake(() => {
      return (renderer as any).anchor || ((renderer as any).anchor = DOM.createElement('div'));
    });
    (renderer.showDialog as jasmine.Spy).and.returnValue(Promise.resolve());
    return renderer;
  };

  const createContainer = (): Container => {
    const container = jasmine.createSpyObj('containerSpy', ['createChild', 'invoke', 'registerInstance']) as Container;
    (container.createChild as jasmine.Spy).and.callFake(() => {
      const child = childContainer = createContainer();
      child.parent = container;
      return child;
    });
    (container.invoke as jasmine.Spy).and.callFake((ctor: any, dynamicDependencies: any[]) => {
      if (ctor === DialogController) {
        return new ctor(renderer, ...dynamicDependencies);
      }
      throw new Error(`Unexpected class/constructor function "${ctor}".`);
    });
    return container;
  };

  const createController = (): Controller => {
    return {} as any;
  };

  const createCompositionEngine = (): CompositionEngine => {
    const engine = jasmine.createSpyObj('compositionEngineSpy', ['compose', 'ensureViewModel']) as CompositionEngine;
    (engine.ensureViewModel as jasmine.Spy).and.callFake((context: CompositionContext) => {
      return Promise.resolve(context);
    });
    (engine.compose as jasmine.Spy).and.callFake((context: CompositionContext) => {
      return Promise.resolve(createController());
    });
    return engine;
  };

  async function _success<T>(action: () => Promise<T>, done: DoneFn): Promise<T> {
    try {
      return await action();
    } catch (e) {
      done.fail(e);
      throw e;
    }
  };

  async function _failure(action: () => Promise<any>, done: DoneFn): Promise<any> {
    try {
      await action();
    } catch (e) {
      return e;
    }
    const e = new Error('Expected rejection.');
    done.fail(e);
    throw e;
  };

  beforeEach(() => {
    renderer = createRenderer();
    container = createContainer();
    compositionEngine = createCompositionEngine();
    dialogService = new DialogService(container, compositionEngine, defaultSettings);
  });

  describe('".open"', () => {
    it('should create new settings by merging the default settings and the provided ones', async done => {
      let openResult: DialogOpenResult;

      // use "as" on the settings to help TS know which case we are in
      // const overrideSettings = { yieldController: true as true, rejectOnCancel: true as true, viewModel: {} };
      // openResult = await _success(() => dialogService.open(overrideSettings), done);

      // OR

      // when inplace TS can determine the case, this probaly will be the least common case though
      // openResult = await _success(() => dialogService.open({ yieldController: true, rejectOnCancel: true, viewModel: {} }), done);
      
      // OR

      // use "as"" on the result
      // this also applies as a solution when the settings are set as default ones - how to instruct TS in this case???
      const overrideSettings = { yieldController: true, rejectOnCancel: true, viewModel: {} };
      openResult = await _success(() => dialogService.open(overrideSettings), done) as DialogOpenResult;

      expect(openResult.controller.settings).toEqual(Object.assign({}, defaultSettings, overrideSettings));
      done();
    });

    it('should not modify the default settings', async done => {
      const overrideSettings = { model: 'model data' };
      const expectedSettings = Object.assign({}, defaultSettings);
      await _success(() => dialogService.open(overrideSettings), done);
      expect(Object.assign({}, defaultSettings)).toEqual(expectedSettings); // clone again the default settings, jasmine doesn't like them being a class
      done();
    });

    it('does not allow overrideing the "startingZIndex" setting', async done => {
      const result = await _success(() => dialogService.open({ startingZIndex: 2000 }), done) as DialogOpenResult;
      expect(result.controller.settings.startingZIndex).toEqual(defaultSettings.startingZIndex);
      done();
    });
  });

  // it('does not allow overriding "startingZIndex"', function (done) {
  //   spyOn(renderer, 'showDialog').and.callFake((dialogController) => {
  //     expect(dialogController.settings).toEqual(jasmine.objectContaining(dialogOptions));
  //     done();
  //     return Promise.resolve();
  //   });

  //   dialogService.open({ startingZIndex: 1, viewModel: TestElement });
  // });

  // it('open with a model settings applied', function (done) {
  //   const settings = { viewModel: TestElement };

  //   spyOn(renderer, 'showDialog').and.callFake((dialogController) => {
  //     done();
  //     return Promise.resolve();
  //   });

  //   dialogService.open(settings);
  // });

  // it('reports no active dialog if no dialog is open', function (done) {
  //   const settings = { viewModel: TestElement, yieldController: true };
  //   expect(dialogService.hasActiveDialog).toBe(false);
  //   dialogService.open(settings)
  //     .then((openDialogResult) => {
  //       expect(dialogService.hasActiveDialog).toBe(true);
  //       openDialogResult.controller.cancel();
  //       return openDialogResult.closeResult;
  //     })
  //     .then(() => {
  //       expect(dialogService.hasActiveDialog).toBe(false);
  //       done();
  //     });
  // });

  // it('reports an active dialog if a dialog is open', function (done) {
  //   const settings = { viewModel: TestElement, yieldController: true };
  //   expect(dialogService.hasActiveDialog).toBe(false);
  //   dialogService.open(settings).then(() => {
  //     expect(dialogService.hasActiveDialog).toBe(true);
  //     done();
  //   });
  // });

  // it('reports an active dialog after it has been shown', function (done) {
  //   // the cotroller should be added to .controllers after the result of renderer.showDialog() has settled
  //   // if there is activate
  //   const viewModel = new TestElement();
  //   viewModel.canActivate = function () { };
  //   viewModel.activate = function () { };
  //   const settings = { viewModel, yieldController: true };

  //   spyOn(viewModel, 'canActivate').and.callFake(() => {
  //     expect(dialogService.controllers.length).toBe(0);
  //   });

  //   spyOn(viewModel, 'activate').and.callFake(() => {
  //     expect(dialogService.controllers.length).toBe(0);
  //   });

  //   spyOn(renderer, 'showDialog').and.callFake((dialogController) => {
  //     expect(dialogService.controllers.length).toBe(0);
  //     return Promise.resolve();
  //   });

  //   expect(dialogService.controllers.length).toBe(0);
  //   dialogService.open(settings)
  //     .then(() => {
  //       expect(dialogService.controllers.length).toBe(1);
  //       done();
  //     });
  // });

  // it('does not report an active dialog if it fails to activate', function (done) {
  //   // the cotroller should be added to .controllers after the result of .activate() has settled
  //   // if there is activate
  //   const viewModel = new TestElement();
  //   viewModel.activate = function () { };
  //   const settings = { viewModel, yieldController: true };
  //   const activateError = new Error();

  //   spyOn(viewModel, 'activate').and.returnValue(Promise.reject(activateError));
  //   spyOn(renderer, 'showDialog').and.callThrough();

  //   // we need a Promise to the point where the dialog will open
  //   dialogService.open(settings)
  //     .then(() => {
  //       fail('".open" should not resolve if the view model failed to activate.');
  //       done();
  //     })
  //     .catch((reason) => {
  //       expect(reason).toBe(activateError);
  //       expect(renderer.showDialog).not.toHaveBeenCalled();
  //       done()
  //     });
  // });

  // it('properly tracks dialogs', function (done) {
  //   const settings = { viewModel: TestElement };
  //   const dialogsToOpen = 3;
  //   const expectedEndCount = dialogsToOpen - 1;

  //   spyOn(renderer, 'showDialog').and.callFake((dialogController) => {
  //     if (renderer.showDialog.calls.count() === dialogsToOpen) {
  //       expect(dialogService.controllers.length).toBe(expectedEndCount); // not considered "active" till ".showDalog" settles
  //     }
  //     return Promise.resolve();
  //   });

  //   expect(dialogService.controllers.length).toBe(0);
  //   let i = dialogsToOpen - 1;
  //   while (i--) {
  //     dialogService.open(settings);
  //   }

  //   // the order in which DialogService.open is called does not match 
  //   // the order DialogRenderer.showDialog is called 
  //   // with the respective DialogController instances
  //   setTimeout(() => {
  //     dialogService.open(Object.assign({}, settings, { yieldController: true }))
  //       .then((openDialogResult) => {
  //         expect(dialogService.controllers.length).toBe(dialogsToOpen); // at this point the dialog should be "open"
  //         openDialogResult.controller.cancel();
  //         return openDialogResult.closeResult;
  //       })
  //       .then(() => {
  //         expect(dialogService.controllers.length).toBe(expectedEndCount);
  //         done();
  //       });
  //   }, 60);
  // });

  // it('properly tracks dialogs closed with ".error()"', function (done) {
  //   const settings = { viewModel: TestElement, yieldController: true };
  //   const closeError = new Error();
  //   expect(dialogService.controllers.length).toBe(0); // start with 0
  //   dialogService.open(settings).then(({ controller, closeResult }) => {
  //     expect(dialogService.controllers.length).toBe(1); // have 1 open
  //     closeResult
  //       .then(() => {
  //         fail('The result of calling ".open" should not resolve if ".error" was called on the dialog controller.');
  //         done();
  //       })
  //       .catch((reason) => {
  //         expect(dialogService.controllers.length).toBe(0); // the dialog has been closed with error
  //         expect(reason).toBe(closeError);
  //         done();
  //       });
  //     controller.error(closeError);
  //   });
  // });

  // describe('".open" method result resolves when the dialog is', function () {
  //   it('closed - "yieldController" is "false"', function (done) {
  //     const expectedOutput = {};
  //     const settings = { viewModel: TestElement };
  //     spyOn(renderer, 'showDialog').and.callFake((dialogController) => {
  //       const result = Promise.resolve();
  //       setTimeout(() => result.then(() => dialogController.ok(expectedOutput)), 0);
  //       return result;
  //     });
  //     const result = dialogService.open(settings)
  //       .then(({ wasCancelled, output }) => {
  //         expect(wasCancelled).toBe(false);
  //         expect(output).toBe(expectedOutput);
  //         done();
  //       });

  //     // TODO: handle unexpected rejection
  //   });

  //   it('open - "yieldController" is "true"', function (done) {
  //     const settings = { yieldController: true, viewModel: TestElement };
  //     const result = dialogService.open(settings).then(({ wasCancelled, controller, closeResult }) => {
  //       expect(wasCancelled).toBe(false);
  //       expect(controller).toBeDefined();
  //       expect(controller).not.toBeNull();
  //       expect(closeResult).toBeDefined();
  //       expect(closeResult).not.toBeNull();
  //       done();
  //     });
  //     // TODO: handle unexpected rejection
  //   });
  // });

  // describe('reports a cancellation if the view model ".canActivate" method returns "false"', function () {
  //   beforeAll(function () {
  //     TestElement.prototype.canActivate = () => false;
  //   });

  //   afterAll(function () {
  //     delete TestElement.prototype.canActivate;
  //   });

  //   it('and "yieldController" is "false"', function (done) {
  //     const settings = { yieldController: false, viewModel: TestElement };
  //     const result = dialogService.open(settings)
  //       .then(({ wasCancelled, output }) => {
  //         expect(wasCancelled).toBe(true);
  //         expect(output).not.toBeDefined();
  //         done();
  //       });
  //     // TODO: handle unexpected rejection
  //   });

  //   it('and "yieldController" is "true"', function (done) {
  //     const settings = { yieldController: true, viewModel: TestElement };
  //     const result = dialogService.open(settings)
  //       .then(({ wasCancelled, controller, closeResult }) => {
  //         expect(wasCancelled).toBe(true);
  //         expect(controller).not.toBeDefined();
  //         expect(closeResult).not.toBeDefined();
  //         done();
  //       });
  //     // TODO: handle unexpected rejection
  //   });

  //   it('and "rejectOnCancel" is true', function (done) {
  //     const settings = { rejectOnCancel: true, viewModel: TestElement };
  //     dialogService.open(settings)
  //       .then(() => {
  //         fail('".open" should not resolve on cancellation when "rejectOnCancel" is "true".');
  //         done();
  //       })
  //       .catch((reason) => {
  //         expect(reason.wasCancelled).toBe(true);
  //         done();
  //       });
  //   });
  // });

  // describe('".open" method properly propagates errors', function () {
  //   it('when "yieldController" is "false"', function (done) {
  //     let catchWasCalled = false;
  //     let promise = dialogService.open({ viewModel: 'test/fixtures/non-existent' })
  //       .catch(() => {
  //         catchWasCalled = true;
  //       }).then(() => {
  //         expect(catchWasCalled).toBe(true);
  //         done();
  //       });
  //   });

  //   it('when "yieldController" is "true"', function (done) {
  //     let catchWasCalled = false;
  //     dialogService.open({ viewModel: 'test/fixtures/non-existent', yieldController: true })
  //       .catch(() => {
  //         catchWasCalled = true;
  //       }).then(() => {
  //         expect(catchWasCalled).toBe(true);
  //         done();
  //       });
  //   });
  // });

  // it('".open" properly propagates errors', (done) => {
  //   let catchWasCalled = false;
  //   let promise = dialogService.open({ viewModel: 'test/fixtures/non-existent' })
  //     .catch(() => {
  //       catchWasCalled = true;
  //     }).then(() => {
  //       expect(catchWasCalled).toBe(true);
  //       done();
  //     });
  // });

  // it('".open" properly propagates errors', (done) => {
  //   let catchWasCalled = false;
  //   let promise = dialogService.open({ viewModel: 'test/fixtures/non-existent' })
  //     .catch(() => {
  //       catchWasCalled = true;
  //     }).then(() => {
  //       expect(catchWasCalled).toBe(true);
  //       done();
  //     });
  // });

  // it('".closeAll" returns an empty array when all controllers succeed in closing', function (done) {
  //   const settings = { viewModel: TestElement, yieldController: true };
  //   const dialogsToOpen = 6;
  //   let i = dialogsToOpen;
  //   let openResults = [];
  //   let controllers = [];
  //   while (i--) {
  //     openResults.push(dialogService.open(settings));
  //   }
  //   Promise.all(openResults)
  //     .then((results) => {
  //       results.forEach(({ controller }) => {
  //         spyOn(controller, 'cancel').and.callThrough();
  //         controllers.push(controller);
  //       });
  //       return dialogService.closeAll();
  //     })
  //     .catch((reason => {
  //       fail(reason);
  //       done();
  //       return Promise.reject(reason);
  //     }))
  //     .then((notClosedControllers) => {
  //       expect(notClosedControllers.length).toBe(0);
  //       controllers.forEach((ctrl) => {
  //         expect(ctrl.cancel).toHaveBeenCalled();
  //       });
  //       done();
  //     });
  // });

  // it('".closeAll" returns an empty array when all controllers succeed in closing and "rejectOnCancel" is true', function (done) {
  //   const settings = { viewModel: TestElement, yieldController: true, rejectOnCancel: true };
  //   const dialogsToOpen = 6;
  //   let i = dialogsToOpen;
  //   let openResults = [];
  //   let controllers = [];
  //   while (i--) {
  //     openResults.push(dialogService.open(settings));
  //   }
  //   Promise.all(openResults)
  //     .then((results) => {
  //       results.forEach(({ controller }) => {
  //         spyOn(controller, 'cancel').and.callThrough();
  //         controllers.push(controller);
  //       });
  //       return dialogService.closeAll();
  //     })
  //     .catch((reason => {
  //       fail(reason);
  //       done();
  //       return Promise.reject(reason);
  //     }))
  //     .then((notClosedControllers) => {
  //       expect(notClosedControllers.length).toBe(0);
  //       controllers.forEach((ctrl) => {
  //         expect(ctrl.cancel).toHaveBeenCalled();
  //       });
  //       done();
  //     });
  // });

  // // no dialog is opened in the meantime and no dialog fails to close
  // it('".closeAll" method reports no open dialog after completion', function (done) {
  //   const settings = { viewModel: TestElement, yieldController: true };
  //   const dialogsToOpen = 5;
  //   let i = dialogsToOpen;
  //   let openResults = [];
  //   expect(dialogService.hasOpenDialog).toBe(false);
  //   while (i--) {
  //     openResults.push(dialogService.open(settings));
  //   }
  //   expect(dialogService.hasOpenDialog).toBe(false);
  //   Promise.all(openResults)
  //     .then(() => dialogService.closeAll())
  //     .catch((reason => {
  //       fail(reason);
  //       done();
  //       return Promise.reject(reason);
  //     }))
  //     .then(() => {
  //       expect(dialogService.controllers.length).toBe(0);
  //       done();
  //     });
  // });

  // it('".closeAll" method fails if any dialog errors when closing', function (done) {
  //   // the error propagation from both ".canDeactivate" and ".deactivate" is covered in the DialogController tests
  //   const vm = new TestElement();
  //   const expecterError = new Error();
  //   vm.canDeactivate = () => { throw expecterError; }
  //   dialogService.open({ viewModel: vm, yieldController: true })
  //     .then(() => dialogService.closeAll())
  //     .then(() => {
  //       fail('".closeAll" had to fail.');
  //       done();
  //     })
  //     .catch((reason) => {
  //       expect(reason).toBe(expecterError);
  //       expect(dialogService.controllers.length).toBe(1);
  //       done();
  //     });
  // });

  // it('".closeAll" method fails if any dialog errors when closing and "rejectOnCancel" is true', function (done) {
  //   // the error propagation from both ".canDeactivate" and ".deactivate" is covered in the DialogController tests
  //   const vm = new TestElement();
  //   const expecterError = new Error();
  //   vm.canDeactivate = () => { throw expecterError; }
  //   dialogService.open({ viewModel: vm, yieldController: true, rejectOnCancel: true })
  //     .then(() => dialogService.closeAll())
  //     .then(() => {
  //       fail('".closeAll" had to fail.');
  //       done();
  //     })
  //     .catch((reason) => {
  //       expect(reason).toBe(expecterError);
  //       expect(dialogService.controllers.length).toBe(1);
  //       done();
  //     });
  // });

  // it('".closeAll" method returns the controllers whose close operation was cancelled', function (done) {
  //   const vms = [
  //     new TestElement(),
  //     new TestElement(),
  //     new TestElement()
  //   ];
  //   vms[1].canDeactivate = () => { return false; }
  //   Promise.all(vms.map((vm) => dialogService.open({ viewModel: vm, yieldController: true })))
  //     .then(() => dialogService.closeAll())
  //     .then((failedToClose) => {
  //       expect(failedToClose.length).toBe(1);
  //       done();
  //     })
  //     .catch((reason) => {
  //       fail(reason);
  //       done();
  //     });
  // });
});
