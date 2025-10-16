import ReactQuillEditor from "@/components/ReactQuillEditor";
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
import React, { useState } from "react";
import ReactQuill from "react-quill-new";

const EditCourse = () => {
  const [value, setValue] = useState("");

  return (
    <div className="">
      <Card>
        <CardHeader>
          <CardTitle>Course Edit form</CardTitle>
          {/* <CardDescription>Card Description</CardDescription> */}
          <CardAction>Card Action</CardAction>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input type="text" />
          </div>
          <div className="space-y-2">
            <Label>Sub-Title</Label>
            <Input type="text" />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            {/* <ReactQuill theme="snow" value={value} onChange={setValue} /> */}
            <ReactQuillEditor />
          </div>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EditCourse;
