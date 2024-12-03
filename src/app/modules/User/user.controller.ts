import { Request, Response } from "express";
import { userService } from "./user.service";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createAdmin(req);

  sendResponse(res, {
    message: "Admin Created Successfully",
    data: result,
  });
});

const createVendor = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createVendor(req);

  sendResponse(res, {
    message: "Vendor Created Successfully",
    data: result,
  });
});

const createCustomer = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createCustomer(req);

  sendResponse(res, {
    message: "Customer Created Successfully",
    data: result,
  });
});

const changeProfileStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.changeProfileStatus(req.params.id, req.body);

  sendResponse(res, {
    message: "User Profile Status Successfully",
    data: result,
  });
});

export const userController = {
  createAdmin,
  createVendor,
  createCustomer,
  changeProfileStatus,
};
