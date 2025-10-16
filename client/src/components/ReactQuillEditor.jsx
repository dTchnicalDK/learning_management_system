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
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import SelectComp from "./SelectComp";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useUpdateCourseMutation } from "@/features/api/courseApi";
import { useParams } from "react-router";
import DOMPurify from "dompurify";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const ReactQuillEditor = () => {
  const [courseDetails, setCourseDetails] = useState("");
  const [courseThumbnail, setCourseThumbnail] = useState(null);
  const [updateCourse, { data, isLoading, error, isSuccess }] =
    useUpdateCourseMutation();
  const params = useParams();
  const [inputData, setInputData] = useState({
    courseTitle: "",
    courseSubtitle: "",
    category: "",
    courseLevel: "",
    coursePrice: 0,
    courseThumbnail,
  });

  // Quill editor modules configuration
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
    // "bullet",
    "link",
    "image",
    "blockquote",
    "code-block",
    "align",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      // Sanitize the HTML content before sending
      const sanitizedDescription = DOMPurify.sanitize(courseDetails);

      formData.append("description", sanitizedDescription);
      formData.append("courseThumbnail", courseThumbnail);
      formData.append("courseTitle", inputData.courseTitle);
      formData.append("courseSubtitle", inputData.courseSubtitle);
      formData.append("courseLevel", inputData.category);
      formData.append("coursePrice", inputData.coursePrice);
      formData.append("category", inputData.category);
      formData.append("courseId", params.id);

      await updateCourse(formData);
    } catch (error) {
      console.log("error while updating", error);
    }
  };
  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "updated!");
    }
    if (error) {
      toast.error(error.data?.message || "error while updating");
    }
  }, [isSuccess, error]);

  return (
    <div className="container mx-auto p-6">
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
                value={inputData.courseTitle}
                // value={title}
                // onChange={(e) => setTitle(e.target.value)}
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
                value={inputData.courseSubtitle}
                // value={subTitle}
                // onChange={(e) => setSubTitle(e.target.value)}
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
                  value={courseDetails}
                  onChange={setCourseDetails}
                  //   onChange={handleChange}
                  modules={modules}
                  formats={formats}
                  className="h-full"
                  style={{
                    minHeight: "200px",
                    border: "none",
                  }}
                />
              </div>
            </div>

            {/* ---------------------- */}
            <div className="flex justify-between items-center gap-2">
              {/* -------course  category---------- */}
              <div className="space-y-2">
                <Label
                  htmlFor="category"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  category
                </Label>
                <SelectComp
                  settingCategory={setInputData}
                  inputData={inputData}
                />
              </div>

              {/* //course level-------- */}
              <div className="space-y-2">
                <Label
                  htmlFor="category"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  course level
                </Label>
                <Select
                  onValueChange={(value) =>
                    setInputData({
                      ...inputData,
                      courseLevel: value,
                    })
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="intermediate">Inermediate</SelectItem>
                    <SelectItem value="advance">Advance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price in INR */}
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
                  value={inputData.coursePrice}
                  // value={subTitle}
                  // onChange={(e) => setSubTitle(e.target.value)}
                  onChange={handleChange}
                  placeholder="course price"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Choose Course Thumbnail */}
            <div className="space-y-2">
              <Label
                htmlFor="courseThumbnail"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Choose Course Thumbnail
              </Label>
              <input
                id="courseThumbnail"
                type="file"
                accept="image/*"
                name="courseThumbnail"
                onChange={(e) => setCourseThumbnail(e.target.files[0])}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
            {/* --------course Thumbnail preview----- */}
            <div>
              {courseThumbnail ? (
                <img
                  src={URL.createObjectURL(courseThumbnail)}
                  alt="course Thumbnail"
                />
              ) : (
                "no file selected!"
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
                    <Loader2 className="mr-2 animate-spin">Updating...</Loader2>
                  ) : (
                    "Update Course"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2 px-4 rounded-md transition-colors duration-200 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
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
