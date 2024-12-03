import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { CategoryServices } from "./category.service";
import { sendResponse } from "../../../shared/sendResponse";

const getAllCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryServices.getAllCategory();

  sendResponse(res, {
    message: "Categories Get Successfully",
    data: result,
  });
});

const getCategoryById = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryServices.getCategoryById(req.params.id);

  sendResponse(res, {
    message: "Category Get Successfully",
    data: result,
  });
});

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryServices.createCategory(req.body);

  sendResponse(res, {
    message: "Category Created Successfully",
    data: result,
  });
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryServices.updateCategory(req.params.id, req.body);

  sendResponse(res, {
    message: "Category Update Successfully",
    data: result,
  });
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryServices.deleteCategory(req.params.id);

  sendResponse(res, {
    message: "Category Delete Successfully",
    data: result,
  });
});

export const CategoryControllers = {
  getAllCategory,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
