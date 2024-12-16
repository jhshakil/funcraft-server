import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { OrderServices } from "./order.service";
import { sendResponse } from "../../../shared/sendResponse";
import { pick } from "../../../shared/pick";
import { orderFilterableFields } from "./order.constant";
import { paginationField } from "../../constant/paginationField";

const getAllOrder = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, orderFilterableFields);
  const options = pick(req.query, paginationField);
  const result = await OrderServices.getAllOrder(filters, options);

  sendResponse(res, {
    message: "Orders Get successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getAllOrderByShop = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, orderFilterableFields);
  const options = pick(req.query, paginationField);
  const result = await OrderServices.getAllOrderByShop(
    filters,
    options,
    req.params.id
  );

  sendResponse(res, {
    message: "Orders Get successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getAllOrderByCustomer = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, orderFilterableFields);
    const options = pick(req.query, paginationField);
    const result = await OrderServices.getAllOrderByCustomer(
      filters,
      options,
      req.params.id
    );

    sendResponse(res, {
      message: "Orders Get successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderServices.createOrder(req.body);

  sendResponse(res, {
    message: "Order Create Successfully",
    data: result,
  });
});

const updateOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderServices.updateOrder(req.params.id, req.body);

  sendResponse(res, {
    message: "Order Update Successfully",
    data: result,
  });
});

const cancelOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderServices.CancelOrder(req.params.id);

  sendResponse(res, {
    message: "Order Cancel Successfully",
    data: result,
  });
});

export const OrderControllers = {
  getAllOrder,
  getAllOrderByShop,
  getAllOrderByCustomer,
  createOrder,
  updateOrder,
  cancelOrder,
};
