import express, { urlencoded } from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDb from "./db/connectDb.js";
import userRouter from "./routes/user.router.js";

const app = express();
const port = process.env.PORT || 4000;

//default middlewares
app.use(
  cors({
    origin: process.env.FRONTENED_URL || ` http://localhost:${port}`,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//middlewares

//api routes
app.use("/api/v1/user", userRouter);

//root routes tesing purpose
app.use("/", (req, res, next) => {
  res.status(200).json({ success: true, message: "welcome to homepage" });
});

//connecting Db and starting server
connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log(` server started on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });
