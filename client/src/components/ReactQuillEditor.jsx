import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import React, { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import SelectComp from "./SelectCategoryComp";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  useGetCourseByIdQuery,
  useUpdateCourseMutation,
} from "@/features/api/courseApi";
import { useParams } from "react-router";
import DOMPurify from "dompurify";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const ReactQuillEditor = () => {
  const [inputData, setInputData] = useState({
    courseTitle: "",
    courseSubtitle: "",
    category: "",
    courseLevel: "",
    coursePrice: 0,
    courseThumbnail: null,
    description: "",
  });

  const initialLoadRef = useRef(false);
  const params = useParams();

  const [updateCourse, { data, isLoading, error, isSuccess }] =
    useUpdateCourseMutation();

  const {
    data: courseInitialData,
    isLoading: isCourseDataLoading,
    error: courseError,
  } = useGetCourseByIdQuery(params.id);

  // Fetch initial course data
  useEffect(() => {
    if (courseInitialData?.course && !initialLoadRef.current) {
      const courseData = courseInitialData.course;

      setInputData({
        courseTitle: courseData.courseTitle || "",
        courseSubtitle: courseData.courseSubtitle || "",
        category: courseData.category || "",
        courseLevel: courseData.courseLevel || "",
        coursePrice: courseData.coursePrice || 0,
        courseThumbnail: courseData.courseThumbnail || null,
        description: courseData.description || "",
      });

      initialLoadRef.current = true;
      // // Set a small timeout to ensure ReactQuill is ready
      // setTimeout(() => {
      //   setIsEditorReady(true);
      // }, 100);
    }
  }, [courseInitialData]);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["blockquote", "code-block"],
      [{ align: [] }],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "link",
    "image",
    "blockquote",
    "code-block",
    "align",
  ];

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setInputData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleDescriptionChange = (value) => {
    setInputData((prev) => ({ ...prev, description: value }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInputData((prev) => ({
        ...prev,
        courseThumbnail: file,
      }));
    }
  };

  const handleCancel = () => {
    if (courseInitialData?.course) {
      setInputData(courseInitialData.course);
      initialLoadRef.current = true;
    }
  };

  // Category handler with empty value protection
  const handleCategoryChange = (value) => {
    if (value === "") return;
    setInputData((prev) => ({
      ...prev,
      category: value,
    }));
  };

  // Course Level handler with empty value protection
  const handleCourseLevelChange = (value) => {
    if (value === "") return;
    setInputData((prev) => ({
      ...prev,
      courseLevel: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputData.courseTitle?.trim()) {
      toast.error("Course title is required");
      return;
    }

    try {
      const formData = new FormData();
      const sanitizedDescription = DOMPurify.sanitize(
        inputData.description || ""
      );

      formData.append("description", sanitizedDescription);
      formData.append("courseTitle", inputData.courseTitle);
      formData.append("courseSubtitle", inputData.courseSubtitle || "");
      formData.append("courseLevel", inputData?.courseLevel || "");
      formData.append("coursePrice", inputData.coursePrice?.toString() || "0");
      formData.append("category", inputData?.category);
      formData.append("courseId", params.id);

      if (inputData.courseThumbnail instanceof File) {
        formData.append("courseThumbnail", inputData.courseThumbnail);
      }

      await updateCourse(formData);
    } catch (error) {
      console.error("Error while updating:", error);
      toast.error("An unexpected error occurred");
    }
  };

  // Toast messages
  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Course updated successfully!");
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message || "Error while updating course");
    }
  }, [error]);

  if (isCourseDataLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Loader2 className="animate-spin h-8 w-8" />
        <span className="ml-2">Loading course data...</span>
      </div>
    );
  }

  if (courseError) {
    return (
      <div className="text-center text-red-500 p-4">
        Error loading course data. Please try again.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {console.log("input data", inputData)}
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Edit Course
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Update your course information below
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Course Title */}
            <div className="space-y-2">
              <Label
                htmlFor="title"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Course Title
              </Label>
              <Input
                id="title"
                type="text"
                name="courseTitle"
                value={inputData?.courseTitle || ""}
                onChange={handleChange}
                placeholder="Enter course title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            {/* Sub-Title */}
            <div className="space-y-2">
              <Label
                htmlFor="subtitle"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Sub-Title
              </Label>
              <Input
                id="subtitle"
                type="text"
                name="courseSubtitle"
                value={inputData?.courseSubtitle || ""}
                onChange={handleChange}
                placeholder="Enter course sub-title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Description with Rich Text Editor */}
            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Description
              </Label>
              <div className="min-h-[200px] border border-gray-300 rounded-md overflow-hidden dark:border-gray-600">
                <ReactQuill
                  theme="snow"
                  value={inputData?.description}
                  onChange={handleDescriptionChange}
                  modules={modules}
                  formats={formats}
                  className="h-full"
                  style={{
                    minHeight: "200px",
                    border: "none",
                  }}
                  key={inputData.description} // Force re-render when description changes
                />
              </div>
            </div>

            <div className="flex justify-between items-center gap-2">
              {/* Course Category */}
              <div className="space-y-2">
                <Label
                  htmlFor="category"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Category
                </Label>
                <SelectComp
                  onCategoryChange={handleCategoryChange}
                  inputData={inputData}
                />
              </div>

              {/* Course Level */}
              <div className="space-y-2">
                <Label
                  htmlFor="courseLevel"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Course Level
                </Label>
                <Select
                  value={inputData.courseLevel || ""}
                  onValueChange={handleCourseLevelChange}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advance">Advance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

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
                  value={inputData?.coursePrice || 0}
                  onChange={handleChange}
                  placeholder="Course price"
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
              {inputData.courseThumbnail instanceof File ? (
                <img
                  src={URL.createObjectURL(inputData.courseThumbnail)}
                  alt="Course thumbnail preview"
                  className="max-w-xs max-h-32 object-cover rounded"
                />
              ) : inputData.courseThumbnail ? (
                <img
                  src={inputData.courseThumbnail}
                  alt="Course thumbnail"
                  className="max-w-xs max-h-32 object-cover rounded"
                />
              ) : (
                <div className="text-gray-500 italic">
                  No thumbnail selected
                </div>
              )}
            </div>

            {/* Buttons */}
            <CardFooter className="px-0 pb-0 pt-6">
              <div className="flex gap-3 w-full">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
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
                  onClick={handleCancel}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReactQuillEditor;
