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

router.patch(
  "/:id",
  auth(UserRole.VENDOR),
  upload.single("logo"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = ShopValidations.updateShop.parse(JSON.parse(req.body.data));
    return ShopControllers.updateShop(req, res, next);
  }
);

router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.VENDOR),
  ShopControllers.deleteShop
);

router.patch(
  "/status/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.VENDOR),
  ShopControllers.updateStatus
);

router.patch(
  "/banner/:id",
  auth(UserRole.VENDOR),
  upload.single("banner"),
  ShopControllers.updateBanner
);

export const ShopRoutes = router;
