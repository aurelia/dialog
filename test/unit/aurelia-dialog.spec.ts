import { Container } from 'aurelia-dependency-injection';
import { FrameworkConfiguration } from 'aurelia-framework';
import { configure } from '../../src/aurelia-dialog';
import { DialogConfiguration } from '../../src/dialog-configuration';

describe('testing aurelia configure routine', () => {
  const frameworkConfig: FrameworkConfiguration = {
    container: new Container(),
    globalResources() { return; },
    transient() { return; }
  } as any;

  it('should export configure function', () => {
    expect(typeof configure).toBe('function');
  });

  it('should accept a setup callback and call it', () => {
    const setupCallback = jasmine.createSpy('setupCallback');
    configure(frameworkConfig, setupCallback);
    expect(setupCallback).toHaveBeenCalled();
  });

  it('should pass to the setup callback a "DailogConfiguration" object', () => {
    configure(frameworkConfig as any, (config: any) => {
      expect(config instanceof DialogConfiguration).toBe(true);
    });
  });

  it('should apply the defaults when no setup callback is supplied', () => {
    spyOn(DialogConfiguration.prototype, 'useDefaults').and.callThrough();
    configure(frameworkConfig as any);
    expect(DialogConfiguration.prototype.useDefaults).toHaveBeenCalled();
  });

  it('should apply the configurations when setup callback is provided', () => {
    spyOn(DialogConfiguration.prototype as any, '_apply');
    configure(frameworkConfig, () => { return; });
    expect((DialogConfiguration.prototype as any)._apply).toHaveBeenCalled();
  });

  it('should apply the configurations when no setup callback is provided', () => {
    spyOn(DialogConfiguration.prototype as any, '_apply');
    configure(frameworkConfig);
    expect((DialogConfiguration.prototype as any)._apply).toHaveBeenCalled();
  });
});
