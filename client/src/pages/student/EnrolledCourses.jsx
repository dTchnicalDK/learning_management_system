import EmptyBucket from "@/components/EmptyBucket";
import React from "react";
import Course from "./Course";

const EnrolledCourses = () => {
  const enrolledCourses = [1, 2];
  return (
    <div className="mt-5">
      {enrolledCourses.length === 0 ? (
        <EmptyBucket message="No Courses Enrolled !" />
      ) : (
        <>
          <h1 className="font-bold text-2xl">Your Enrolled Courses are:--</h1>
          <div className="pt-3 max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 ">
            {enrolledCourses.map((_, index) => {
              return <Course key={index} />;
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default EnrolledCourses;
