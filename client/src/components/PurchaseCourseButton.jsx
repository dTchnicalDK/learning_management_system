import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useParams } from "react-router";
import { toast } from "sonner";
import axios from "axios";
import { Key } from "lucide-react";
import { useSelector } from "react-redux";
import PaymentConfirmation from "@/pages/student/PaymentConfirmationPage";

const PurchaseCourseButton = () => {
  const { courseId } = useParams();
  // console.log("courseId", courseId);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [paymentDetails, setPaymentDetails] = useState(null);
  // console.log("user", user);

  //loading razorpay script
  const loadScript = (src) => {
    new Promise((resolve) => {
      const existing = document.querySelector(`script[src="${src}]`);
      if (existing) {
        return resolve(true);
      }
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  //calling razorpay script after being loaded
  useEffect(() => {
    loadScript("https://checkout.razorpay.com/v1/checkout.js");
  }, []);

  //onClick buy button
  const handleCourseBuy = async () => {
    try {
      //creating order
      const res = await axios.post(
        "http://localhost:3000/api/v1/payment/create-oreder",
        { courseId }
      );

      const order = res.data.data;

      //actually making payment and then verifying
      const paymentObject = new window.Razorpay({
        key: "rzp_test_Rfv46ZpkiT208X",
        order_id: order.id,
        ...order,
        handler: async (response) => {
          const option2 = {
            order_id: response.razorpay_order_id,
            payment_id: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            courseId,
            userId: user._id,
          };

          const verifyPayment = await axios
            .post("http://localhost:3000/api/v1/payment/verify-order", option2)
            .then((res) => {
              console.log("paydetails", res);
              if (res.status === 200) {
                setPaymentDetails(res.data.paymentDetails);
                alert("payment successfull ");
              } else {
                alert("payment un-successfull ! ");
              }
            })
            .catch((errr) => console.log("payment verification failed", errr));
        },
      });
      paymentObject.open();
      // console.log("payment details", verifyPayment);
    } catch (error) {
      console.log("course buy erro", error);
      toast.error(error.message || error.data.message || "course buy error");
    }
  };
  return (
    <div>
      <Button
        onClick={handleCourseBuy}
        variant="default"
        className="text-xl my-2 cursor-pointer"
      >
        Buy Course Now
      </Button>
      {paymentDetails && <PaymentConfirmation payment={paymentDetails} />}
    </div>
  );
};

export default PurchaseCourseButton;
