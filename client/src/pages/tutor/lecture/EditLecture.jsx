import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { useGetLectureByIdQuery } from "@/features/api/courseApi";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";

const EditLecture = () => {
  const params = useParams();
  // const isLoading = false;
  const [lectureProgres, setLectureProgress] = useState(false);
  const [videoProgress, setVideoProgress] = useState(false);
  const [videoProgressPercent, setVideoProgressPercent] = useState(0);
  const [lectureVideo, setLectureVideo] = useState(null);
  const [lecture, setLecture] = useState({
    lectureTitle: "",
    lectureDescription: "",
    isPreviewFree: false,
  });
  const ids = { courseId: params.courseId, lectureId: params.lectureId };
  const { data, isLoading, error, isSuccess } = useGetLectureByIdQuery(ids);
  const navigate = useNavigate();

  //tosting messages
  useEffect(() => {
    if (isSuccess) {
      setLecture(data.lecture);
    }
    if (error) {
      console.log("fetching data error", error);
      toast.error(error.message || "something went wrong fetching data!");
    }
  }, [error, isSuccess]);

  const handleIsPreviewFree = () => {
    setLecture({ ...lecture, isPreviewFree: !lecture.isPreviewFree });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("lectureVideo", lectureVideo);
    console.log("handleSubmit ran", lectureVideo, lecture, formData);
  };

  const handleVideochange = (e) => {
    const file = e.target.files[0];
    setLectureVideo(file);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    const confirmCancel = confirm(
      "Are you sure to cancel create course, and discard Changes ? "
    );
    if (confirmCancel) {
      navigate(`/tutor/course/${params.courseId}/lectures`);
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
                setLecture({ ...lecture, lectureTitle: e.target.value })
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
                setLecture({ ...lecture, lectureDescription: e.target.value })
              }
              placeholder="Enter what this lecture explains"
            />
          </div>

          <div className="space-y-1 w-1/2">
            <Label>Lecture video *</Label>
            <Input
              type="file"
              required
              name="lectureVideo"
              // value={lecture.lectureDescription}
              onChange={handleVideochange}
              placeholder="Enter what this lecture explains"
            />
          </div>

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
            {videoProgress ? <Progress value={30} /> : <></>}
          </div>

          {/* ///buttons ----------------- */}
          <div className="w-1/2 flex justify-around items-center ">
            <Button
              type="submit"
              disabled={isLoading}
              className="cursor-pointer"
            >
              {isLoading ? (
                <Loader2 className="mr-2 animate-spin" />
              ) : (
                <>Create lecture</>
              )}
            </Button>
            <Button
              onClick={handleCancel}
              variant="ouline"
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
