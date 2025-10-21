import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const BASE_URL = import.meta.VITE_BASE_API || "http://localhost:3000/api/v1/";

export const courseApi = createApi({
  reducerPath: "courseApi",
  tagTypes: ["Refetch_Course"],
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL, credentials: "include" }),

  endpoints: (builder) => ({
    createCourse: builder.mutation({
      query: (formData) => ({
        url: "/tutor/course/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Refetch_Course"],
    }),

    getAllCourses: builder.query({
      query: () => ({
        url: "/tutor/course",
        method: "GET",
      }),
      providesTags: ["Refetch_Course"],
    }),

    updateCourse: builder.mutation({
      query: (formData) => ({
        url: "/tutor/course/edit",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Refetch_Course"],
    }),

    getCourseById: builder.query({
      query: (courseId) => ({
        url: `/tutor/course/${courseId}`,
        method: "GET",
      }),
      providesTags: ["Refetch_Course"],
    }),

    ///lecture api////
    createLecture: builder.mutation({
      query: (courseId) => ({
        url: `/tutor/course/${courseId}/create-lecture`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useGetAllCoursesQuery,
  useGetCourseByIdQuery,
} = courseApi;
