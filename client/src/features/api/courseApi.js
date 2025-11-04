import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const BASE_URL = import.meta.VITE_BASE_API || "http://localhost:3000/api/v1/";

export const courseApi = createApi({
  reducerPath: "courseApi",
  tagTypes: ["Refetch_Course", "Refresh_Lecture"],
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
    getCourseLectures: builder.query({
      query: (courseId) => ({
        url: `/tutor/course/${courseId}/lectures`,
        method: "GET",
      }),
      providesTags: ["Refresh_Lecture"],
    }),

    getLectureById: builder.query({
      query: (ids) => ({
        url: `/tutor/course/${ids.courseId}/lecture/${ids.lectureId}`,
        method: "GET",
      }),
      providesTags: ["Refetch_Course"],
    }),

    createLecture: builder.mutation({
      query: (reqData) => ({
        url: `/tutor/course/${reqData.courseId}/create-lecture`,
        method: "POST",
        body: reqData,
      }),
      invalidatesTags: ["Refresh_Lecture"],
    }),

    // In your courseApi.js
    updateLecture: builder.mutation({
      query: (formData) => {
        // Extract IDs from the formData
        const { courseId, lectureId, ...bodyData } = formData;

        console.log("RTK Query - IDs:", { courseId, lectureId });
        console.log("RTK Query - Body:", bodyData);

        return {
          url: `/tutor/course/${courseId}/lecture/${lectureId}/edit`,
          method: "PUT",
          body: bodyData, // Only send the lecture data, not the IDs in body
        };
      },
      invalidatesTags: ["Refresh_Lecture"],
    }),
  }),
});

export const {
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useGetAllCoursesQuery,
  useGetCourseByIdQuery,
  useCreateLectureMutation,
  useGetCourseLecturesQuery,
  useGetLectureByIdQuery,
  useUpdateLectureMutation,
} = courseApi;
