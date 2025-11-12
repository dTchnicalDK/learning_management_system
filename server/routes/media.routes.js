import express from "express";
import { generateSign } from "../utility/coudinary.js";
const mediaRouter = express.Router();

////routes----------------
mediaRouter.get("/signature", generateSign);

export default mediaRouter;
