import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const BASE_URL = import.meta.VITE_BASE_API || "http://localhost:3000/api/v1/";

export const courseApi = createApi({
  reducerPath: "courseApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL, credentials: "include" }),

  endpoints: (builder) => ({
    createCourse: builder.mutation({
      query: (formData) => ({
        url: "/tutor/course/create",
        method: "POST",
        body: formData,
      }),
    }),

    getAllCourses: builder.query({
      query: () => ({
        url: "/tutor/course",
        method: "GET",
      }),
    }),

    updateCourse: builder.mutation({
      query: (formData) => ({
        url: "/tutor/course/edit",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const {
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useGetAllCoursesQuery,
} = courseApi;
