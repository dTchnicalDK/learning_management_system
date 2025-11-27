import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { Link } from "react-router";

const Course = ({ course }) => {
  // console.log("course", course);
  return (
    <>
      <Card className=" pt-0 hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
        <div className="">
          <img
            src={
              course.courseThumbnail ||
              "data:image/jpeg;base64,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"
            }
            alt="image"
            className="rounded-t-xl object-cover"
          />
        </div>

        <CardContent>
          <div className="">
            <div className="content flex flex-col gap-y-3">
              <CardTitle>
                <Link to={`/${course._id}/course-details`}>
                  <h1 className="text-xl font-bold text-teal-500 hover:underline cursor-pointer truncate">
                    {course.courseTitle}
                  </h1>
                </Link>
              </CardTitle>
              <div className="avtar-batch flex justify-between items-center border-t-2 border-t-gray-950 py-1">
                <div className="flex w-full justify-between gap-3 ">
                  <Avatar>
                    <AvatarImage
                      src={
                        course?.creator.photoURL ||
                        "https://github.com/shadcn.png"
                      }
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <p className="text-center truncate">
                    {course?.creator.userName}
                  </p>
                </div>
              </div>
              <div className="flex justify-between gap-5">
                <Badge
                  variant="default"
                  className="bg-blue-500 dark:bg-blue-900 text-white"
                >
                  {course.courseLevel}
                </Badge>
                <h2>price: ₹ {course.coursePrice}</h2>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default Course;
