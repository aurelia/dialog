import {Container} from 'aurelia-dependency-injection';
import {FrameworkConfiguration} from 'aurelia-framework';
import {DOM} from 'aurelia-pal';
import {DialogConfiguration, Renderer} from '../../src/aurelia-dialog';
import {DefaultDialogSettings} from '../../src/dialog-settings';
import {DialogRenderer} from '../../src/dialog-renderer';

describe('DialogConfiguration', () => {
  const frameworkConfig: FrameworkConfiguration = {
    container: new Container(),
    globalResources: () => { return; },
    transient: () => { return; }
  } as any;
  let configuration: DialogConfiguration;
  let applyConfig: () => void;
  const applySetterSpy = jasmine.createSpy('applySetter')
    .and
    .callFake((apply: () => void) => { applyConfig = apply; });

  beforeEach(() => {
    frameworkConfig.container.unregister(DefaultDialogSettings);
    configuration = new DialogConfiguration(frameworkConfig, applySetterSpy);
  });

  describe('the constructor', () => {
    it('should get the default settings from the container', () => {
      spyOn(frameworkConfig.container, 'get').and.callThrough();
      // tslint:disable-next-line:no-unused-new
      new DialogConfiguration(frameworkConfig, () => { return; });
      expect(frameworkConfig.container.get).toHaveBeenCalledWith(DefaultDialogSettings);
    });
  });

  describe('useRenderer', () => {
    it('should register a renderer as a transient', () => {
      const renderer = {} as any;
      spyOn(frameworkConfig, 'transient');
      configuration.useRenderer(renderer);
      applyConfig();
      expect(frameworkConfig.transient).toHaveBeenCalledWith(Renderer, renderer);
    });

    it('should export settings', () => {
      const first = 'first';
      const second = 'second';
      configuration.useRenderer({} as any, { first, second });
      applyConfig();
      expect(configuration.settings[first]).toBe(first);
      expect(configuration.settings[second]).toBe(second);
    });
  });

  describe('useResource', () => {
    it('should call globalResources', () => {
      spyOn(frameworkConfig, 'globalResources');
      configuration.useResource('ux-dialog');
      applyConfig();
      expect(frameworkConfig.globalResources).toHaveBeenCalled();
    });
  });

  describe('useDefaults', () => {
    it('should call useRenderer with the default renderer', () => {
      spyOn(configuration, 'useRenderer').and.callThrough();
      spyOn(configuration, 'useResource').and.callThrough();

      configuration.useDefaults();
      applyConfig();
      expect(configuration.useRenderer).toHaveBeenCalledWith(DialogRenderer);
      expect(configuration.useResource).toHaveBeenCalledWith('ux-dialog');
      expect(configuration.useResource).toHaveBeenCalledWith('ux-dialog-header');
      expect(configuration.useResource).toHaveBeenCalledWith('ux-dialog-footer');
      expect(configuration.useResource).toHaveBeenCalledWith('ux-dialog-body');
      expect(configuration.useResource).toHaveBeenCalledWith('attach-focus');
    });

    it('should inject default style', () => {
      spyOn(DOM, 'injectStyles').and.callThrough();

      configuration.useDefaults();
      applyConfig();
      expect((DOM.injectStyles as jasmine.Spy).calls.any()).toEqual(true);
    });
  });

  describe('useCSS', () => {
    describe('should skip injecting', () => {
      it('undefined css', () => {
        spyOn(DOM, 'injectStyles').and.callThrough();

        configuration.useCSS(undefined as any);
        applyConfig();
        expect((DOM.injectStyles as jasmine.Spy).calls.any()).toEqual(false);
      });

      it('null css', () => {
        spyOn(DOM, 'injectStyles').and.callThrough();

        configuration.useCSS(null as any);
        applyConfig();
        expect((DOM.injectStyles as jasmine.Spy).calls.any()).toEqual(false);
      });

      it('empty string', () => {
        spyOn(DOM, 'injectStyles').and.callThrough();

        configuration.useCSS('');
        applyConfig();
        expect((DOM.injectStyles as jasmine.Spy).calls.any()).toEqual(false);
      });
    });
  });
});
