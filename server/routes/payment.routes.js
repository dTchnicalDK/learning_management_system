import express from "express";
import {
  createOrder,
  verifyOrder,
} from "../controllers/coursePurchaseController.js";
const paymentRouter = express.Router();

paymentRouter.post("/create-oreder", createOrder);
paymentRouter.post("/verify-order", verifyOrder);

export default paymentRouter;
