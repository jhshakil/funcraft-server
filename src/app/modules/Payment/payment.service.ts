import { v4 } from "uuid";
import { join } from "path";
import { readFileSync } from "fs";
import { prisma } from "../../../shared/prisma";
import { initiatePayment, verifyPayment } from "../../../helpers/payment.utils";
import { TAuthUser } from "../../interfaces/common";

const makePayment = async (orderId: string, user: TAuthUser) => {
  const transactionId = `TXN-${v4()}`;
  const orderData = await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      transactionId: transactionId,
    },
  });

  const paymentData = {
    transactionId,
    orderId: orderData.id,
    totalPrice: Number(orderData.totalPrice),
    customerEmail: user?.email as string,
  };

  //payment
  const paymentSession = await initiatePayment(paymentData);

  return paymentSession;
};

const confirmPayment = async (transactionId: string, orderId: string) => {
  const verifyResponse = await verifyPayment(transactionId);

  let message = "";

  if (verifyResponse && verifyResponse.pay_status === "Successful") {
    await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        paymentStatus: "PAID",
      },
    });

    message = "Successfully Paid!";
  } else {
    message = "Payment Failed!";
  }

  const filePath = join(__dirname, "../../../../public/view/confirmation.html");
  let template = readFileSync(filePath, "utf-8");

  template = template.replace("{{message}}", message);

  return template;
};

export const PaymentServices = {
  makePayment,
  confirmPayment,
};
