import React from "react";
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
import { Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  return (
    <div className="w-full flex-1 flex-col items-center justify-center ">
      <h1 className="text-2xl font-bold text-center">
        Your have created following courses
      </h1>
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
          {courses &&
            courses.map((course, index) => {
              return (
                <TableRow key={index + 1}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{course.courseTitle}</TableCell>
                  <TableCell>
                    <Badge variant="default">{course.courseStatus}</Badge>
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
