/**
 * Created by mobinni on 12/01/16.
 */
import ModuleCollector from './modules/moduleCollector';
import storeBuilder from './store/storeBuilder';
import feed from './modules/feed';
import thunk from 'redux-thunk';

export function initialise(customMiddlewares = []) {
  const moduleCollector = new ModuleCollector();
  moduleCollector.add(feed);

  const coreReducers = moduleCollector.getReducers();
  customMiddlewares.push(thunk);
  const {store, middlewares} = storeBuilder(
    coreReducers,
    customMiddlewares
  );

  const modules = moduleCollector.get();

  return {store, modules, middlewares};
}

export default {
  initialise
}