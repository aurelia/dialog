export type LifecycleMethodName = 'canActivate' | 'activate' | 'canDeactivate' | 'deactivate';

/**
 * Call a lifecycle method on a viewModel if it exists.
 * @function
 * @param instance The viewModel instance.
 * @param name The lifecycle method name.
 * @param model The model to pass to the lifecycle method.
 * @returns Promise The result of the lifecycle method.
 */
export function invokeLifecycle(instance: any, name: LifecycleMethodName, model?: any): Promise<any> {
  if (typeof instance[name] === 'function') {
    return new Promise(resolve => {
        resolve(instance[name](model));
    }).then(result => {
      if (result !== null && result !== undefined) {
        return result;
      }
      return true;
    });
  }
  return Promise.resolve(true);
}
