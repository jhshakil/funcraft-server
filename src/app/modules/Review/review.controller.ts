import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { ReviewServices } from "./review.service";
import { sendResponse } from "../../../shared/sendResponse";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewServices.createReview(req.body);

  sendResponse(res, {
    message: "Review Create Successfully",
    data: result,
  });
});
const updateReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewServices.updateReview(req.params.id, req.body);

  sendResponse(res, {
    message: "Review Update Successfully",
    data: result,
  });
});
const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewServices.deleteReview(req.params.id);

  sendResponse(res, {
    message: "Review Delete Successfully",
    data: result,
  });
});

export const ReviewControllers = {
  createReview,
  updateReview,
  deleteReview,
};
