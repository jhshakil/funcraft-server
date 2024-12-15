import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { DeliveryAddressServices } from "./deliveryAddress.service";
import { sendResponse } from "../../../shared/sendResponse";

const getAddressById = catchAsync(async (req: Request, res: Response) => {
  const result = await DeliveryAddressServices.getAddressById(req.params.id);

  sendResponse(res, {
    message: "Address Get Successfully",
    data: result,
  });
});
const createDeliveryAddress = catchAsync(
  async (req: Request, res: Response) => {
    const result = await DeliveryAddressServices.createDeliveryAddress(
      req.body
    );

    sendResponse(res, {
      message: "Address Create Successfully",
      data: result,
    });
  }
);

const updateDeliveryAddress = catchAsync(
  async (req: Request, res: Response) => {
    const result = await DeliveryAddressServices.updateDeliveryAddress(
      req.params.id,
      req.body
    );

    sendResponse(res, {
      message: "Address Update Successfully",
      data: result,
    });
  }
);

export const DeliveryAddressControllers = {
  getAddressById,
  createDeliveryAddress,
  updateDeliveryAddress,
};
