import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { ProductControllers } from "./product.controller";
import { ProductValidations } from "./product.validation";
import { validateRequest } from "../../middlewares/validateRequest";

const router = Router();

router.get("/", ProductControllers.getAllProduct);
router.get("/shop/:id", ProductControllers.getAllProductByVendor);
router.get("/:id", ProductControllers.getProductById);
router.post(
  "/",
  auth(UserRole.VENDOR),
  validateRequest(ProductValidations.createProduct),
  ProductControllers.createProduct
);
router.patch(
  "/:id",
  auth(UserRole.VENDOR),
  validateRequest(ProductValidations.updateProduct),
  ProductControllers.updateProduct
);

router.delete(
  "/:id",
  auth(UserRole.VENDOR, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  ProductControllers.deleteProduct
);

export const ProductRoutes = router;
