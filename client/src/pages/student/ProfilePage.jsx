import React, { useEffect, useState } from "react";
import userImg from "@/assets/user.svg";
import EnrolledCourses from "./EnrolledCourses";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useGetCurrentUserProfileQuery } from "@/features/api/authApi";
import { Loader } from "lucide-react";

const ProfilePage = () => {
  const [editedUserName, setEditedUserName] = useState({ userName: "" });
  const [choosenProfilImage, setChoosenProfileImage] = useState("");
  const { data, isLoading, error } = useGetCurrentUserProfileQuery();
  const user = data?.user;

  useEffect(() => {
    setEditedUserName(user?.userName);
  }, [data]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setChoosenProfileImage(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("data to update", editedUserName, choosenProfilImage);
  };

  if (isLoading) {
    return <Loader className="animate-spin w-50" />;
  }

  return (
    <div className="p-5">
      <div className="profile  bg-white inline-block  size-30 rounded-full ">
        <div>
          <img
            src={user.profilePhoto ? user.profilePhoto : `${userImg}`}
            alt="userImage"
            className="size-30 "
          />
        </div>
        <div className="flex items-center gap-5 pb-2">
          Name:{" "}
          <span className="text-slate-900 dark:text-slate-200 font-semibold">
            {user.userName}
          </span>
        </div>
        <div className="flex items-center gap-5 pb-2">
          email:{" "}
          <span className="text-slate-900 dark:text-slate-200 font-semibold">
            {user.email}
          </span>
        </div>
        <div className="flex items-center gap-5 pb-2">
          Role:
          <span className="text-slate-900 dark:text-slate-200 font-semibold uppercase">
            {user.role}
          </span>
        </div>

        {/* ----------------dialog for editing profile------------------- */}
        <Dialog>
          <DialogTrigger>
            <div className="bg-amber-600 hover:bg-amber-700 px-3 py-1 rounded-full">
              Edit profile
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-center">
                Edit Your Profile Info.
              </DialogTitle>
              <DialogDescription>
                Your can edit your profile information here, and click save when
                done!
              </DialogDescription>
              <form className="w-5/6 flex flex-col mx-auto justify-center gap-y-5">
                <div className="flex justify-between items-center gap-3">
                  Name:
                  <span>
                    <Input
                      name="userName"
                      value={editedUserName}
                      onChange={(e) => setEditedUserName(e.target.value)}
                      type="text"
                      className="w-full"
                    />
                  </span>
                </div>
                <div className="flex justify-between items-center gap-3">
                  profile Image:
                  <span>
                    <Input
                      type="file"
                      name="profilePhoto"
                      onChange={handleFileChange}
                    />
                  </span>
                </div>
                <Button
                  onClick={handleSubmit}
                  className="pb-2 bg-green-600 hover:bg-green-700 dark:bg-green-900 dark:hover:bg-green-950 text-white "
                >
                  save
                </Button>
              </form>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <div className="mb-5">
        <EnrolledCourses />
      </div>
    </div>
  );
};

export default ProfilePage;
