import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useLoginUserMutation,
  useRegisterUserMutation,
} from "@/features/api/authApi";
import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const loginInitials = {
  email: "",
  password: "",
};
const signupInitials = {
  userName: "",
  email: "",
  password: "",
  repassword: "",
};

const LoginPage = () => {
  const [loginFields, setLoginFields] = useState(loginInitials);
  const [signupFields, setSignupFields] = useState(signupInitials);
  const [isPasswordMatching, setIsPasswordMatching] = useState(true);
  const [
    registerUser,
    {
      data: registerData,
      error: registerError,
      isLoading: registerLoading,
      isSuccess: registerSuccess,
    },
  ] = useRegisterUserMutation();
  const [
    loginUser,
    {
      data: loginData,
      error: loginError,
      isLoading: loginLoading,
      isSuccess: loginSuccess,
    },
  ] = useLoginUserMutation();

  const handleChange = (e, changeFor) => {
    if (changeFor === "forlogin") {
      setLoginFields({ ...loginFields, [e.target.name]: e.target.value });
      //   console.log("login change detected", loginFields);
    } else {
      setSignupFields({ ...signupFields, [e.target.name]: e.target.value });
      //   console.log("login change detected", signupFields);
    }
  };

  const handleSubmit = async (e, submitValue) => {
    e.preventDefault();
    // setIsPasswordMatching(true);
    const inputData =
      submitValue === "submitLogin" ? loginFields : signupFields;

    //checking if password and repassword is the same
    if (submitValue === "submitSignup") {
      setIsPasswordMatching(true);
      if (signupFields.password !== signupFields.repassword) {
        return setIsPasswordMatching(false);
      }
    }
    const action = submitValue === "submitLogin" ? loginUser : registerUser;
    try {
      const response = await action(inputData).unwrap();
      console.log("data", response);
    } catch (error) {
      console.log("handle submit error", error);
    }
  };
  // toating Message
  useEffect(() => {
    if (registerSuccess && registerData) {
      toast.success(registerData.message || "Signup successful custom");
    }
    if (registerError) {
      console.log("error obj", JSON.stringify(registerError));
      toast.error(registerError.data?.message || "custom Signup Failed");
    }
    if (loginSuccess && loginData) {
      toast.success(loginData.message || "custom login success");
    }
    if (loginError) {
      toast.error(loginError.data?.message || "login failed");
    }
  }, [
    registerSuccess,
    registerData,
    registerError,
    loginSuccess,
    loginData,
    loginError,
  ]);

  return (
    <div className="h-[60vh]">
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sing Up</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <div>
            <h1 className="text-center">Login here</h1>
            <form className="login-form flex flex-col justify-around h-[40vh]  gap-5">
              <div className="grid w-full max-w-sm items-center gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={loginFields.email}
                  onChange={(e) => {
                    handleChange(e, "forlogin");
                  }}
                  required
                  placeholder="Email"
                />
              </div>
              <div className="grid w-full max-w-sm items-center gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  name="password"
                  value={loginFields.password}
                  onChange={(e) => {
                    handleChange(e, "forlogin");
                  }}
                  required
                  placeholder="your password"
                />
              </div>
              <p className="text-center">
                Yet not Signed Up, <span>singup now</span>
              </p>
              <Button
                onClick={(e) => {
                  handleSubmit(e, "submitLogin");
                }}
                size="sm"
              >
                {/* <Loader2Icon className="animate-spin" /> */}
                Login now
              </Button>
            </form>
          </div>
        </TabsContent>
        {/* -------------------------------------sign up---------------------- */}
        <TabsContent value="signup">
          <div>
            <h1 className="text-center">Sing up here</h1>
            <form className="sign-up-form h-[40vh] flex flex-col justify-around gap-5">
              <div className="grid w-full max-w-sm items-center gap-3">
                <Label htmlFor="userName">username</Label>
                <Input
                  type="text"
                  name="userName"
                  value={signupFields.userName}
                  onChange={(e) => {
                    handleChange(e, "forSignup");
                  }}
                  required
                  placeholder="userName"
                />
              </div>
              <div className="grid w-full max-w-sm items-center gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={signupFields.email}
                  onChange={(e) => {
                    handleChange(e, "forSignup");
                  }}
                  required
                  placeholder="Email"
                />
              </div>
              <div className="grid w-full max-w-sm items-center gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  name="password"
                  value={signupFields.password}
                  onChange={(e) => {
                    handleChange(e, "forSignup");
                  }}
                  required
                  placeholder="your password"
                />
              </div>
              <div className="grid w-full max-w-sm items-center gap-3">
                <Label htmlFor="repassword">Re-type your password </Label>
                <Input
                  type="password"
                  name="repassword"
                  value={signupFields.repassword}
                  onChange={(e) => {
                    handleChange(e, "forSignup");
                  }}
                  required
                  placeholder="type your same password again"
                />
                <small
                  className={`${
                    isPasswordMatching ? "hidden" : "block"
                  } text-red-500`}
                >
                  {" "}
                  password don't match!
                </small>
              </div>
              <p className="text-center">
                Already a Member, <span>login here</span>
              </p>
              <Button
                onClick={(e) => {
                  handleSubmit(e, "submitSignup");
                }}
                size="sm"
              >
                {/* <Loader2Icon className="animate-spin" /> */}
                SignUp Now
              </Button>
            </form>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LoginPage;
