import React from "react";
import HeroSection from "./HeroSection";
import Course from "./Course";
import { SkeletonCard } from "@/components/SkeletonCard";

const StudentHomePage = () => {
  const courses = [1, 2, 3, 4, 5];
  const isLoading = false;
  return (
    <div className="flex flex-col gap-y-2">
      <HeroSection />
      <h1 className="font-bold ml-2">Explore courses</h1>

      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 sm:px-6 lg:px-8">
        {isLoading
          ? courses.map((_, index) => <SkeletonCard key={index} />)
          : courses.map((indx, _) => {
              return <Course key={indx} />;
            })}
      </div>
    </div>
  );
};

export default StudentHomePage;
