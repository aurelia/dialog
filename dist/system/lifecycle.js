System.register([], function (_export) {
  'use strict';

  _export('invokeLifecycle', invokeLifecycle);

  function invokeLifecycle(instance, name, model) {
    if (typeof instance[name] === 'function') {
      var result = instance[name](model);

      if (result instanceof Promise) {
        return result;
      }

      if (result !== null && result !== undefined) {
        return Promise.resolve(result);
      }

      return Promise.resolve(true);
    }

    return Promise.resolve(true);
  }

  return {
    setters: [],
    execute: function () {}
  };
});