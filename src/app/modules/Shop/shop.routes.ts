import { NextFunction, Request, Response, Router } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { ShopControllers } from "./shop.controller";
import { upload } from "../../../helpers/fileUploader";
import { ShopValidations } from "./shop.validation";

const router = Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  ShopControllers.getAllShop
);

router.get(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.VENDOR),
  ShopControllers.getShopById
);

router.post(
  "/",
  auth(UserRole.VENDOR),
  upload.single("logo"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = ShopValidations.createShop.parse(JSON.parse(req.body.data));
    return ShopControllers.createShop(req, res, next);
  }
);

export const ShopRoutes = router;
