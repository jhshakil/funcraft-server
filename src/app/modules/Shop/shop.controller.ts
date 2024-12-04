import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { ShopServices } from "./shop.service";
import { sendResponse } from "../../../shared/sendResponse";
import { pick } from "../../../shared/pick";
import { paginationField } from "../../constant/paginationField";

const getAllShop = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, paginationField);
  const result = await ShopServices.getAllShop(req.query, options);

  sendResponse(res, {
    message: "Shops Get Successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getShopById = catchAsync(async (req: Request, res: Response) => {
  const result = await ShopServices.getShopById(req.params.id);

  sendResponse(res, {
    message: "Shop Get Successfully",
    data: result,
  });
});

const createShop = catchAsync(async (req: Request, res: Response) => {
  const result = await ShopServices.createShop(req);

  sendResponse(res, {
    message: "Shop Create Successfully",
    data: result,
  });
});

export const ShopControllers = {
  getAllShop,
  getShopById,
  createShop,
};