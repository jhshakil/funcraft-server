import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { AuthServices } from "./auth.service";
import { sendResponse } from "../../../shared/sendResponse";
import { TAuthUser } from "../../interfaces/common";

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.loginUser(req.body);

  const { refreshToken } = result;

  res.cookie("refreshToken", refreshToken, {
    secure: false,
    httpOnly: true,
  });

  sendResponse(res, {
    message: "Logged in successfully!",
    data: {
      accessToken: result.accessToken,
    },
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const result = await AuthServices.refreshToken(refreshToken);

  sendResponse(res, {
    message: "Logged in successfully!",
    data: result,
  });
});

const changePassword = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    await AuthServices.changePassword(req.user, req.body);

    sendResponse(res, {
      message: "Password change successfully",
      data: "",
    });
  }
);

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  await AuthServices.forgotPassword(req.body);

  sendResponse(res, {
    message: "Check your email",
    data: "",
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization || "";
  await AuthServices.resetPassword(token, req.body);

  sendResponse(res, {
    message: "Password reset successfully",
    data: "",
  });
});

export const AuthController = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
