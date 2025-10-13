import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import { authApi } from "@/features/api/authApi";
import { courseApi } from "@/features/api/courseApi";

export const store = configureStore({
  reducer: rootReducer,

  middleware: (defaultMiddleware) =>
    defaultMiddleware().concat(authApi.middleware, courseApi.middleware),
});

// const initializeApp = async () => {
//     await appStore.dispatch(authApi.endpoints.loadUser.initiate({},{forceRefetch:true}))
// }
const initializeApp = async () => {
  await store.dispatch(
    authApi.endpoints.getCurrentUserProfile.initiate({}, { forceRefetch: true })
  );
};
initializeApp();
