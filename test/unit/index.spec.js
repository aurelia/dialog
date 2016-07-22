import {configure} from '../../src/aurelia-dialog';

describe('testing aurelia configure routine', () => {
  let frameworkConfig = {
    globalResources: () => { },
    container: {
      registerInstance: (Type, callback) => { },
      get: (type) => { return new Type(); }
    },
    transient: () => {}
  };

  it('should export configure function', () => {
    expect(typeof configure).toBe('function');
  });

  it('should accept a setup callback passing back the callback', (done) => {
    let callback = (callbackObj) => {
      expect(typeof callbackObj).toBe('object');
      done();
    };
    configure(frameworkConfig, callback);
  });

  it('should accept no callback and not fail', () => {
    configure(frameworkConfig);
  });
});
