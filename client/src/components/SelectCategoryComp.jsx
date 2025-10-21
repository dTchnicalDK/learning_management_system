import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const SelectCategoryComp = ({ setCategory, category }) => {
  return (
    <div>
      <div className="flex gap-4 justify-between">
        <Select
          value={category || ""} // Ensure we never pass undefined
          onValueChange={setCategory}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Courses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="academic">Academic</SelectItem>
            <SelectItem value="competitive">Competitive</SelectItem>
            <SelectItem value="medical">Medical</SelectItem>
            <SelectItem value="engineering">Engineering</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SelectCategoryComp;
