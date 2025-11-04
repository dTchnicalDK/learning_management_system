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
import { useGetCourseLecturesQuery } from "@/features/api/courseApi";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import moment from "moment";
import { ArrowLeft, Edit } from "lucide-react";

const LecturesTable = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { courseId } = params;

  const { data, error, isLoading, isSuccess } =
    useGetCourseLecturesQuery(courseId);

  //toasting messages
  useEffect(() => {
    if (error) {
      toast.error(error.data?.message || "course fetching error error");
    }
    // if (data) {
    //   console.log("lectures", data);
    // }
  }, [isSuccess, error]);
  if (isLoading) {
    return <h1>loading...</h1>;
  }

  return (
    <div className="w-full flex flex-col space-y-5">
      <h1 className="text-2xl font-bold text-center">
        Your course contains the following lectures
      </h1>

      <div className="flex gap-3">
        <Button
          onClick={() => {
            navigate(`/tutor/course/${params.courseId}/lecture/create`);
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
            <TableHead>status</TableHead>
            <TableHead>Created on --- Edited on</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data &&
            data.lectures.map((lecture, index) => {
              return (
                <TableRow key={lecture._id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{`Lecture - ${index + 1}:  ${
                    lecture.lectureTitle
                  }`}</TableCell>
                  <TableCell>
                    <Badge variant="default" className="text-sky-50">
                      {lecture.courseStatus ? <>Published</> : <>Draft</>}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {moment(lecture.createdAt).format("DD/MM/YYYY")} --
                    {moment(lecture.editedAt).format("DD/MM/YYYY")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      onClick={() =>
                        navigate(
                          `/tutor/course/${params.courseId}/lecture/${lecture._id}`
                        )
                      }
                      variant="ghost"
                      className="cursor-pointer hover:text-sky-500 hover:shadow-xl"
                    >
                      <Edit />
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
