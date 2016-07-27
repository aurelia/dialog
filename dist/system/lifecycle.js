'use strict';

System.register([], function (_export, _context) {
  "use strict";

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

  _export('invokeLifecycle', invokeLifecycle);

  return {
    setters: [],
    execute: function () {}
  };
});