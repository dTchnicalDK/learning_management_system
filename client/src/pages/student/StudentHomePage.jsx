import React, { useEffect } from "react";
import HeroSection from "./HeroSection";
import Course from "./Course";
import { useGetPublishedCoursesQuery } from "@/features/api/courseApi";
import { toast } from "sonner";
import { Loader } from "lucide-react";

const StudentHomePage = () => {
  const courses = [1, 2, 3, 4, 5];
  // const isLoading = false;
  const { data, isSuccess, error, isLoading } = useGetPublishedCoursesQuery();

  //toasting messages
  useEffect(() => {
    if (error) {
      toast.error(error.data?.message || "course fetching error!");
    }
    // console.log("data", data);
  }, [isSuccess, error]);

  return (
    <div className="flex flex-col gap-y-2">
      <HeroSection />
      <h1 className="font-bold ml-2">Explore courses</h1>

      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex h-full w-screen justify-center items-center">
            <Loader className="size-20 animate-spin" />
          </div>
        ) : (
          data.course.map((courseItem, indx) => {
            return <Course key={indx} course={courseItem} />;
          })
        )}
      </div>
    </div>
  );
};

export default StudentHomePage;
