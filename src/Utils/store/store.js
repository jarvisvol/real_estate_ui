import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";

const store = configureStore({
    reducer: rootReducer,
    serializableCheck: {
        ignoredActions: ['*'],
      },
})

export default store