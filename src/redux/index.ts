/* eslint-disable no-underscore-dangle */

import { createStore, applyMiddleware, compose } from "redux";
import rootReducer from "./reducers";

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const composeEnhancers =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;

export default () => {
  const enhancer = composeEnhancers(
    applyMiddleware(/* insert middlewares here */)
  );

  return createStore(rootReducer, enhancer);
};
