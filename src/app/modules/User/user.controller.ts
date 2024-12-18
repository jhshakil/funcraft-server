import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import { pick } from "../../../shared/pick";
import { userFilterableFields } from "./user.constant";
import { paginationField } from "../../constant/paginationField";
import { UserServices } from "./user.service";
import { TAuthUser } from "../../interfaces/common";

const getAllUser = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, paginationField);
  const result = await UserServices.getAllUser(filters, options);

  sendResponse(res, {
    message: "User data fetched!",
    meta: result.meta,
    data: result.data,
  });
});

const getUserById = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const result = await UserServices.getUserById(
      req.params.id,
      req.user as TAuthUser
    );

    sendResponse(res, {
      message: "User Get Successfully",
      data: result,
    });
  }
);

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.createAdmin(req.body);

  sendResponse(res, {
    message: "Admin Created Successfully",
    data: result,
  });
});

const createVendor = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.createVendor(req.body);

  sendResponse(res, {
    message: "Vendor Created Successfully",
    data: result,
  });
});

const createCustomer = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.createCustomer(req.body);

  sendResponse(res, {
    message: "Customer Created Successfully",
    data: result,
  });
});

const changeProfileStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.changeProfileStatus(
    req.params.id,
    req.body
  );

  sendResponse(res, {
    message: "User Profile Status Successfully",
    data: result,
  });
});
const updateUserProfile = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const result = await UserServices.updateUserProfile(
      req.body,
      req.user as TAuthUser
    );

    sendResponse(res, {
      message: "User Profile Update Successfully",
      data: result,
    });
  }
);

export const UserControllers = {
  getAllUser,
  getUserById,
  createAdmin,
  createVendor,
  createCustomer,
  changeProfileStatus,
  updateUserProfile,
};
