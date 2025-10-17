import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
// import { Value } from "@radix-ui/react-select";

const SelectComp = ({ settingCategory, inputData }) => {
  return (
    <div>
      <div className="flex gap-4 justify-between">
        <Select
          value={inputData?.category}
          onValueChange={(value) =>
            settingCategory({ ...inputData, category: value })
          }
        >
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
      </div>
    </div>
  );
};

export default SelectComp;
