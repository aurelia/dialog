import {invokeLifecycle} from '../../src/lifecycle';

describe('".invokeLifecycle()"', function () {
  function failOnRejection(promise, done) {
    promise.catch((reason) => {
      fail(reason);
      done();
    });
  }

  const CAN_ACTIVATE = 'canActivate';
  const ACTIVATE = 'activate';
  const CAN_DEACTIVATE = 'canDeactivate';
  const DEACTIVATE = 'deactivate';
  const DEFAULT_LEFECYCLE_RESULT = true;

  describe('resolves with default value if there is', function () {
    const vm = {};

    it(`no "canActivate" method implemented`, function (done) {
      const result = invokeLifecycle(vm, CAN_ACTIVATE).then((result) => {
        expect(result).toBe(DEFAULT_LEFECYCLE_RESULT);
        done();
      });
      failOnRejection(result, done);
    });

    it('no "canDeactivate" method implemented', function (done) {
      const result = invokeLifecycle(vm, CAN_DEACTIVATE).then((result) => {
        expect(result).toBe(DEFAULT_LEFECYCLE_RESULT);
        done();
      });
      failOnRejection(result, done);
    });

    it('no "deactivate" method implemented', function (done) {
      const result = invokeLifecycle(vm, DEACTIVATE).then((result) => {
        expect(result).toBe(DEFAULT_LEFECYCLE_RESULT);
        done();
      });
      failOnRejection(result, done);
    });
  });

  describe('applies the same default value for sync and async implementation', function () {
    const syncVM = {
      [CAN_ACTIVATE]: Function.prototype,
      [ACTIVATE]: Function.prototype,
      [CAN_DEACTIVATE]: Function.prototype,
      [DEACTIVATE]: Function.prototype
    };
    const asyncFunc = function () { return Promise.resolve(); }
    const asyncVM = {
      [CAN_ACTIVATE]: asyncFunc,
      [ACTIVATE]: asyncFunc,
      [CAN_DEACTIVATE]: asyncFunc,
      [DEACTIVATE]: asyncFunc
    };

    it('of "canActivate"', function (done) {
      const result = Promise.all([invokeLifecycle(syncVM, CAN_ACTIVATE), invokeLifecycle(asyncVM, CAN_ACTIVATE)])
        .then(([syncResult, asyncResult]) => {
          expect(syncResult).toBe(asyncResult);
          done();
        });
      failOnRejection(result, done);
    });

    it('of "canDeactivate"', function (done) {
      const result = Promise.all([invokeLifecycle(syncVM, CAN_DEACTIVATE), invokeLifecycle(asyncVM, CAN_DEACTIVATE)])
        .then(([syncResult, asyncResult]) => {
          expect(syncResult).toBe(asyncResult);
          done();
        });
      failOnRejection(result, done);
    });

    it('of "deactivate"', function (done) {
      const result = Promise.all([invokeLifecycle(syncVM, DEACTIVATE), invokeLifecycle(asyncVM, DEACTIVATE)])
        .then(([syncResult, asyncResult]) => {
          expect(syncResult).toBe(asyncResult);
          done();
        });
      failOnRejection(result, done);
    });
  });

  describe('does not resolve with the default value when the result is not "undefined" or "null"', function () {
    it('for sync implementations', function (done) {
      const syncResult = {};
      const syncVM = { [ACTIVATE]: function () { return syncResult; } };
      const result = invokeLifecycle(syncVM, ACTIVATE)
        .then((result) => {
          expect(result).toBe(syncResult);
          done();
        });
      failOnRejection(result, done);
    });

    it('for async implementations', function (done) {
      const asyncResult = {};
      const asyncVM = { [ACTIVATE]: function () { return Promise.resolve(asyncResult); } };
      const result = invokeLifecycle(asyncVM, ACTIVATE)
        .then((result) => {
          expect(result).toBe(asyncResult);
          done();
        });
      failOnRejection(result, done);
    });
  });

  it('propagates errors when the invocation of the specified lifecycle method throws', function (done) {
    const expectedError = new Error();
    const erroneousVM = { [CAN_ACTIVATE]() { throw expectedError; } };
    invokeLifecycle(erroneousVM, CAN_ACTIVATE).catch((e) => e).then((e) => {
      expect(e).toBe(expectedError);
      done();
    });
  });

  it('passes the provided model', function (done) {
    const expectedModel = {};
    const vm = { [CAN_ACTIVATE]() { } };
    spyOn(vm, CAN_ACTIVATE);
    const result = invokeLifecycle(vm, CAN_ACTIVATE, expectedModel)
      .then(() => {
        expect(vm[CAN_ACTIVATE]).toHaveBeenCalledWith(expectedModel);
        done();
      });
    failOnRejection(result, done);
  });
});
