import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";

const loginInitials = {
  email: "",
  password: "",
};
const singupInitials = {
  email: "",
  password: "",
  repassword: "",
};

const LoginPage = () => {
  const [loginFields, setLoginFields] = useState(loginInitials);
  const [signupFields, setSignupFields] = useState(singupInitials);
  const [isPasswordMatching, setIsPasswordMatching] = useState(true);

  const handleChange = (e, changeFor) => {
    if (changeFor === "forlogin") {
      setLoginFields({ ...loginFields, [e.target.name]: e.target.value });
      //   console.log("login change detected", loginFields);
    } else {
      setSignupFields({ ...signupFields, [e.target.name]: e.target.value });
      //   console.log("login change detected", signupFields);
    }
  };
  const handleSubmit = (e, submitValue) => {
    e.preventDefault();
    setIsPasswordMatching(true);
    if (submitValue === "submitLogin") {
      console.log("data", loginFields);
    } else {
      if (signupFields.password !== signupFields.repassword) {
        setIsPasswordMatching(false);
        return console.log("password not match");
      }
      console.log("data", signupFields);
    }
  };
  return (
    <div>
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sing Up</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <div className="login-form h-[60vh] flex flex-col justify-around gap-5">
            <h1 className="text-center">Login here</h1>
            <form>
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
          <div className="sign-up-form h-[60vh] flex flex-col justify-around gap-5">
            <h1 className="text-center">Sing up here</h1>
            <form>
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
