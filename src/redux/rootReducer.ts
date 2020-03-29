import { combineReducers } from "@reduxjs/toolkit";

import videoReducer from "./slices/video";

const rootReducer = combineReducers({ video: videoReducer });

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
