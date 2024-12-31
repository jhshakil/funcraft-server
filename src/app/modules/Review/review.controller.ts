import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { ReviewServices } from "./review.service";
import { sendResponse } from "../../../shared/sendResponse";
import { paginationField } from "../../constant/paginationField";
import { pick } from "../../../shared/pick";

const getAllReview = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, paginationField);
  const result = await ReviewServices.getAllReview(options);

  sendResponse(res, {
    message: "Reviews Get Successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getAllUserReview = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, paginationField);
  const result = await ReviewServices.getAllUserReview(
    options,
    req.params.customerId
  );

  sendResponse(res, {
    message: "Reviews Get Successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getReviewByProductId = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewServices.getReviewByProductId(
    req?.query?.productId as string
  );

  sendResponse(res, {
    message: "Review Get Successfully",
    data: result,
  });
});

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

const checkForReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewServices.checkForReview(
    req?.query?.customerId as string,
    req?.query?.productId as string
  );

  sendResponse(res, {
    message: "Review check Successfully",
    data: `${result}`,
  });
});

export const ReviewControllers = {
  getAllReview,
  getAllUserReview,
  getReviewByProductId,
  createReview,
  updateReview,
  deleteReview,
  checkForReview,
};
