import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { ShopControllers } from "./shop.controller";
import { ShopValidations } from "./shop.validation";
import { validateRequest } from "../../middlewares/validateRequest";

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
  validateRequest(ShopValidations.createShop),
  ShopControllers.createShop
);

router.patch(
  "/:id",
  auth(UserRole.VENDOR),
  validateRequest(ShopValidations.updateShop),
  ShopControllers.updateShop
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
  ShopControllers.updateBanner
);

export const ShopRoutes = router;
