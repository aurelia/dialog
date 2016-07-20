import {DialogConfiguration} from '../../src/dialog-configuration';
import {dialogOptions} from '../../src/dialog-options';
import {DialogRenderer} from '../../src/dialog-renderer';
import {Renderer} from '../../src/renderer';
import {DOM} from 'aurelia-pal';

let defaultDialogOptions = Object.assign({}, dialogOptions);

let aurelia = {
  globalResources: () => {},
  transient: () => {}
};

describe('DialogConfiguration', () => {
  let configuration;
  beforeEach(() => {
    configuration = new DialogConfiguration(aurelia);

    Object.keys(dialogOptions).forEach((key) => {
      delete dialogOptions[key];
    });

    Object.assign(dialogOptions, defaultDialogOptions);
  });

  describe('useRenderer', () => {
    it('should register a renderer as a transient', () => {
      let renderer = {};
      spyOn(aurelia, 'transient');
      configuration.useRenderer(renderer);
      configuration._apply();
      expect(aurelia.transient).toHaveBeenCalledWith(Renderer, renderer);
    });

    it('should export settings', () => {
      let renderer = {};
      let settings = { first: 'first', second: 'second' };
      configuration.useRenderer(renderer, settings);
      configuration._apply();
      expect(dialogOptions.first).toBe(settings.first);
      expect(dialogOptions.second).toBe(settings.second);
    });
  });

  describe('useResource', () => {
    it('should call globalResources', () => {
      spyOn(aurelia, 'globalResources');
      configuration.useResource('ai-dialog');
      configuration._apply();
      expect(aurelia.globalResources).toHaveBeenCalled();
    });
  });

  describe('useDefaults', () => {
    it('should call useRenderer with the default renderer', () => {
      spyOn(configuration, 'useRenderer').and.callThrough();
      spyOn(configuration, 'useResource').and.callThrough();

      configuration.useDefaults();
      configuration._apply();
      expect(configuration.useRenderer).toHaveBeenCalledWith(DialogRenderer);
      expect(configuration.useResource).toHaveBeenCalledWith('ai-dialog');
      expect(configuration.useResource).toHaveBeenCalledWith('ai-dialog-header');
      expect(configuration.useResource).toHaveBeenCalledWith('ai-dialog-footer');
      expect(configuration.useResource).toHaveBeenCalledWith('ai-dialog-body');
      expect(configuration.useResource).toHaveBeenCalledWith('attach-focus');
    });
    
    it('should inject default style', () => {
      spyOn(DOM, 'injectStyles').and.callThrough();
      
      configuration.useDefaults();
      configuration._apply();
      expect(DOM.injectStyles.calls.any()).toEqual(true);
    });
  });
  
  describe('useCSS', () => {
    it('should skip injecting empty style', () => {
      spyOn(DOM, 'injectStyles').and.callThrough();
      
      // Undefined css
      configuration.useCSS(undefined);
      configuration._apply();
      expect(DOM.injectStyles.calls.any()).toEqual(false);
      
      // Null css
      configuration.useCSS(null);
      configuration._apply();
      expect(DOM.injectStyles.calls.any()).toEqual(false);
      
      // Empty string
      configuration.useCSS('');
      configuration._apply();
      expect(DOM.injectStyles.calls.any()).toEqual(false);
    });
  });
});
