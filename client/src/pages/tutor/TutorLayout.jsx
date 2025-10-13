import NavBar from "@/components/NavBar";
// import Sidebar from "@/components/Sidebar";
// import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
// import { AppSidebar } from "@/components/app-sidebar"
import React from "react";
import SidebarComp from "@/components/Sidebar";
import { Outlet } from "react-router";

const TutorLayout = () => {
  return (
    <div className="flex flex-col justify-center ">
      <div className="">
        <SidebarComp>
          <div className="mt-3 p-3 ">
            <Outlet />
            {/* <NavBar className="" /> */}
          </div>
        </SidebarComp>
      </div>
    </div>
  );
};

export default TutorLayout;
