import { Course } from "../models/course.model.js";
import createRazorpayInstance from "../utility/razorpay.config.js";
import crypto from "crypto";
const razorpayInstance = createRazorpayInstance();

///////creating order throgh razor pay///////
export const createOrder = async (req, res) => {
  const { courseId } = req.body;
  console.log("courseid", courseId);

  try {
    //fetching course details
    if (!courseId) {
      return res
        .status(400)
        .json({ message: "courseid is compulsary to buy course" });
    }
    const courseToBuy = await Course.findById(courseId);
    console.log("fetched courseToBuy", courseToBuy.coursePrice * 100);
    const optionsOrderCreation = {
      amount: courseToBuy.coursePrice * 100,
      currency: "INR",
      receipt: `receipt_order_1`,
    };
    //creating order
    const createdOrder = await razorpayInstance.orders.create(
      optionsOrderCreation
    );
    console.log("createdOrder", createdOrder);
    return res
      .status(200)
      .json({ message: "order created !", success: true, data: createdOrder });
  } catch (error) {
    console.log("order creatin error", error);
    res.status(500).json({
      message: error.message || "internal server error creating oreder!",
      success: false,
    });
  }
};

///////veryfing order throgh razor pay///////
export const verifyOrder = async (req, res) => {
  const { order_id, payment_id, signature } = req.body;
  console.log("reqBody", order_id, payment_id, signature);

  try {
    if (!order_id || !payment_id || !signature) {
      return res.status(400).json({
        message: "order, paymentid and signature needed !",
        success: false,
      });
    }
    //creating hmac object to verify order
    const hmac = crypto.createHmac("sha256", process.env.RAZOR_SECRET);
    hmac.update(order_id + "|" + payment_id);
    const generatedSignature = hmac.digest("hex");
    console.log("generatedSignature", generatedSignature);
    //checking is valid order or not
    if (generatedSignature === signature) {
      console.log("payment verification successfull");
    }
    //needed update database accodingly
    return res
      .status(200)
      .json({ message: "payment verified successfully", success: true });
  } catch (error) {
    console.log("order verifying error", error);
    res.status(500).json({
      message: error.message || "internal server error verifying oreder!",
      success: false,
    });
  }
};
