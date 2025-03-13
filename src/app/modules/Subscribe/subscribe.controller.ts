import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { SubscribeServices } from "./subscribe.service";
import { sendResponse } from "../../../shared/sendResponse";

const createSubscribe = catchAsync(async (req: Request, res: Response) => {
  await SubscribeServices.createSubscribe(req.body);

  sendResponse(res, {
    message: "Subscribe Successfully",
    data: "",
  });
});

export const SubscribeControllers = {
  createSubscribe,
};
