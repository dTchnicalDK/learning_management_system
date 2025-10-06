import { User } from "../models/user.models.js";
import bcrypt from "bcryptjs";
import createToken from "../helper/createToken.js";
import { uploadToMediaCloudinary } from "../utility/coudinary.js";

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
    const token = await createToken(sanitizedUser);
    console.log("token", token);

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

///////////////////signout user//////////////////
export const signoutUser = async (req, res) => {
  try {
    res
      .cookie("token", "", { maxAge: 0 })
      .status(200)
      .json({ message: "user loggesd out successfully", success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to logout" });
  }
};

///////////////////Get User By Id /////////////////////
export const getUserById = async (req, res) => {
  const id = req.userId;

  try {
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "id is must to get user!" });
    }
    const fetchedUser = await User.findById(id).select("-password");
    if (!fetchedUser) {
      return res
        .status(404)
        .json({ success: false, message: "user not registered!" });
    }
    return res
      .status(200)
      .json({ success: true, message: "user fetched!", user: fetchedUser });
  } catch (error) {
    console.log("getUserById error", error);
    res.status(500).json({
      success: false,
      message: error.message || "something went wrong!",
    });
  }
};

///////////////////Get all user/////////////////////
export const getAllUsers = async (req, res) => {
  try {
    const fetchedAllUser = await User.find();

    return res
      .status(200)
      .json({ success: true, message: "user fetched!", user: fetchedAllUser });
  } catch (error) {
    console.log("getUserById error", error);
    res.status(500).json({
      success: false,
      message: error.message || "something went wrong!",
    });
  }
};

//////////////////edit Profile////////////////////////
export const editProfile = async (req, res) => {
  try {
    const id = req.userId;
    const user = await User.findById({ id });
    if (!user) {
      return res.status(404).json({ message: "id does not exits!" });
    }
    const { userName } = req.formData;
    const file = req.file;
    console.log("file in request", file);

    const fileUrl = uploadToMediaCloudinary(file.path);

    const updatedData = await User.findByIdAndUpdate({
      userName,
      photoURL: fileUrl,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "internal server error" });
  }
};
