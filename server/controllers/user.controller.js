import { User } from "../models/user.models.js";
import bcrypt from "bcryptjs";
import createToken from "../helper/createToken.js";
import fs from "fs/promises";
import {
  deleteMediaFromCloudinary,
  uploadToMediaCloudinary,
} from "../utility/coudinary.js";

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
    // console.log("token", token);

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
// export const editProfile = async (req, res) => {
//   try {
//     const { userId } = req;
//     const { userName } = req.body;
//     const profilePhoto = req.file;

//     //assuring the user exits
//     const user = await User.findById({ _id: userId }).select("-password");
//     if (!user) {
//       if (profilePhoto && profilePhoto.path) {
//         await fs
//           .unlink(profilePhoto.path)
//           .catch((err) => console.error("Error deleting temp file:", err));
//       }
//       return res.status(404).json({ message: "id does not exits!" });
//     }

//     //uploading to cloudinary
//     let fileUrl;
//     if (profilePhoto) {
//       fileUrl = await uploadToMediaCloudinary(profilePhoto.path);
//       console.log("fileUrl", fileUrl);
//       const publicId = user.photoURL?.split("/").pop().split(".")[0]; // extract public id
//       console.log("publicId", publicId);
//       if (publicId) {
//         await deleteMediaFromCloudinary(publicId);
//       }
//       // Delete the temporary file uploaded by multer
//       if (profilePhoto && profilePhoto.path) {
//         await fs
//           .unlink(profilePhoto.path)
//           .catch((err) => console.error("Error deleting temp file:", err));
//       }
//     }

//     //actually updating user
//     const updateUser = await User.findByIdAndUpdate(
//       userId,
//       {
//         userName,
//         photoURL: fileUrl,
//       },
//       { new: true }
//     ).select("-password");
//     return res
//       .status(201)
//       .json({ message: "profile updated successfully", user: updateUser });
//   } catch (error) {
//     res.status(500).json({ message: error.message || "internal server error" });
//   }
// };

//////////////edit profile///////////

export const editProfile = async (req, res) => {
  const { userId } = req;
  const { userName } = req.body;
  const { file } = req;

  if (!userId) {
    return res
      .status(401)
      .json({ message: "Unauthorized: User not identified." });
  }

  try {
    const updateData = {};
    if (userName) {
      updateData.userName = userName;
    }

    // Find the user first to get the old photo URL and public ID
    const user = await User.findById(userId);
    if (!user) {
      if (file && file.path) {
        await fs
          .unlink(file.path)
          .catch((err) => console.error("Error deleting temp file:", err));
      }
      return res.status(404).json({ message: "User not found." });
    }

    // Extract the public ID of the OLD photo if it exists
    let oldPublicId;
    if (user.photoURL) {
      const parts = user.photoURL.split("/upload/");
      if (parts.length > 1) {
        const publicIdWithExtension = parts.pop().split("/").slice(1).join("/");
        oldPublicId = publicIdWithExtension.split(".")[0];
      }
    }

    // If a new file was uploaded
    if (file) {
      // Upload the new file first
      const uploadResult = await uploadToMediaCloudinary(file.path, {
        folder: "LMS/profilePhoto", // Upload to the correct folder
      });
      updateData.photoURL = uploadResult.secure_url;

      // Now that the upload is successful, delete the old file
      if (oldPublicId) {
        await deleteMediaFromCloudinary(oldPublicId).catch((err) =>
          console.error("Cloudinary deletion failed:", err)
        );
      }

      // Delete the local temp file after the Cloudinary upload is complete
      await fs
        .unlink(file.path)
        .catch((err) => console.error("Error deleting temp file:", err));
    }

    // Perform a single database update
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password");

    if (!updatedUser) {
      return res
        .status(404)
        .json({ message: "User not found after update attempt." });
    }

    return res.status(200).json({
      message: "Profile updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
