import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { ShopServices } from "./shop.service";
import { sendResponse } from "../../../shared/sendResponse";
import { pick } from "../../../shared/pick";
import { paginationField } from "../../constant/paginationField";
import { TAuthUser } from "../../interfaces/common";

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

const createShop = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const result = await ShopServices.createShop(
      req.body,
      req.user as TAuthUser
    );

    sendResponse(res, {
      message: "Shop Create Successfully",
      data: result,
    });
  }
);

const updateShop = catchAsync(async (req: Request, res: Response) => {
  const result = await ShopServices.updateShop(req.params.id, req.body);

  sendResponse(res, {
    message: "Shop Update Successfully",
    data: result,
  });
});

const deleteShop = catchAsync(async (req: Request, res: Response) => {
  const result = await ShopServices.deleteShop(req.params.id);

  sendResponse(res, {
    message: "Shop Delete Successfully",
    data: result,
  });
});

const updateStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await ShopServices.updateStatus(req.params.id, req.body);

  sendResponse(res, {
    message: "Shop Status Update Successfully",
    data: result,
  });
});

const updateBanner = catchAsync(async (req: Request, res: Response) => {
  const result = await ShopServices.updateBanner(req.params.id, req.body);

  sendResponse(res, {
    message: "Shop Banner Update Successfully",
    data: result,
  });
});

export const ShopControllers = {
  getAllShop,
  getShopById,
  createShop,
  updateShop,
  deleteShop,
  updateStatus,
  updateBanner,
};
