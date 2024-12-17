import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { CouponCodeControllers } from "./CouponCode.controller";

const router = Router();

router.get("/", auth(UserRole.VENDOR), CouponCodeControllers.getAllCoupon);
router.post("/code", CouponCodeControllers.getCouponByCode);
router.post("/", auth(UserRole.VENDOR), CouponCodeControllers.createCoupon);

router.delete(
  "/:id",
  auth(UserRole.VENDOR),
  CouponCodeControllers.deleteCoupon
);

export const CouponCodeRoutes = router;
