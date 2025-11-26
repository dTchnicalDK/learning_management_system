import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useGetCourseByIdQuery,
  useGetCourseLecturesQuery,
  useGetLectureByIdQuery,
} from "@/features/api/courseApi";
import {
  Loader,
  LockIcon,
  LucideClockArrowDown,
  PlayCircle,
} from "lucide-react";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import DOMPurify from "dompurify";
import { toast } from "sonner";
import { SidebarSeparator } from "@/components/ui/sidebar";
import PurchaseCourseButton from "@/components/PurchaseCourseButton";

const CourseDetails = ({ course }) => {
  const [purchased, setPurchased] = useState(false);
  const { courseId } = useParams();
  const [video, setvideo] = useState({ videoSrc: null, videoTitle: "" });

  const {
    data: courseData,
    isLoading,
    error: courseError,
    refetch,
  } = useGetCourseByIdQuery(courseId);

  const [sanitized, setSanitized] = useState("");
  console.log("course, lecture ", courseData);
  const videoRef = useRef(null);

  const handlePlayLecture = async (lecture) => {
    const src = lecture?.videoUrl ?? null;
    const title = lecture?.lectureTitle ?? "";
    //checking is videopreview free or not
    if (!lecture.isPreviewFree) {
      return toast.error("purchase this course first!");
    }
    if (!src) {
      try {
        if (videoRef.current && !videoRef.current.paused)
          videoRef.current.pause();
      } catch (e) {}
      toast.error("No lecture video found");

      setvideo({ videoSrc: null, videoTitle: "" });
      return;
    }

    if (videoRef.current) {
      videoRef.current.src = src;
      videoRef.current.play().catch(() => {
        // console.log("playin video error");
      });
      setvideo({ videoSrc: src, videoTitle: title });
    }

    try {
      await refetch();
    } catch (e) {
      // ignore refetch errors for playback
    }
  };

  //sanitizing course description data as it is HTML data
  useEffect(() => {
    const raw = courseData?.course?.description || "";
    const safe = DOMPurify.sanitize(raw);
    setSanitized(safe);
    // console.log("data", data);
    setvideo({
      videoSrc: courseData?.course?.lectures[0]?.videoUrl || null,
      videoTitle: courseData?.course?.lectures[0]?.lectureTitle || "",
    });
  }, [courseData?.course?.description, courseData]);

  if (isLoading) {
    return (
      <div className="w-3/4 h-screen flex m-auto justify-center items-center">
        <Loader className="size-20  animate-spin" />;
      </div>
    );
  }

  return (
    <div className=" w-screen ">
      {/* -----------header------------ */}
      <div className=" px-20 py-10 bg-linear-to-r from-blue-600 to-violet-700 dark:bg-linear-to-r dark:from-gray-600 dark:to-zinc-700  text-white">
        <h1 className="text-3xl text-[#ffafcc] dark:text-gray-300 text-shadow-lg  md:text-4xl font-bold py-2">
          {courseData.course?.courseTitle}
        </h1>
        <h2 className="py-1 italic">{courseData.course?.courseSubtitle}</h2>
        <small>
          Created By{" "}
          <Link className="underline text-purple-800 text-center font-medium tracking-widest  pl-2 bg-green-100/50 rounded-full px-5">
            {courseData.course?.creator?.userName}
          </Link>
        </small>
        <small className="flex items-center text-center gap-2 ">
          <LucideClockArrowDown className="size-4" /> Last Updated at -{" "}
          {moment(courseData.course?.updatedAt).format("LLLL")}
        </small>
        <h5>
          Student Enrolled : {courseData.course?.enrolledStudents.length}{" "}
        </h5>
      </div>
      {/* ----------------details section-------------- */}
      <section className="details  grid grid-cols-1 gap-3 px-5 md:grid-cols-4 md:px-5">
        {/* <div className=" container my-5 px-5"> */}
        <div className="left my-5  col-span-2">
          <h2 className="text-2xl font-bold shadow-sm py-2">Descritptions:-</h2>

          <p dangerouslySetInnerHTML={{ __html: sanitized }} className="py-5" />

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl font-bold">
                Course Content
              </CardTitle>
              <h5>lectures : {courseData.course?.lectures?.length}</h5>
            </CardHeader>
            <CardContent>
              <ul>
                {courseData &&
                  courseData.course.lectures.map((lecture, index) => {
                    return (
                      <li
                        key={index}
                        onClick={() => handlePlayLecture(lecture)}
                        className="flex gap-2 my-4 cursor-pointer p-1 rounded-full hover:bg-blue-50 dark:hover:bg-gray-800"
                      >
                        {lecture.isPreviewFree ? <PlayCircle /> : <LockIcon />}
                        {`${index + 1}.  ${lecture.lectureTitle}`}
                      </li>
                    );
                  })}
              </ul>
            </CardContent>
          </Card>
        </div>
        <div className="right col-span-2 my-8">
          <Card>
            <CardHeader>
              <div className="w-full aspect-video">
                <video src={video?.videoSrc} ref={videoRef} controls />
              </div>
              <CardTitle>
                <h1 className="text-2xl text-center md:text-3xl line-clamp-2">
                  {video.videoTitle}
                </h1>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <SidebarSeparator />
              {purchased ? (
                <Button
                  variant="default"
                  className="text-xl my-2 cursor-pointer"
                >
                  Play Now
                </Button>
              ) : (
                <>
                  <h2>₹ {courseData.course?.coursePrice}</h2>
                  <PurchaseCourseButton />
                </>
              )}
            </CardContent>
          </Card>
        </div>
        {/* </div> */}
      </section>
    </div>
  );
};

export default CourseDetails;
