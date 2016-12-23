/**
 * Call a lifecycle method on a viewModel if it exists.
 * @function
 * @param instance The viewModel instance.
 * @param name The lifecycle method name.
 * @param model The model to pass to the lifecycle method.
 * @returns Promise The result of the lifecycle method.
 */
export function invokeLifecycle(instance: any, name: string, model: any) {
  if (typeof instance[name] === 'function') {
    return Promise.resolve().then(() => {
      return instance[name](model);
    }).then(function(result) {
      if (result !== null && result !== undefined) {
        return result;
      }

      return true;
    });
  }

  return Promise.resolve(true);
}
