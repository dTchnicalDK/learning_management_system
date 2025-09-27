import { User } from "../models/user.models.js";
import bcrypt from "bcryptjs";
import createToken from "../helper/createToken.js";

///////////////Register User//////////
export const registerUser = async (req, res) => {
  //   console.log("route hit");
  const { userName, email, password } = req.body;
  //   console.log("received data", userName, email, password);

  try {
    if (!userName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All field are mandatory",
      });
    }
    const isUserAlreadyRegistered = await User.findOne({ email });
    if (isUserAlreadyRegistered) {
      return res.status(400).json({
        success: false,
        message: "email is already registered, Login now!",
      });
    }
    const hashedPasssword = await bcrypt.hash(password, 12);

    // console.log("hashed password", hashedPasssword);
    const createdUser = await User.create({
      userName,
      email,
      password: hashedPasssword,
    });

    res.status(200).json({
      success: true,
      message: "user created successfully!",
    });
  } catch (error) {
    console.log("user registration error", error);
    res.status(500).json({
      success: false,
      message: error.message || "registration server error!",
    });
  }
};

///////////////////Login user/////////////////////
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Fill all the fields!",
      });
    }
    const isUserRegistered = await User.findOne({ email });
    if (!isUserRegistered) {
      return res.status(400).json({
        success: false,
        message: "Wrong credentials, check email or password!",
      });
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      isUserRegistered.password
    );
    // console.log("isPasswordMatch", isPasswordMatch);

    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Wrong credentials, check email or password!",
      });
    }
    const sanitizedUser = isUserRegistered.toObject();
    delete sanitizedUser.password;
    const token = createToken(sanitizedUser);

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        success: true,
        message: "user login successful",
        user: sanitizedUser,
      });
  } catch (error) {
    console.log("user login error", error);
    res.status(500).json({
      success: false,
      message: error.message || "login server error!",
    });
  }
};
