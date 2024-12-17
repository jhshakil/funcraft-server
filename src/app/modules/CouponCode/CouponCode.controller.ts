import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { CouponCodeServices } from "./CouponCode.sercice";
import { sendResponse } from "../../../shared/sendResponse";
import { TAuthUser } from "../../interfaces/common";

const getAllCoupon = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const result = await CouponCodeServices.getAllCoupon(req.user as TAuthUser);

    sendResponse(res, {
      message: "Coupon Get Successfully",
      data: result,
    });
  }
);

const getCouponByCode = catchAsync(async (req: Request, res: Response) => {
  const result = await CouponCodeServices.getCouponByCode(req.body);

  sendResponse(res, {
    message: "Coupon Get Successfully",
    data: result,
  });
});
const createCoupon = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const result = await CouponCodeServices.createCoupon(
      req.body,
      req.user as TAuthUser
    );

    sendResponse(res, {
      message: "Coupon Created Successfully",
      data: result,
    });
  }
);

const deleteCoupon = catchAsync(async (req: Request, res: Response) => {
  const result = await CouponCodeServices.deleteCoupon(req.params.id);

  sendResponse(res, {
    message: "Coupon Delete Successfully",
    data: result,
  });
});

export const CouponCodeControllers = {
  getCouponByCode,
  getAllCoupon,
  createCoupon,
  deleteCoupon,
};
