import {DialogConfiguration} from '../../src/dialog-configuration';
import {dialogOptions} from '../../src/dialog-options';
import {DialogRenderer} from '../../src/renderers/dialog-renderer';
import {initialize} from 'aurelia-pal-browser';
import {Renderer} from '../../src/renderers/renderer';

initialize();

let defaultDialogOptions = Object.assign({}, dialogOptions);

let aurelia = {
  globalResources: () => {},
  singleton: () => {}
};

describe('DialogConfiguration', () => {
  let configuration;
  beforeEach(() => {
    initialize();

    configuration = new DialogConfiguration(aurelia);

    Object.keys(dialogOptions).forEach((key) => {
      delete dialogOptions[key];
    });

    Object.assign(dialogOptions, defaultDialogOptions);
  });

  describe('useRenderer', () => {
    it('should register a renderer as a singleton', () => {
      let renderer = {};
      spyOn(aurelia, 'singleton');
      configuration.useRenderer(renderer);
      expect(aurelia.singleton).toHaveBeenCalledWith(Renderer, renderer);
    });

    it('should export settings', () => {
      let renderer = {};
      let settings = { first: 'first', second: 'second' };
      configuration.useRenderer(renderer, settings);
      expect(dialogOptions.first).toBe(settings.first);
      expect(dialogOptions.second).toBe(settings.second);
    });
  });

  describe('useResource', () => {
    it('should call globalResources', () => {
      spyOn(aurelia, 'globalResources');
      configuration.useResource('ai-dialog');
      expect(aurelia.globalResources).toHaveBeenCalled();
    });
  });

  describe('useDefaults', () => {
    it('should call useRenderer with the default renderer', () => {
      spyOn(configuration, 'useRenderer').and.callThrough();
      spyOn(configuration, 'useResource').and.callThrough();

      configuration.useDefaults();
      expect(configuration.useRenderer).toHaveBeenCalledWith(DialogRenderer);
      expect(configuration.useResource).toHaveBeenCalledWith('ai-dialog');
      expect(configuration.useResource).toHaveBeenCalledWith('ai-dialog-header');
      expect(configuration.useResource).toHaveBeenCalledWith('ai-dialog-footer');
      expect(configuration.useResource).toHaveBeenCalledWith('ai-dialog-body');
      expect(configuration.useResource).toHaveBeenCalledWith('attach-focus');
    });
  });
});
