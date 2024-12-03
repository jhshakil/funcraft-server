import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { CategoryControllers } from "./category.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { CategoryValidations } from "./category.validation";

const router = Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  CategoryControllers.getAllCategory
);
router.get(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  CategoryControllers.getCategoryById
);
router.post(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(CategoryValidations.createCategory),
  CategoryControllers.createCategory
);
router.patch(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(CategoryValidations.updateCategory),
  CategoryControllers.updateCategory
);
router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  CategoryControllers.deleteCategory
);

export const CategoryRoutes = router;
