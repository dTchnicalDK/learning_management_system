import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideClockArrowDown, PlayCircle } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router";

const CourseDetails = () => {
  const [purchased, setPurchased] = useState(true);
  return (
    <div className="grid grid-cols-1  ">
      {/* -----------header------------ */}
      <div className=" px-20 py-10 bg-linear-to-r from-blue-600 to-violet-700 dark:bg-linear-to-r dark:from-gray-600 dark:to-zinc-700  text-white">
        <h1 className="text-3xl md:text-4xl font-bold py-2">
          This is the title section
        </h1>
        <h2 className="py-1 italic">This is the subtitle section</h2>
        <small>
          Created By{" "}
          <Link className="underline text-blue-950 pl-2">
            Dharmendra Chauhan
          </Link>
        </small>
        <small className="flex items-center text-center gap-2 ">
          <LucideClockArrowDown className="size-4" /> Last Updated 10-11-2025
        </small>
        <h5>Student Enrolled : 1000</h5>
      </div>
      {/* ----------------details section-------------- */}
      <section className="details relative grid grid-cols-1 gap-5 px-5 md:grid-cols-2 md:px-5">
        {/* <div className=" container my-5 px-5"> */}
        <div className="left my-5 pr-10">
          <h2 className="text-2xl font-bold py-2">Descritptions</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis iure
            a fugiat! Aut quod cum deserunt laborum quam ipsam dignissimos omnis
            fuga, iste perferendis sint nesciunt modi facere, iure aliquam eos
            illo repudiandae! Molestias obcaecati sequi neque quam! Suscipit
            commodi quia ipsam cumque nihil quaerat temporibus libero odit
            reiciendis numquam!
          </p>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl font-bold">
                Course Content
              </CardTitle>
              <h5>10 Lectures</h5>
            </CardHeader>
            <CardContent>
              <ul>
                <li className="flex gap-2 my-4">
                  <PlayCircle /> Introduction lecture
                </li>
                <li className="flex gap-2 my-4">
                  <PlayCircle /> Introduction lecture
                </li>
                <li className="flex gap-2 my-4">
                  <PlayCircle /> Introduction lecture
                </li>
                <li className="flex gap-2 my-4">
                  <PlayCircle /> Introduction lecture
                </li>
                <li className="flex gap-2 my-4">
                  <PlayCircle /> Introduction lecture
                </li>
                <li className="flex gap-2 my-4">
                  <PlayCircle /> Introduction lecture
                </li>
                <li className="flex gap-2 my-4">
                  <PlayCircle /> Introduction lecture
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
        <div className="right min-w-1/3 my-8">
          <Card>
            <CardHeader>
              <video src=""></video>
              <CardTitle>
                <h1 className="text-2xl md:text-3xl line-clamp-2">
                  Introduction Lecture
                </h1>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <h2>₹ 3000</h2>
              {purchased ? (
                <Button
                  variant="default"
                  className="text-xl my-8 cursor-pointer"
                >
                  Buy Course Now
                </Button>
              ) : (
                <Button
                  variant="default"
                  className="text-xl my-8 cursor-pointer"
                >
                  Play Now
                </Button>
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
