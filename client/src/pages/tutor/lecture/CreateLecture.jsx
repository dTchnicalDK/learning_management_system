import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateCourseMutation,
  useCreateLectureMutation,
} from "@/features/api/courseApi";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

const CreateLecture = () => {
  const [createLecture, { data, isLoading, isSuccess, error }] =
    useCreateLectureMutation();
  const params = useParams();
  // console.log("courseId", params.courseId);
  const [lecture, setLecture] = useState({
    lectureTitle: "",
    lectureDescription: "",
    isPreviewFree: true,
  });
  const navigate = useNavigate();
  // const isLoading = false;
  //toasting messages
  useEffect(() => {
    if (error) {
      toast.error(error.data?.message || "course creation error");
    }
    if (isSuccess) {
      toast.success(data?.message || "course created!");
    }
  }, [isSuccess, error]);

  const handleCreateLecture = async (e) => {
    e.preventDefault();

    try {
      console.log("lecture ", lecture);
      await createLecture({
        courseId: params.courseId,
        lectureTitle: lecture.lectureTitle,
        lectureDescription: lecture.lectureDescription,
        isPreviewFree: lecture.isPreviewFree,
      });
      navigate(`/tutor/course/${params.courseId}/lectures`);
    } catch (error) {
      console.log("course creation error");
      toast.error(error.message || "creation error");
    }
    console.log("handle create lecture ran", lecture);
  };
  return (
    <div>
      <h1 className="text-3xl font-bold">
        Let's create lectures for this course, to continue learning journey
      </h1>
      <p>
        This will create new lecture, where you can add your video lecture by
        uploding your video or by connecting youtube videos link
      </p>
      <div className="mt-3">
        <form className="space-y-4" onSubmit={handleCreateLecture}>
          <div className="space-y-1">
            <Label>Lecture Title</Label>
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

          {/* /////////is course free /////selct box//////////// */}
          <div className="flex gap-4 justify-between">
            <Select
              value={lecture.isPreviewFree?.toString()}
              onValueChange={(value) =>
                setLecture({ ...lecture, isPreviewFree: value })
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue
                  placeholder="Is Free preview ?"
                  className="w-fit"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Yes free</SelectItem>
                <SelectItem value="false">Not free</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
              // onClick={() => navigate("/tutor/courses-table")}
              variant="ouline"
              className="cursor-pointer"
            >
              cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLecture;
