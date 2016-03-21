import {isArray} from 'lodash';

/**
 * This is a reducer that can wrap another reducer.
 * It will output the state as an object with failed, success & loading booleans.
 * It expects to be given actions created by the `./PromiseActionCreator`.
 * It will output the content of the parent reducer under the data property in the state.
 *
 * @param {{request: [string|[string]], success: [string|[string]], error: [string|[string]]}} actions
 * @param {object} options
 * @param {Function} [options.augmentState] - When a function of the reducer interface is passed it will trigger it for every action type that has been configured.
 **/

function buildActionTypes(types) {
  if (!types) return [];
  if (isArray(types)) return types
  else return [types];
}

export default function promiseActionReducer(actions, options = {}) {

  actions.request = buildActionTypes(actions.request);
  actions.success = buildActionTypes(actions.success);
  actions.error = buildActionTypes(actions.error);

  const augmentState = function (state, action) {
    if (!options.augmentState || typeof options.augmentState !== 'function') {
      return state;
    }

    return options.augmentState(state, action);
  };

  /**
   * Function to be executed with the reducer to wrap.
   **/
  return (innerReducer) => {
    /**
     * @param {Object} state
     * @param {{type: string}} action
     **/
    return (state = {}, action) => {
      if (actions.request.includes(action.type)) {
        state = Object.assign({}, state, { failed: false, success: false, loading: true });
        state = augmentState(state, action);
        return state;
      }

      if (actions.success.includes(action.type)) {
        state = Object.assign({}, state, {
          failed: false,
          success: true,
          loading: false,
          data: innerReducer(state.data, action)
        });
        state = augmentState(state, action);
        return state;
      }

      if (actions.error.includes(action.type)) {
        state = Object.assign({}, state, { failed: true, success: false, loading: false });
        state.data = undefined;
        state = augmentState(state, action);
        return state;
      }

      return state;
    }
  }
}


