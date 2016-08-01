import { applyMiddleware, createStore, compose } from 'redux';
import rootReducer from '../reducers/index';
// import thunk from 'redux-thunk';
import ReduxPromise from 'redux-promise';
// import { storage } from '../utils/localstorage';

// const enhancer = compose(
//   applyMiddleware(thunk),
//   window.devToolsExtension ? window.devToolsExtension() : nope => nope
// );

// const createStoreWithMiddleware = applyMiddleware(ReduxPromise)(createStore);

export default function (initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(ReduxPromise),
      window.devToolsExtension ? window.devToolsExtension() : nope => nope
    )
  );

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers').default;
      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
}
