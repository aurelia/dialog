import {invokeLifecycle} from '../../src/lifecycle';

describe('"invokeLifecycle()"', function () {
  const CAN_ACTIVATE = 'canActivate';
  const ACTIVATE = 'activate';
  const CAN_DEACTIVATE = 'canDeactivate';
  const DEACTIVATE = 'deactivate';
  const DEFAULT_LEFECYCLE_RESULT = true;

  beforeEach(function () {
    this.catchWasCalled = false;
  });

  describe('resolves with default value if there is', function () {
    const vm = {};

    it(`no "canActivate" method implemented`, function (done) {
      invokeLifecycle(vm, CAN_ACTIVATE).catch(() => {
        this.catchWasCalled = true;
      }).then((result) => {
        expect(result).toBe(DEFAULT_LEFECYCLE_RESULT);
        expect(this.catchWasCalled).toBe(false);
        done();
      })
    });

    it('no "activate" method implemented', function (done) {
      invokeLifecycle(vm, ACTIVATE).catch(() => {
        this.catchWasCalled = true;
      }).then((result) => {
        expect(result).toBe(DEFAULT_LEFECYCLE_RESULT);
        expect(this.catchWasCalled).toBe(false);
        done();
      })
    });

    it('no "canDeactivate" method implemented', function (done) {
      invokeLifecycle(vm, CAN_DEACTIVATE).catch(() => {
        this.catchWasCalled = true;
      }).then((result) => {
        expect(result).toBe(DEFAULT_LEFECYCLE_RESULT);
        expect(this.catchWasCalled).toBe(false);
        done();
      })
    });

    it('no "deactivate" method implemented', function (done) {
      invokeLifecycle(vm, DEACTIVATE).catch(() => {
        this.catchWasCalled = true;
      }).then((result) => {
        expect(result).toBe(DEFAULT_LEFECYCLE_RESULT);
        expect(this.catchWasCalled).toBe(false);
        done();
      })
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
      Promise.all([invokeLifecycle(syncVM, CAN_ACTIVATE), invokeLifecycle(asyncVM, CAN_ACTIVATE)]).catch(() => {
        this.catchWasCalled = true;
      }).then(([syncResult, asyncResult]) => {
        expect(this.catchWasCalled).toBe(false);
        expect(syncResult).toBe(asyncResult);
        done();
      });
    });

    it('of "activate"', function (done) {
      Promise.all([invokeLifecycle(syncVM, ACTIVATE), invokeLifecycle(asyncVM, ACTIVATE)]).catch(() => {
        this.catchWasCalled = true;
      }).then(([syncResult, asyncResult]) => {
        expect(this.catchWasCalled).toBe(false);
        expect(syncResult).toBe(asyncResult);
        done();
      });
    });

    it('of "canDeactivate"', function (done) {
      Promise.all([invokeLifecycle(syncVM, CAN_DEACTIVATE), invokeLifecycle(asyncVM, CAN_DEACTIVATE)]).catch(() => {
        this.catchWasCalled = true;
      }).then(([syncResult, asyncResult]) => {
        expect(this.catchWasCalled).toBe(false);
        expect(syncResult).toBe(asyncResult);
        done();
      });
    });

    it('of "deactivate"', function (done) {
      Promise.all([invokeLifecycle(syncVM, DEACTIVATE), invokeLifecycle(asyncVM, DEACTIVATE)]).catch(() => {
        this.catchWasCalled = true;
      }).then(([syncResult, asyncResult]) => {
        expect(this.catchWasCalled).toBe(false);
        expect(syncResult).toBe(asyncResult);
        done();
      });
    });
  });

  describe('does not resolve with the default value when the result is not "undefined" or "null"', function () {
    it('for sync implementations', function (done) {
      const syncResult = {};
      const syncVM = { [ACTIVATE]: function () { return syncResult; } };
      invokeLifecycle(syncVM, ACTIVATE).catch(() => {
        this.catchWasCalled = true;
      }).then((result) => {
        expect(this.catchWasCalled).toBe(false);
        expect(result).toBe(syncResult);
        done();
      });
    });

    it('for async implementations', function (done) {
      const asyncResult = {};
      const asyncVM = { [ACTIVATE]: function () { return Promise.resolve(asyncResult); } };
      invokeLifecycle(asyncVM, ACTIVATE).catch(() => {
        this.catchWasCalled = true;
      }).then((result) => {
        expect(this.catchWasCalled).toBe(false);
        expect(result).toBe(asyncResult);
        done();
      });
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
});
