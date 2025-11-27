import razorpay from "razorpay";

const createRazorpayInstance = () => {
  console.log("key secret", process.env.RAZOR_KEY, process.env.RAZOR_SECRET);
  return new razorpay({
    key_id: process.env.RAZOR_KEY,
    key_secret: process.env.RAZOR_SECRET,
  });
};
export default createRazorpayInstance;
