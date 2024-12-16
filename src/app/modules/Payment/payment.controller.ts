import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { PaymentServices } from "./payment.service";
import { TAuthUser } from "../../interfaces/common";
import { sendResponse } from "../../../shared/sendResponse";

export const makePayment = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const result = await PaymentServices.makePayment(
      req.body.orderId,
      req.user as TAuthUser
    );

    sendResponse(res, {
      message: "payment proceed",
      data: result,
    });
  }
);

const confirmPayment = catchAsync(async (req: Request, res: Response) => {
  const { transactionId, orderId } = req.query;
  const result = await PaymentServices.confirmPayment(
    transactionId as string,
    orderId as string
  );

  res.send(result);
});

export const PaymentControllers = {
  makePayment,
  confirmPayment,
};
