import React from "react";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const CourseLevel = ({ courseLevel, setCourseLevel }) => {
  return (
    <div className="space-y-2">
      <Label
        htmlFor="courseLevel"
        className="text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        Course Level
      </Label>
      <Select value={courseLevel} onValueChange={setCourseLevel}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Basic">Basic</SelectItem>
          <SelectItem value="Intermediate">Intermediate</SelectItem>
          <SelectItem value="Advance">Advance</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CourseLevel;
