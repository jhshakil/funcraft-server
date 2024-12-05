import { NextFunction, Request, Response, Router } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { upload } from "../../../helpers/fileUploader";
import { ProductControllers } from "./product.controller";
import { ProductValidations } from "./product.validation";

const router = Router();

router.get("/", ProductControllers.getAllProduct);
router.get("/:id", ProductControllers.getProductById);
router.post(
  "/",
  auth(UserRole.VENDOR),
  upload.single("thumbnailImage"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = ProductValidations.createProduct.parse(
      JSON.parse(req.body.data)
    );
    return ProductControllers.createProduct(req, res, next);
  }
);
router.patch(
  "/:id",
  auth(UserRole.VENDOR),
  upload.single("thumbnailImage"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = ProductValidations.updateProduct.parse(
      JSON.parse(req.body.data)
    );
    return ProductControllers.updateProduct(req, res, next);
  }
);

router.delete("/:id", ProductControllers.deleteProduct);

export const ProductRoutes = router;
