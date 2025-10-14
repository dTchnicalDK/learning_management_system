import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Loader } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useGetAllCoursesQuery } from "@/features/api/courseApi";
import { toast } from "sonner";
import { useNavigate } from "react-router";

const courses = [
  {
    courseTitle: "sample title this is the sample title",
    courseStatus: "draft",
    coursePrice: 200,
  },
  {
    courseTitle: "sample title",
    courseStatus: "draft",
    coursePrice: 200,
  },
  {
    courseTitle: "sample title",
    courseStatus: "draft",
    coursePrice: 200,
  },
];

const TutorCoursesTable = () => {
  const {
    data: courseData,
    isFetching,
    error,
    isError,
    isSuccess,
  } = useGetAllCoursesQuery();
  const navigate = useNavigate();
  // console.log("course data", data);

  useEffect(() => {
    if (isError) {
      toast.error(error.data.message || "fetching error");
    }
  }, [isError, isSuccess, courseData]);

  if (isFetching) {
    return (
      <div className="w-full h-full  flex-1 m-auto justify-center items-center">
        <Loader className="size-20  animate-spin" />;
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col space-y-5">
      <h1 className="text-2xl font-bold text-center">
        Your have created following courses
      </h1>

      <Button
        onClick={() => {
          navigate("/tutor/course/create");
        }}
        className="cursor-pointer max-w-xs"
      >
        + Add course
      </Button>

      <Table>
        <TableCaption>A list of your launched / draft courses.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Sl. No.</TableHead>
            <TableHead>Course Title</TableHead>
            <TableHead>status</TableHead>
            <TableHead>Course Price</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courseData &&
            courseData.course.map((course, index) => {
              return (
                <TableRow key={course._id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{course.courseTitle}</TableCell>
                  <TableCell>
                    <Badge variant="default" className="text-sky-50">
                      {course.courseStatus ? <>Published</> : <>Draft</>}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    ₹ {course.coursePrice}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
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

export default TutorCoursesTable;
