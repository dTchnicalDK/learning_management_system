import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useDeleteLectureMutation,
  useGetCourseByIdQuery,
  usePublishCourseMutation,
} from "@/features/api/courseApi";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import moment from "moment";
import {
  ArrowBigUpDash,
  ArrowDownLeftFromCircleIcon,
  ArrowLeft,
  Delete,
  Edit,
  Loader2,
} from "lucide-react";

const LecturesTable = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { courseId, courseTitleParam } = params;

  const {
    data: courseData,
    isLoading: isCourseLoading,
    error: courseError,
  } = useGetCourseByIdQuery(courseId);

  const [
    deleteLecture,
    {
      data: deletedData,
      isLoading: isDeleting,
      error: deleteError,
      isSuccess: isDeleteSuccess,
    },
  ] = useDeleteLectureMutation();
  const [
    publishCourse,
    { data: publishData, error: publishError, isSuccess: isPublisSuccess },
  ] = usePublishCourseMutation();

  //toasting messages
  useEffect(() => {
    if (courseError) {
      toast.error(courseError.data?.message || "course fetching error error");
    }
    if (deleteError) {
      toast.error(deleteError.data?.message || "lecture delete error");
    }
    if (publishError) {
      toast.error(publishError.data?.message || "course publish error");
    }
    if (isDeleteSuccess) {
      toast.success(deletedData.data?.message || "lecture delete success");
    }
    if (isPublisSuccess) {
      toast.success(publishData.message || "couse publish success");
    }
    // console.log("courseData", courseData);
  }, [
    // isSuccess,
    // error,
    isDeleteSuccess,
    deleteError,
    publishError,
    isPublisSuccess,
  ]);

  ///deleting lecture
  const hadleLectureDelete = async (e) => {
    const { courseId, lectureId } = e;
    await deleteLecture({ courseId, lectureId });
  };

  //publishing course/ unpublishing course
  const handlePublish = async (status) => {
    if (courseData.course.lectures.length <= 0) {
      return toast.error("Add lecture first!");
    }
    await publishCourse({ courseId, status });
  };

  if (isCourseLoading) {
    return <Loader2 className=" size-20 margin-auto animate-spin " />;
  }

  return (
    <div className="w-full flex flex-col space-y-5">
      <div className="flex justify-between gap-2">
        <h1 className="text-2xl font-bold text-center">
          Course:{" "}
          <span className="uppercase, italic ">" {courseTitleParam} "</span>
          lectures
        </h1>
        <div className="flex gap-3">
          {courseData && courseData?.course.isPublished ? (
            <Button
              disabled={isCourseLoading}
              onClick={() => handlePublish("unpublish")}
              className="cursor-pointer max-w-xs bg-red-600 dark:bg-red-900 hover:bg-red-700 dark:hover:bg-red-950 text-lg text-red-50"
            >
              <ArrowDownLeftFromCircleIcon />
              unpublish
            </Button>
          ) : (
            <Button
              onClick={() => handlePublish("publish")}
              disabled={isCourseLoading}
              // disabled={data.lectures.length <= 0}
              varient="outline"
              className="cursor-pointer max-w-xs bg-green-600 dark:bg-green-900 hover:bg-green-700 dark:hover:bg-green-950 text-lg text-red-50"
            >
              <ArrowBigUpDash /> Publish Course
            </Button>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={() => {
            navigate(
              `/tutor/course/${params.courseId}/${params.courseTitleParam}/lecture/create`
            );
          }}
          className="cursor-pointer max-w-xs bg-blue-600 dark:bg-blue-900 hover:bg-blue-700 dark:hover:bg-blue-950 text-lg text-blue-50"
        >
          + Add Lecture
        </Button>

        <Button
          onClick={() => {
            navigate(`/tutor/courses-table`);
          }}
          className="cursor-pointer max-w-xs bg-red-600 dark:bg-red-900 hover:bg-red-700 dark:hover:bg-red-950 text-lg text-red-50"
        >
          <ArrowLeft /> Back to Courses
        </Button>
      </div>

      <Table>
        <TableCaption>A list of Letures of this courses.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Sl. No.</TableHead>
            <TableHead>Leture Title</TableHead>
            <TableHead>Video uploaded</TableHead>
            <TableHead>Created on --- Edited on</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {console.log("data", courseData)}
          {courseData &&
            courseData.course.lectures?.map((lecture, index) => {
              return (
                <TableRow key={lecture._id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{`Lecture - ${index + 1}:  ${
                    lecture.lectureTitle
                  }`}</TableCell>
                  <TableCell>
                    {/* <Badge variant="default" className="text-sky-50"> */}
                    {lecture.videoUrl ? (
                      <Badge className="bg-green-500 dark:bg-green-900 dark:text-white">
                        yes ✔
                      </Badge>
                    ) : (
                      <Badge className="bg-red-500 dark:bg-red-900 dark:text-white">
                        No ❌
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {moment(lecture.createdAt).format("DD/MM/YYYY")} --
                    {moment(lecture.editedAt).format("DD/MM/YYYY")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      onClick={() =>
                        navigate(
                          `/tutor/course/${params.courseId}/${params.courseTitleParam}/lecture/${lecture._id}`
                        )
                      }
                      variant="ghost"
                      className="cursor-pointer hover:text-sky-500 hover:shadow-xl"
                    >
                      <Edit />
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      onClick={() =>
                        hadleLectureDelete({
                          lectureId: lecture._id,
                          courseId: params.courseId,
                        })
                      }
                      variant="ghost"
                      className="cursor-pointer hover:text-sky-500 hover:shadow-xl"
                    >
                      <Delete />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
};

export default LecturesTable;
