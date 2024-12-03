import { NextFunction, Request, Response } from "express";
import { userService } from "./user.service";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import { pick } from "../../../shared/pick";
import { userFilterableFields } from "./user.constant";
import { TAuthUser } from "../../interfaces/common";
import { paginationField } from "../../constant/paginationField";

const createAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.createAdmin(req);

    res.status(200).json({
      success: true,
      message: "Admin Created Successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.name || "Something went wrong",
      error,
    });
  }
};

const changeProfileStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.changeProfileStatus(req.params.id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User Profile Status Successfully",
    data: result,
  });
});

export const userController = {
  createAdmin,
  changeProfileStatus,
};
