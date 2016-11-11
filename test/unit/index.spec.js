import {configure} from '../../src/aurelia-dialog';

describe('testing aurelia configure routine', function () {
  let frameworkConfig = {
    globalResources: () => { },
    container: {
      registerInstance: (Type, callback) => { },
      get: (type) => { return new Type(); }
    },
    transient: () => {}
  };

  it('should export configure function', function () {
    expect(typeof configure).toBe('function');
  });

  it('should accept a setup callback passing back the callback', function (done) {
    let callback = (callbackObj) => {
      expect(typeof callbackObj).toBe('object');
      done();
    };
    configure(frameworkConfig, callback);
  });

  it('should accept no callback and not fail', function () {
    configure(frameworkConfig);
  });
});
