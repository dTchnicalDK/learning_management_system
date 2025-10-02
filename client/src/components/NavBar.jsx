import { FaSchool } from "react-icons/fa";
import React from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LogOutIcon, MenuIcon, Moon, Sun } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Link } from "react-router";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { ThemeToggle } from "./DarkTheme";

const NavBar = () => {
  const isLoggedIn = true;
  return (
    <div>
      {/* ------------for pc--------------------------------- */}
      <div className="fixed bg-white dark:bg-stone-900 top-0 left-0 right-0 z-30 hidden md:flex justify-between items-center px-8 py-4 shadow-xl">
        <div className="left font-bold text-2xl flex justify-center items-center gap-5">
          <FaSchool />
          <h1>Edu-Hub</h1>
        </div>
        <div className="right flex justify-center items-center gap-8">
          {isLoggedIn ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>courses</DropdownMenuItem>
                  <DropdownMenuItem>settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex justify-between items-center">
                    Logout
                    <Button size="icon" variant="ghost">
                      <LogOutIcon />
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="outline" className="cursor-pointer">
                Login
              </Button>
              <Button className="cursor-pointer">SignUp</Button>
            </>
          )}
          <ThemeToggle />
        </div>
      </div>
      <div className="absolute left-3 top-0 md:hidden">
        <MobileNavBar />
      </div>
    </div>
  );
};

const MobileNavBar = () => {
  return (
    <div className="fixed z-30 top-0 left-0 right-0 bg-white dark:bg-stone-900 h-14 flex justify-between items-center gap-5 px-3 py-2 ">
      <div className="left w-3/6 flex justify-start gap-2 items-center text-2xl">
        <FaSchool />
        <h1 className=" font-bold">Edu-Hub</h1>
      </div>

      <Sheet>
        <SheetTrigger>
          <MenuIcon />
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle asChild>
              <div className="flex justify-start items-center gap-10">
                <div className="flex justify-start items-center gap-2 font-bold text-2xl">
                  <FaSchool />
                  <Link>
                    <h1>Edu-Hub</h1>
                  </Link>
                </div>
                <ThemeToggle />
              </div>
            </SheetTitle>
          </SheetHeader>
          <Separator />
          <nav className="px-5 flex flex-col gap-2 ">
            <Link> Edit profile</Link>
            <Link> My Leargings</Link>
            <Button className="cursor-pointer">LogOut</Button>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default NavBar;
