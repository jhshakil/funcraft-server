import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { StatsServices } from "./stats.service";
import { sendResponse } from "../../../shared/sendResponse";

const getAllUserStats = catchAsync(async (req: Request, res: Response) => {
  const result = await StatsServices.userStats(req.params.id);

  sendResponse(res, {
    message: "Customer Stats Get Successfully",
    data: result,
  });
});

const getAllVendorStats = catchAsync(async (req: Request, res: Response) => {
  const result = await StatsServices.vendorStats(req.params.id);

  sendResponse(res, {
    message: "Vendor Stats Get Successfully",
    data: result,
  });
});

const getAllAdminStats = catchAsync(async (req: Request, res: Response) => {
  const result = await StatsServices.adminStats();

  sendResponse(res, {
    message: "Admin Stats Get Successfully",
    data: result,
  });
});

export const StatsControllers = {
  getAllUserStats,
  getAllVendorStats,
  getAllAdminStats,
};
