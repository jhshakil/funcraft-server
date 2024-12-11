import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { ProductServices } from "./product.service";
import { sendResponse } from "../../../shared/sendResponse";
import { pick } from "../../../shared/pick";
import { productFilterableFields } from "./product.constant";
import { paginationField } from "../../constant/paginationField";

const getAllProduct = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, productFilterableFields);
  const options = pick(req.query, paginationField);
  const result = await ProductServices.getAllProduct(filters, options);

  sendResponse(res, {
    message: "Products Get successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getAllProductByVendor = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, productFilterableFields);
    const options = pick(req.query, paginationField);
    const result = await ProductServices.getAllProductByVendor(
      filters,
      options,
      req.params.shopId
    );

    sendResponse(res, {
      message: "Products Get successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

const getProductById = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductServices.getProductById(req.params.id);

  sendResponse(res, {
    message: "Product Get Successfully",
    data: result,
  });
});

const createProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductServices.createProduct(req.body);

  sendResponse(res, {
    message: "Product Create Successfully",
    data: result,
  });
});

const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductServices.updateProduct(req.params.id, req.body);

  sendResponse(res, {
    message: "Product Update Successfully",
    data: result,
  });
});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductServices.deleteProduct(req.params.id);

  sendResponse(res, {
    message: "Product Update Successfully",
    data: result,
  });
});

export const ProductControllers = {
  getAllProduct,
  getAllProductByVendor,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
