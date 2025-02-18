import {configureStore} from "@reduxjs/toolkit";
import noChatReducer  from "../features/NoChatApp/noChatAppSlice.js";
export const store = configureStore({
    reducer: noChatReducer,
});
