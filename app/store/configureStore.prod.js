import { applyMiddleware, createStore, compose } from 'redux';
import rootReducer from '../reducers/index';
// import thunk from 'redux-thunk';
import ReduxPromise from 'redux-promise';
// import { storage } from '../utils/localstorage';

const middlewares = applyMiddleware(ReduxPromise);
const enhancer = compose(
  middlewares,
  // storage()
);

export default function (initialState) {
  return createStore(rootReducer, initialState, enhancer);
}
