import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../authSlice";
const USER_API =
  import.meta.VITE_USER_API || "http://localhost:3000/api/v1/user/";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: USER_API, credentials: "include" }),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (inputData) => ({
        url: "register",
        method: "POST",
        body: inputData,
      }),
    }),

    loginUser: builder.mutation({
      query: (inputData) => ({
        url: "login",
        method: "POST",
        body: inputData,
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(userLoggedIn({ user: result.data.user }));
        } catch (error) {
          console.log("loginUser error", error);
        }
      },
    }),

    logOutUser: builder.mutation({
      query: () => ({
        url: "logout",
        method: "GET",
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          dispatch(userLoggedOut());
        } catch (error) {
          console.log("logout error", error);
        }
      },
    }),

    getAllUser: builder.mutation({
      query: () => ({
        url: "get-all-users",
        method: "GET",
      }),
    }),

    getCurrentUserProfile: builder.query({
      query: () => ({
        url: "userbyid",
        method: "GET",
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(userLoggedIn({ user: result.data.user }));
        } catch (error) {
          console.log(error);
        }
      },
    }),

    updateProfile: builder.mutation({
      query: (formData) => ({
        url: "update-user",
        method: "PUT",
        body: formData,
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogOutUserMutation,
  useGetAllUserMutation,
  useGetCurrentUserProfileQuery,
  useUpdateProfileMutation,
} = authApi;
