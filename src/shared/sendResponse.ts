import { Response } from "express";
import { StatusCodes } from "http-status-codes";

export const sendResponse = <T>(
  res: Response,
  jsonData: {
    statusCode?: number;
    success?: boolean;
    message: string;
    meta?: {
      page: number;
      limit: number;
      total: number;
    };
    data: T | null | undefined;
  }
) => {
  res.status(jsonData.statusCode ?? StatusCodes.OK).json({
    success: jsonData.success ?? true,
    message: jsonData.message,
    meta: jsonData.meta || null || undefined,
    data: jsonData.data || null || undefined,
  });
};
