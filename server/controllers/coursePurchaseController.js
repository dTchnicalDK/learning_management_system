import { Course } from "../models/course.model.js";
import createRazorpayInstance from "../utility/razorpay.config.js";
import crypto from "crypto";
const razorpayInstance = createRazorpayInstance();
import { User } from "../models/user.models.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";

///////creating order throgh razor pay///////
export const createOrder = async (req, res) => {
  const { courseId } = req.body;
  // console.log("courseid", courseId);

  try {
    //fetching course details
    if (!courseId) {
      return res
        .status(400)
        .json({ message: "courseid is compulsary to buy course" });
    }
    const courseToBuy = await Course.findById(courseId);
    // console.log("fetched courseToBuy", courseToBuy.coursePrice * 100);
    const optionsOrderCreation = {
      amount: courseToBuy.coursePrice * 100,
      currency: "INR",
      receipt: `receipt_order_1`,
    };
    //creating order
    const createdOrder = await razorpayInstance.orders.create(
      optionsOrderCreation
    );
    // console.log("createdOrder", createdOrder);
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
  const { order_id, payment_id, signature, courseId, userId } = req.body;
  // console.log("reqBody", order_id, payment_id, signature);

  try {
    if (!order_id || !payment_id || !signature || !courseId || !userId) {
      return res.status(400).json({
        message: "order, paymentid and signature needed !",
        success: false,
      });
    }
    //creating hmac object to verify order
    const hmac = crypto.createHmac("sha256", process.env.RAZOR_SECRET);
    hmac.update(order_id + "|" + payment_id);
    const generatedSignature = hmac.digest("hex");
    // console.log("generatedSignature", generatedSignature);
    //checking is valid order or not
    if (generatedSignature !== signature) {
      return res.status(400).json({
        message: "Invalid signature - verification failed",
        success: false,
      });
    }
    //updating database accodingly-----------------

    // fetch payment details from Razorpay (optional but recommended)
    const payment = await razorpayInstance.payments.fetch(payment_id);
    console.log("fetched payment details:", payment);

    // find course & user (for storing references)
    const course = courseId ? await Course.findById(courseId) : null;
    const user = userId ? await User.findById(userId) : null;

    // create a unique receipt number
    // const receiptNumber = makeReceiptNumber();

    // save purchase to DB (amount from payment.amount is in paise when using Razorpay)
    const purchaseDoc = await CoursePurchase.create({
      course: course ? course._id : courseId,
      userId: user ? user._id : userId,
      amount: payment.amount, // store amount in smallest currency unit (paise)
      status:
        payment.status === "captured" || payment.status === "authorized"
          ? "completed"
          : "pending",
      paymentId: payment.id,
      // optionally add a receiptNumber field if you extend schema or store it elsewhere
    });

    // OPTIONAL: update Course to add student / increment enrollments
    if (course) {
      // example: add to students array if you have one
      if (!course.students) course.students = [];
      // avoid duplicates
      if (!course.students.includes(purchaseDoc.userId)) {
        course.students.push(purchaseDoc.userId);
        await course.save();
      }
    }

    // OPTIONAL: update User to add course to purchased list
    if (user) {
      if (!user.purchasedCourses) user.purchasedCourses = [];
      if (!user.purchasedCourses.includes(purchaseDoc.course)) {
        user.purchasedCourses.push(purchaseDoc.course);
        await user.save();
      }
    }

    // --------------------------------------
    return res.status(200).json({
      message: "payment verified successfully",
      success: true,
      paymentDetails: payment,
    });
  } catch (error) {
    console.log("order verifying error", error);
    res.status(500).json({
      message: error.message || "internal server error verifying oreder!",
      success: false,
    });
  }
};
