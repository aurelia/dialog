import {invokeLifecycle} from '../../src/lifecycle';

describe('invokeLifecycle', () => {
  const DEFAULT_LEFECYCLE_RESULT = true;
  const TEST_METHOD_NAME = 'canActivate';
  const vm: any = { [TEST_METHOD_NAME]() { return this.output; } };

  describe('resolves', () => {
    // tslint:disable-next-line:max-line-length
    async function testResult(done: DoneFn, output: any, expected: any = DEFAULT_LEFECYCLE_RESULT, methodName: 'canActivate' | 'canDeactivate' | 'deactivate' = TEST_METHOD_NAME): Promise<void> {
      let result: any;
      vm.output = output;
      try {
        result = await invokeLifecycle(vm, methodName);
      } catch (e) {
        return done.fail(e);
      }
      expect(result).toBe(expected);
      done();
    }

    beforeEach(() => {
      delete vm.output;
    });

    describe('with the default value when the method', () => {
      it('is not implemented', done => {
        testResult(done, undefined, DEFAULT_LEFECYCLE_RESULT, 'deactivate');
      });

      describe('returns', () => {
        it('"undefined"', done => {
          testResult(done, undefined);
        });

        it('"null"', done => {
          testResult(done, null);
        });
      });

      describe('resolves to', () => {
        it('"undefined"', done => {
          testResult(done, Promise.resolve(undefined));
        });

        it('"null"', done => {
          testResult(done, Promise.resolve(null));
        });
      });
    });

    it('with the returned value', done => {
      const expected = 'method_returned_value';
      testResult(done, expected, expected);
    });

    it('with the resolved value', done => {
      const expected = 'method_resolved_value';
      testResult(done, Promise.resolve(expected), expected);
    });
  });

  describe('propagates errors when the method', () => {
    // tslint:disable-next-line:space-before-function-paren
    async function testForRejection(done: DoneFn, expected: any): Promise<void> {
      try {
        await invokeLifecycle(vm, TEST_METHOD_NAME);
        done.fail('Expected rejection.');
      } catch (e) {
        expect(e).toBe(expected);
        done();
      }
    }

    it('throws', done => {
      const expectedError = new Error('sync_error');
      spyOn(vm, TEST_METHOD_NAME).and.callFake(() => { throw expectedError; });
      testForRejection(done, expectedError);
    });

    it('is rejected', done => {
      const expectedError = new Error();
      spyOn(vm, TEST_METHOD_NAME).and.returnValue(Promise.reject(expectedError));
      testForRejection(done, expectedError);
    });

  });

  it('invokes the method with the povided model', async done => {
    const expectedModel = { test: 'test model' };
    spyOn(vm, TEST_METHOD_NAME);
    try {
      await invokeLifecycle(vm, TEST_METHOD_NAME, expectedModel);
    } catch (e) {
      return done.fail(e);
    }
    expect(vm[TEST_METHOD_NAME]).toHaveBeenCalledWith(expectedModel);
    done();
  });
});
