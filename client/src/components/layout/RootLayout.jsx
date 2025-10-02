import React from "react";
import NavBar from "../NavBar";
import { Outlet } from "react-router";

const RootLayout = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <NavBar />
      <div className="mt-12 md:mt-15 flex justify-center items-center">
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;
