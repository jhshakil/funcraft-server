import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

type TPaymentData = {
  transactionId: string;
  orderId: string;
  totalPrice: number;
  customerName?: string;
  customerEmail: string;
  customerPhone?: string;
};

export const initiatePayment = async (paymentData: TPaymentData) => {
  try {
    const response = await axios.post(process.env.PAYMENT_URL!, {
      store_id: process.env.STORE_ID,
      signature_key: process.env.SIGNETURE_KEY,
      tran_id: paymentData.transactionId,
      success_url: `${process.env.BACKEND_URL}/payment/confirmation?transactionId=${paymentData.transactionId}&orderId=${paymentData.orderId}`,
      fail_url: `${process.env.BACKEND_URL}/payment/confirmation`,
      cancel_url: process.env.FRONTEND_URL,
      amount: paymentData.totalPrice,
      currency: "BDT",
      desc: "Merchant Registration Payment",
      cus_name: paymentData?.customerName || "N/A",
      cus_email: paymentData?.customerEmail,
      cus_add1: "N/A",
      cus_add2: "N/A",
      cus_city: "N/A",
      cus_state: "N/A",
      cus_postcode: "N/A",
      cus_country: "N/A",
      cus_phone: paymentData.customerPhone || "N/A",
      type: "json",
    });

    return response.data;
  } catch (err) {
    throw new Error("Payment initiation failed!");
  }
};

export const verifyPayment = async (tnxId: string) => {
  try {
    const response = await axios.get(process.env.PAYMENT_VERIFY_URL!, {
      params: {
        store_id: process.env.STORE_ID,
        signature_key: process.env.SIGNETURE_KEY,
        type: "json",
        request_id: tnxId,
      },
    });

    return response.data;
  } catch (err: any) {
    throw new Error("Payment validation failed!");
  }
};
