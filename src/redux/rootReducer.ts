import { combineReducers } from "@reduxjs/toolkit";

import videoReducer from "./slices/video";
import gameReducer from "./slices/game";

const rootReducer = combineReducers({
  video: videoReducer,
  game: gameReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
