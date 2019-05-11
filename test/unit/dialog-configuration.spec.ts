import { Container } from 'aurelia-dependency-injection';
import { FrameworkConfiguration } from 'aurelia-framework';
import { DOM } from 'aurelia-pal';
import { DialogConfiguration, Renderer } from '../../src/aurelia-dialog';
import { DefaultDialogSettings } from '../../src/dialog-settings';
import { DialogRenderer } from '../../src/renderers/ux-dialog-renderer';
import { UxDialog } from '../../src/resources/ux-dialog';
import { UxDialogHeader } from '../../src/resources/ux-dialog-header';
import { UxDialogBody } from '../../src/resources/ux-dialog-body';
import { UxDialogFooter } from '../../src/resources/ux-dialog-footer';
import { AttachFocus } from '../../src/resources/attach-focus';

describe('DialogConfiguration', () => {
  const frameworkConfig: FrameworkConfiguration = {
    container: new Container(),
    globalResources: () => { return; },
    transient: () => { return; }
  } as any;
  let configuration: DialogConfiguration;
  let applyConfig: () => Promise<void>;
  const applySetterSpy = jasmine.createSpy('applySetter')
    .and
    .callFake((apply: () => Promise<void>) => { applyConfig = apply; });

  async function whenConfigured(configuration: () => (void | Promise<void>), done: DoneFn): Promise<void> {
    try {
      await configuration();
    } catch (e) {
      done.fail(e);
    }
  }

  beforeEach(() => {
    frameworkConfig.container.unregister(DefaultDialogSettings);
    configuration = new DialogConfiguration(frameworkConfig, applySetterSpy);
  });

  describe('when instantiated', () => {
    it('should get the default settings from the container', () => {
      spyOn(frameworkConfig.container, 'get').and.callThrough();
      // tslint:disable-next-line:no-unused-expression
      new DialogConfiguration(frameworkConfig, () => { return; });
      expect(frameworkConfig.container.get).toHaveBeenCalledWith(DefaultDialogSettings);
    });
  });

  describe('even when ".useDefaults" is not called', () => {
    it('a default Renderer should be registered', async done => {
      let applyConfig: () => void | Promise<void> = null as any;
      // tslint:disable-next-line:no-unused-expression
      new DialogConfiguration(frameworkConfig, apply => { applyConfig = apply; });
      spyOn(frameworkConfig, 'transient');
      await whenConfigured(applyConfig, done);
      expect(frameworkConfig.transient).toHaveBeenCalledWith(Renderer, DialogRenderer);
      done();
    });

    it('the default css styles should be applied', async done => {
      let applyConfig: () => void | Promise<void> = null as any;
      // tslint:disable-next-line:no-unused-expression
      new DialogConfiguration(frameworkConfig, apply => { applyConfig = apply; });
      spyOn(DOM, 'injectStyles');
      await whenConfigured(applyConfig, done);
      expect(DOM.injectStyles).toHaveBeenCalledWith(jasmine.any(String));
      done();
    });
  });

  describe('useRenderer', () => {
    it('should register a renderer as a transient', async done => {
      const renderer = {} as any;
      spyOn(frameworkConfig, 'transient');
      configuration.useRenderer(renderer);
      await whenConfigured(applyConfig, done);
      expect(frameworkConfig.transient).toHaveBeenCalledWith(Renderer, renderer);
      done();
    });

    it('should export settings', async done => {
      const first = 'first';
      const second = 'second';
      configuration.useRenderer({} as any, { first, second });
      await whenConfigured(applyConfig, done);
      expect(configuration.settings[first]).toBe(first);
      expect(configuration.settings[second]).toBe(second);
      done();
    });
  });

  describe('useResource', () => {
    it('should call globalResources', async done => {
      spyOn(frameworkConfig, 'globalResources');
      configuration.useResource('ux-dialog');
      await whenConfigured(applyConfig, done);
      expect(frameworkConfig.globalResources).toHaveBeenCalledWith(jasmine.arrayContaining([UxDialog]));
      done();
    });
  });

  describe('useStandardResources', () => {
    it('should register all standard resources as global', async done => {
      spyOn(frameworkConfig, 'globalResources');
      configuration.useStandardResources();
      await whenConfigured(applyConfig, done);
      const expectedContents = [
        UxDialog,
        UxDialogHeader,
        UxDialogBody,
        UxDialogFooter,
        AttachFocus
      ];
      expect(frameworkConfig.globalResources).toHaveBeenCalledWith(jasmine.arrayContaining(expectedContents));
      done();
    });
  });

  describe('useDefaults', () => {
    it('should call useRenderer with the default renderer', async done => {
      spyOn(configuration, 'useRenderer').and.callThrough();
      spyOn(configuration, 'useResource').and.callThrough();
      configuration.useDefaults();
      await whenConfigured(applyConfig, done);
      expect(configuration.useRenderer).toHaveBeenCalledWith(DialogRenderer);
      expect(configuration.useResource).toHaveBeenCalledWith('ux-dialog');
      expect(configuration.useResource).toHaveBeenCalledWith('ux-dialog-header');
      expect(configuration.useResource).toHaveBeenCalledWith('ux-dialog-footer');
      expect(configuration.useResource).toHaveBeenCalledWith('ux-dialog-body');
      expect(configuration.useResource).toHaveBeenCalledWith('attach-focus');
      done();
    });

    it('should inject default style', async done => {
      spyOn(DOM, 'injectStyles').and.callThrough();
      configuration.useDefaults();
      await whenConfigured(applyConfig, done);
      expect((DOM.injectStyles as jasmine.Spy).calls.any()).toEqual(true);
      done();
    });
  });

  describe('useCSS', () => {
    describe('should skip injecting', () => {
      it('undefined css', async done => {
        spyOn(DOM, 'injectStyles').and.callThrough();
        configuration.useCSS(undefined as any);
        await whenConfigured(applyConfig, done);
        expect((DOM.injectStyles as jasmine.Spy).calls.any()).toEqual(false);
        done();
      });

      it('null css', async done => {
        spyOn(DOM, 'injectStyles').and.callThrough();
        configuration.useCSS(null as any);
        await whenConfigured(applyConfig, done);
        expect((DOM.injectStyles as jasmine.Spy).calls.any()).toEqual(false);
        done();
      });

      it('empty string', async done => {
        spyOn(DOM, 'injectStyles').and.callThrough();
        configuration.useCSS('');
        await whenConfigured(applyConfig, done);
        expect((DOM.injectStyles as jasmine.Spy).calls.any()).toEqual(false);
        done();
      });
    });
  });
});
