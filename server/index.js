import express, { urlencoded } from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDb from "./db/connectDb.js";
import userRouter from "./routes/user.router.js";
import tutorRouter from "./routes/course.routes.js";
import mediaRouter from "./routes/media.routes.js";
import paymentRouter from "./routes/payment.routes.js";

const app = express();
const port = process.env.PORT || 4000;
// console.log("port", port);

//default middlewares
app.use(
  cors({
    origin: process.env.FRONTENED_URL || `http://localhost:5173`,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//middlewares

//api routes
app.use("/api/v1/media", mediaRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/tutor", tutorRouter);
app.use("/api/v1/payment", paymentRouter);

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
