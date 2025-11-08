import CourseLevel from "@/components/CourseLevel";
import SelectCategoryComp from "@/components/SelectCategoryComp";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import DOMPurify from "dompurify";
import {
  useGetCourseByIdQuery,
  useUpdateCourseMutation,
} from "@/features/api/courseApi.js";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Await, Link, useNavigate, useParams } from "react-router";

const EditCourse = () => {
  const params = useParams();
  const navigate = useNavigate();
  //formdata variables
  const [courseTitle, setCourseTitle] = useState("");
  const [courseSubTitle, setCourseSubTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [courseLevel, setCourseLevel] = useState("");
  const [coursePrice, setCoursePrice] = useState("");
  const [courseThumbnailPreview, setCourseThumbnailPrview] = useState(null);
  const [courseThumbnail, setCourseThumbnail] = useState("");
  const [updateCourse, { data, error, isLoading, isSuccess }] =
    useUpdateCourseMutation();
  const {
    data: courseInitialData,
    isLoading: isCourseDataLoading,
    error: courseError,
  } = useGetCourseByIdQuery(params.id);
  const [inputError, setInputError] = useState(null);

  //after auto fetching, setting initalData to edit
  useEffect(() => {
    const setInitialData = async () => {
      // console.log("courseInitialData", courseInitialData);
      setCourseTitle(courseInitialData.course.courseTitle || "");
      setCourseSubTitle(courseInitialData.course.courseSubtitle || "");
      setDescription(courseInitialData.course.description || "");
      setCategory(courseInitialData.course.category || "");
      setCourseLevel(courseInitialData.course.courseLevel || "");
      setCoursePrice(courseInitialData.course.coursePrice?.toString() || "");
      setCourseThumbnail(courseInitialData.course.courseThumbnail || "");
    };

    if (courseInitialData) {
      setInitialData();
    }
  }, [courseInitialData]);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCourseThumbnailPrview(file);
    }
    // console.log("file", file);
  };

  ///sanitization courseThumbnailPreview object
  useEffect(() => {
    if (courseThumbnailPreview) {
      URL.revokeObjectURL(courseThumbnailPreview);
    }
  }, [courseThumbnailPreview]);

  const handleSubmit = async () => {
    const sanitizedDescription = DOMPurify.sanitize(description);
    //basic validation
    setDescription(sanitizedDescription);
    if (
      courseTitle.trim().length <= 0 ||
      courseSubTitle.trim().length <= 0 ||
      !category ||
      !courseLevel
    ) {
      return setInputError("* madatory fields are missing!");
    }

    //creating formdata
    const formData = new FormData();

    formData.append("courseId", params.id);
    formData.append("courseTitle", courseTitle);
    formData.append("courseSubtitle", courseSubTitle);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("courseLevel", courseLevel);
    formData.append("coursePrice", coursePrice);
    formData.append("courseThumbnail", courseThumbnailPreview);

    //submitting data/ calling api
    try {
      await updateCourse(formData);
      navigate("/tutor/courses-table");
    } catch (error) {
      console.log("data submittin error", error);
      return toast.error(error.data?.message || "updatation error");
    }
  };
  const handleCanel = () => {
    const acknowledgement = window.confirm(
      "Do you really want to cancel edit ??"
    );
    if (acknowledgement) {
      navigate("/tutor/courses-table");
    } else return;
  };

  // Toast messages
  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Course updated successfully!");
    }
    if (error) {
      toast.error(error.data?.message || "Course updated error!");
    }
  }, [isSuccess, error]);

  return (
    <div className="">
      <Card>
        <CardHeader>
          <CardTitle>Course Edit form</CardTitle>
          <CardDescription>
            Here you can edit courses already created!
          </CardDescription>
          <CardAction className="text-blue-700 underline">
            <Link to={"/tutor"}>Back to Dashboard</Link>
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-2">
          {inputError && <span className="text-red-500">{inputError}</span>}
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              type="text"
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              placeholder="ex. competitive History"
            />
          </div>
          <div className="space-y-2">
            <Label>Sub-Title</Label>
            <Input
              type="text"
              value={courseSubTitle}
              onChange={(e) => setCourseSubTitle(e.target.value)}
              placeholder="ex. revolt of 1857"
            />
          </div>

          {/* -----------------ReactQuillEditor for course details------------------------- */}
          <div className="space-y-2">
            <Label>Description</Label>
            <ReactQuill
              theme="snow"
              value={description}
              onChange={setDescription}
              placeholder="Write something to describe course..."
            />
          </div>

          <div className="flex justify-between items-center gap-2 my-4">
            {/* Course Category */}
            <div className="space-y-2">
              <Label
                htmlFor="category"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Category
              </Label>
              <SelectCategoryComp
                setCategory={setCategory}
                category={category}
              />
            </div>

            {/* Course Level */}
            <CourseLevel
              courseLevel={courseLevel}
              setCourseLevel={setCourseLevel}
            />

            {/* Price */}
            <div className="space-y-2">
              <Label
                htmlFor="coursePrice"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Course Price
              </Label>
              <Input
                id="coursePrice"
                type="number"
                name="coursePrice"
                value={coursePrice}
                onChange={(e) => setCoursePrice(e.target.value)}
                placeholder="price ex. 200"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                min="0"
              />
            </div>
          </div>

          {/* Course Thumbnail */}
          <div className="space-y-2">
            <Label
              htmlFor="courseThumbnail"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Choose Course Thumbnail
            </Label>
            <Input
              id="courseThumbnail"
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              aria-describedby="thumbnail-help"
            />
            <div id="thumbnail-help" className="text-sm text-gray-500 mt-1">
              Recommended size: 1280x720 pixels
            </div>
          </div>

          {/* Thumbnail Preview */}
          <div className="mt-2">
            {courseThumbnailPreview instanceof File ? (
              <img
                src={URL.createObjectURL(courseThumbnailPreview)}
                alt="Course thumbnail preview"
                className="max-w-xs max-h-32 object-cover rounded"
              />
            ) : courseThumbnail ? (
              <img
                src={courseThumbnail}
                alt="Course thumbnail"
                className="max-w-xs max-h-32 object-cover rounded"
              />
            ) : (
              <div className="text-gray-500 italic">No thumbnail selected</div>
            )}
          </div>
        </CardContent>

        {/* //buttons */}
        <CardFooter>
          <div className="flex gap-15 w-3/4 mx-auto my-4">
            <Button
              type="submit"
              disabled={isLoading}
              onClick={handleSubmit}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Course"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCanel}
              className="flex-1 cursor-pointer"
            >
              Cancel
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EditCourse;
