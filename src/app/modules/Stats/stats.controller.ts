import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { StatsServices } from "./stats.service";
import { sendResponse } from "../../../shared/sendResponse";

const getAllUserStats = catchAsync(async (req: Request, res: Response) => {
  const result = await StatsServices.userStats(req.params.id);

  sendResponse(res, {
    message: "User Stats Get Successfully",
    data: result,
  });
});

export const StatsControllers = {
  getAllUserStats,
};
