import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  useGetLectureByIdQuery,
  useUpdateLectureMutation,
} from "@/features/api/courseApi";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";

const EditLecture = () => {
  const { courseId, lectureId, courseTitleParam } = useParams();
  const [videoProgress, setVideoProgress] = useState(false);
  const [videoProgressPercent, setVideoProgressPercent] = useState(0);
  const [lecture, setLecture] = useState({
    lectureTitle: "",
    lectureDescription: "",
    isPreviewFree: false,
    videoUrl: "",
    publicId: "",
  });
  const ids = { courseId, lectureId };
  const { data, isLoading, error, isSuccess, refetch } =
    useGetLectureByIdQuery(ids);
  const [
    updateLecture,
    {
      data: updatedLectureData,
      isLoading: updateLectureLoading,
      error: updateLectureError,
      isSuccess: updateLectureIsSuccess,
    },
  ] = useUpdateLectureMutation();
  const navigate = useNavigate();

  //checking course and lecture ids
  useEffect(() => {
    if (!courseId || !lectureId) {
      toast.error("Course ID or Lecture ID is missing!");
      navigate("/tutor/courses");
    }
  }, [courseId, lectureId, navigate]);

  //toasting messages
  useEffect(() => {
    if (isSuccess && data) {
      setLecture({
        lectureTitle: data.lecture.lectureTitle || "",
        lectureDescription: data.lecture.lectureDescription || "",
        isPreviewFree: data.lecture.isPreviewFree || false,
        videoUrl: data.lecture.videoUrl || "",
        publicId: data.lecture.publicId || "",
      });
    }
    if (error) {
      console.log("fetching data error", error);
      toast.error(
        error?.data?.message || "something went wrong fetching data!"
      );
    }
    if (updateLectureIsSuccess) {
      toast.success(updatedLectureData?.message || "lecture updated!");
      navigate(`/tutor/course/${courseId}/${courseTitleParam}/lectures`);
    }
    if (updateLectureError) {
      console.log("lecture update error", updateLectureError);

      toast.error(
        updateLectureError?.data?.message || "error while updating lecture!"
      );
    }
  }, [
    data,
    error,
    isSuccess,
    updateLectureIsSuccess,
    updateLectureError,
    updatedLectureData,
    navigate,
    courseId,
  ]);

  const handleIsPreviewFree = () => {
    setLecture((prev) => ({ ...prev, isPreviewFree: !prev.isPreviewFree }));
  };

  ////////////////uploading video on selection///////////////
  const handleVideochange = async (e) => {
    const GET_CLOUDINARY_SIGNATURE_API =
      "http://localhost:3000/api/v1/media/signature";

    const file = e.target.files[0];
    if (!file) {
      return toast.error("no file selected");
    }
    //1.fetching signature
    const signResponse = await axios.get(GET_CLOUDINARY_SIGNATURE_API);

    const { signature, timestamp, api_key, cloudName } =
      await signResponse.data;

    //2.  creating formdata for video file
    const formData = new FormData();
    formData.append("file", file);
    formData.append("timestamp", timestamp);
    formData.append("api_key", api_key);
    formData.append("signature", signature);
    formData.append("folder", "LMS/lectureVideo");
    formData.append("resource_type", "video");

    //3.uploading video directly to cloudinary from frontend
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
    try {
      setVideoProgress(true);
      setVideoProgressPercent(0);

      const videoInfo = await axios.post(cloudinaryUrl, formData, {
        //5.showing progress of uploading video
        onUploadProgress: (progress) => {
          if (progress.total) {
            setVideoProgressPercent(
              Math.round((progress.loaded * 100) / progress.total)
            );
          } else {
            setVideoProgressPercent(() => `${progress.loaded} bytes`);
          }
        },
      });
      // console.log("uploaded videoinfo", videoInfo);
      setLecture((prev) => ({
        ...prev,
        videoUrl:
          videoInfo.data.secure_url ||
          videoInfo.data.uploadedVideoInfo?.secure_url,
        publicId:
          videoInfo.data.public_id ||
          videoInfo.data.uploadedVideoInfo?.public_id,
      }));
      toast.success(videoInfo.data.message || "video uploaded successfully!");
    } catch (error) {
      console.log("video upload error", error);
      toast.error(error.response?.data?.message || "video upload error!");
    } finally {
      setVideoProgress(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate parameters
    if (!courseId || !lectureId) {
      toast.error("Missing course or lecture ID");
      return;
    }

    // Validate required fields
    if (
      !lecture.lectureTitle
      // || !lecture.videoUrl
    ) {
      toast.error("Lecture title and video are required!");
      return;
    }

    try {
      const lectureData = {
        ...lecture,
        courseId: courseId,
        lectureId: lectureId,
      };
      // console.log("lecture in submit", lectureData);
      await updateLecture(lectureData);
    } catch (error) {
      console.log("update lecture error", error);
      toast.error("Failed to update lecture!");
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    const confirmCancel = confirm(
      "Are you sure to cancel create course, and discard Changes ? "
    );
    if (confirmCancel) {
      navigate(`/tutor/course/${courseId}/${courseTitleParam}/lectures`);
    } else return;
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">You can edit your lecture here!</h1>
      <p>
        This is the place where you actually edit your course and upload lecture
        video which can be published later
      </p>
      <div className="mt-3">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <Label>Lecture Title *</Label>
            <Input
              type="text"
              required
              name="courseTitle"
              value={lecture.lectureTitle}
              onChange={(e) =>
                setLecture((prev) => ({
                  ...prev,
                  lectureTitle: e.target.value,
                }))
              }
              placeholder="Enter lecture title"
            />
          </div>
          <div className="space-y-1">
            <Label>Lecture Description</Label>
            <Input
              type="text"
              required
              name="lectureDescription"
              value={lecture.lectureDescription}
              onChange={(e) =>
                setLecture((prev) => ({
                  ...prev,
                  lectureDescription: e.target.value,
                }))
              }
              placeholder="Enter what this lecture explains"
            />
          </div>
          <div className="space-y-1 w-1/2">
            <Label>Lecture video *</Label>
            <Input
              type="file"
              // required
              name="lectureVideo"
              onChange={handleVideochange}
              placeholder="Enter what this lecture explains"
            />
          </div>

          {/* ------------------previewing video--------------------- */}
          {lecture.videoUrl && (
            <div className="space-y-1">
              <Label>Current Video:</Label>
              <div className="text-sm text-green-600">Video added ✓</div>
              <video
                src={lecture.videoUrl}
                controls
                className="w-1/2 max-w-md rounded-lg"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}
          {/* --------------------------------------- */}

          {/* //swith button---- */}
          <div className="flex gap-4">
            <Label htmlFor="isPreviewFree">Is this lecture free</Label>
            <Switch
              id="isPreviewFree"
              name="isPreviewFree"
              checked={lecture.isPreviewFree}
              onCheckedChange={handleIsPreviewFree}
            />
          </div>

          {/* /// progress bar------------ */}
          <div className="w-1/2 ">
            {videoProgress ? (
              <div className="flex gap-2 items-center">
                <Progress value={videoProgressPercent} />{" "}
                <span>{videoProgressPercent}%</span>
              </div>
            ) : (
              <></>
            )}
          </div>
          {/* ///buttons ----------------- */}
          <div className="w-1/2 flex justify-around items-center ">
            <Button
              type="submit"
              disabled={updateLectureLoading || isLoading}
              className="cursor-pointer"
            >
              {isLoading || updateLectureLoading ? (
                <Loader2 className="mr-2 animate-spin" />
              ) : (
                <>Update lecture</>
              )}
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              className="cursor-pointer"
            >
              Back to Lectures
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLecture;
