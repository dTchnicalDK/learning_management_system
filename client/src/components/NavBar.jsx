import { FaSchool } from "react-icons/fa";
import React, { useEffect } from "react";
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
import { Link, useNavigate } from "react-router";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { ThemeToggle } from "./DarkTheme";
import { useSelector } from "react-redux";
import { useLogOutUserMutation } from "@/features/api/authApi";
import { toast } from "sonner";

const NavBar = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [logOutUser, { data, isLoading, isSuccess, error }] =
    useLogOutUserMutation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOutUser();
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "something went wrong");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "loggedout");
    }
    if (error) {
      toast.error(error.data?.message || "logoutError");
    }
  }, [isSuccess, error]);

  return (
    <div>
      {/* ------------for pc--------------------------------- */}
      <div className="fixed bg-white dark:bg-stone-900 top-0 left-0 right-0 z-30 hidden md:flex justify-between items-center px-8 py-4 shadow-xl">
        <Link to="/">
          <div className="left font-bold text-2xl flex justify-center items-center gap-5">
            <FaSchool />
            <h1>Edu-Hub</h1>
          </div>
        </Link>
        <div className="right flex justify-center items-center gap-8">
          {isAuthenticated ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar className="cursor-pointer">
                    <AvatarImage
                      src={
                        user && user.photoURL
                          ? user.photoURL
                          : "https://github.com/shadcn.png"
                      }
                    />

                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link to="/student/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    {" "}
                    <Link to={"/student"}>courses</Link>{" "}
                  </DropdownMenuItem>
                  <DropdownMenuItem>settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex justify-between items-center"
                  >
                    Logout
                    <Button size="icon" variant="ghost">
                      {/* <div className="flex justify-center items-center gap-2"> */}
                      <LogOutIcon />
                      {/* </div> */}
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" className="cursor-pointer">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="cursor-pointer">SignUp</Button>
              </Link>
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
        <SheetContent aria-describedby={null}>
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
