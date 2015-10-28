import {configure} from '../../src/index';

describe('testing aurelia configure routine', () => {

  var frameworkConfig = {
    globalResources: () => {

    },
    container: {
      registerInstance: (type, callback) => {

      },
      get: (type) => { return new type(); }
    }
  };

  it('should export configure function', () => {
    expect(typeof configure).toBe('function');
  });

  it('should accept a setup callback passing back the callback', (done) => {
    let callback = (callback) => {
      expect(typeof callback).toBe('object');
      done();
    };
    configure(frameworkConfig, callback);
  });

  it('should accept no callback and not fail', () => {
    configure(frameworkConfig);
  });
});
