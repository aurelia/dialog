import {Origin} from 'aurelia-metadata';

/**
* Returns a view model based on a given instruction
*
* @param {Object} instruction the instruction from which the view model is determined
* @return {Promise} the view model
*/
export function getViewModel(instruction: any, compositionEngine: CompositionEngine) {
  if (typeof instruction.viewModel === 'function') {
    instruction.viewModel = Origin.get(instruction.viewModel).moduleId;
  } else if (typeof instruction.viewModel === 'string') {
    return compositionEngine.ensureViewModel(instruction);
  }

  return Promise.resolve(instruction);
}

/**
* Invokes a lifecycle event on a given instance
*
* @param {Object} instance  the instance to invoke the event on
* @param {String} name      the event to invoke
* @param {Object} [model]   the optional model to invoke the event with
* @return {Promise} the result of the invocation
*/
export function invokeLifecycle(instance: any, name: string, model: any) {
  if (typeof instance[name] !== 'function') {
    return Promise.resolve(true);
  }

  let result = instance[name](model);
  if (result instanceof Promise) return result;
  if (result !== null && result !== undefined) {
    return Promise.resolve(result);
  }

  return Promise.resolve(true);
}
