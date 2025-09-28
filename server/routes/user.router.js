import express from "express";
import {
  loginUser,
  registerUser,
  signoutUser,
} from "../controllers/user.controller.js";
const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/logout", signoutUser);

export default userRouter;
