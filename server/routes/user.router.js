import express from "express";
import upload from "../utility/multer.js";
import {
  editProfile,
  getAllUsers,
  getUserById,
  loginUser,
  registerUser,
  signoutUser,
} from "../controllers/user.controller.js";
import isUserAuthenticated from "../middlewares/isAuthenticated.js";
const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/logout", signoutUser);
userRouter.get("/userbyid", isUserAuthenticated, getUserById);
userRouter.get("/get-all-users", isUserAuthenticated, getAllUsers);
userRouter.put(
  "/update-user",
  isUserAuthenticated,
  upload.single("profilePhoto"),
  editProfile
);

export default userRouter;
