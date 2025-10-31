import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateCourseMutation } from "@/features/api/courseApi";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const CreateCourse = () => {
  const navigate = useNavigate();
  const [courseTitle, setCourseTitle] = useState("");
  const [createCourse, { data, isLoading, error, isSuccess }] =
    useCreateCourseMutation();
  const [category, setCategory] = useState("");

  const handleCreateLecture = async (e) => {
    e.preventDefault();
    const formData = { courseTitle, category };
    await createCourse(formData).unwrap();
    navigate("/tutor/courses-table");
  };

  useEffect(() => {
    if (error) {
      toast.error(error.data.message || "course creation error");
    }
    if (isSuccess) {
      toast.success(data.message || "course created");
    }
  }, [data, error]);

  return (
    <div>
      <h1 className="text-3xl font-bold">
        Let's start your teaching journey, adding new course
      </h1>
      <p>
        This will create new course, where you can add many lectures further!
      </p>
      <div className="mt-3">
        <form className="space-y-4" onSubmit={handleCreateLecture}>
          <div className="space-y-1">
            <Label>Course Title</Label>
            <Input
              type="text"
              name="courseTitle"
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              placeholder="Enter course title"
            />
          </div>
          <div className="flex gap-4 justify-between">
            <Select onValueChange={(value) => setCategory(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Courses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="academic">Acedemic</SelectItem>
                <SelectItem value="competitive">Competitive</SelectItem>
                <SelectItem value="medical">Medical</SelectItem>
                <SelectItem value="engineering">Engineering</SelectItem>
              </SelectContent>
            </Select>
            <div className="w-1/2 flex justify-around items-center ">
              <Button
                onClick={() => navigate("/tutor/courses-table")}
                variant="ouline"
                className="cursor-pointer"
              >
                cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="cursor-pointer"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 animate-spin" />
                ) : (
                  <>Create Course</>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;
