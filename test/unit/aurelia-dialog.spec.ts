import '../setup';
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
  let userDefaultsSpy: jasmine.Spy;
  let applySpy: jasmine.Spy;

  beforeEach(() => {
    userDefaultsSpy = spyOn(DialogConfiguration.prototype, 'useDefaults').and.callThrough();
    applySpy = spyOn(DialogConfiguration.prototype as any, '_apply');
  });

  afterEach(() => {
    userDefaultsSpy.calls.reset();
    applySpy.calls.reset();
  });

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
    configure(frameworkConfig as any);
    expect(userDefaultsSpy).toHaveBeenCalled();
  });

  it('should apply the configurations when setup callback is provided', () => {
    configure(frameworkConfig, () => { return; });
    expect(applySpy).toHaveBeenCalled();
  });

  it('should apply the configurations when no setup callback is provided', () => {
    configure(frameworkConfig);
    expect(applySpy).toHaveBeenCalled();
  });
});
