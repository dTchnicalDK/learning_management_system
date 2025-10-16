import React from "react";
import SidebarComp from "@/components/Sidebar";
import { Outlet } from "react-router";

const TutorLayout = () => {
  return (
    <div className="relative w-full mt-20">
      <SidebarComp>
        <div className="w-full">
          <Outlet />
        </div>
      </SidebarComp>
    </div>
  );
};

export default TutorLayout;
