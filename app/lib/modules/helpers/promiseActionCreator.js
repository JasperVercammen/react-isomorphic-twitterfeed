import syncActionCreator from './syncActionCreator';
import {set as setAttribute} from 'lodash';

const defaultOptions = {actionAttributeNames: [], forceExecute: false};

/**
 *
 * @param {object} object
 * @param {[string]} paths
 * @param {Array} args
 *
 * @note: DESTRUCTIVE
 *
 * @private
 **/
function extendObject(object, paths, args) {
  if (args && args.length && paths && paths.length) {
    args.forEach(function(arg, i) {
      setAttribute(object, paths[i], arg);
    });
  }
}

/**
 * Wraps an actionCreator invocation and extends the returned action with the extra parameters provided.
 *
 * @example
 *   const myExtendedActionCreator = createActionExtender(syncActionCreator('IDENTIFY_ACTION', 'name'), 1, ['options.age', 'verified'])
 *   const result = myExtendedActionCreator('vincent', 31, true)
 *   // will result in {name: 'vincent', options: {age: 31}, verified: true}}
 *
 * @param {function} actionCreator
 * @param {Number} reservedLength - The amount of attributes that the original actionCreator will handle.
 * @param {[string]} [actionAttributeNames]
 * @returns {Function}
 */
function createActionExtender(actionCreator, reservedLength, actionAttributeNames) {
  return function(...args) {
    // Fetch the arguments that are originally meant to be handled by the actionCreator.
    const argsForActionCreator = args.slice(0, reservedLength);
    // Build up the action with the actionCreator.
    const action = actionCreator(...argsForActionCreator);

    if (actionAttributeNames && actionAttributeNames.length) {
      // Extend the action with extra attributes.
      extendObject(action, actionAttributeNames, args.slice(reservedLength));
    }

    return action;
  }
}

// @TODO: Cleaner mechanism to pass the constants.
// It's done via a name now and the logic is baked inside this file. Should be split out via a helper class or something so we can use it to pass to promiseActionReducer etc as well.

/**
 * A function that will dispatch multiple actions based on the flow of the promise.
 *
 * @param {function} executePromise - When we execute the returned function this function gets called with the arguments passed to the generated function.
 * @param name
 * @param {{actionAttributeNames: [string]}} options
 * @param [options.actionAttributeNames=[]] - When the generated function is executed with arguments these arguments can optionally be placed under attributes on all actions dispatched by this action.
 * @param [options.forceExecute=false] - When this is true we will never check if the action has already been executed or not.
 * @returns {Function} - A generated function that will execute the promise and dispatch the necessary actions depending on the state of the promise.
 **/
function promiseActionCreator(executePromise, name, options = defaultOptions) {
  options = Object.assign({}, defaultOptions, options);
  name = name.toUpperCase();

  const requestAction = createActionExtender(syncActionCreator(`${name}_REQUEST`, 'promise'), 1, options.actionAttributeNames);
  const loadedAction = createActionExtender(syncActionCreator(`${name}_LOADED`, 'payload'), 1, options.actionAttributeNames);
  const failedAction = createActionExtender(syncActionCreator(`${name}_FAILED`, 'error'), 1, options.actionAttributeNames);

  /**
   * The generated function for the passed configuration.
   * You can call it with the arguments which will get passed to the executePromise function.
   * Those passed arguments will also be placed inside the actions under the actionAttributeNames provided. First attributename will be set to the first argument and so on.
   **/
  return (...args) => {
    return (dispatch, getState, hasAlreadyBeenExecutedCheck, forceCheck) => {
      // Actually execute the promise with the provided arguments.

      const preflightAction = requestAction(undefined, ...args)
      if (forceCheck && hasAlreadyBeenExecutedCheck) {
        if ((!options.forceExecute || forceCheck)
          && hasAlreadyBeenExecutedCheck(preflightAction)) {
          return;
        }
      }

      const executedPromise = executePromise(...args);
      // Make sure we announce the promise to the promiseMiddleware on the promise property.
      dispatch(requestAction(executedPromise, ...args));

      return executedPromise
        .then((data) => {

          dispatch(loadedAction(data, ...args));
        })
        .catch(error => dispatch(failedAction(error, ...args)));
    };
  };
}

export default promiseActionCreator;
