import { Router } from "express";
import { StatsControllers } from "./stats.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.get(
  "/customer/:id",
  auth(UserRole.CUSTOMER),
  StatsControllers.getAllUserStats
);

router.get(
  "/vendor/:id",
  auth(UserRole.VENDOR),
  StatsControllers.getAllVendorStats
);

router.get(
  "/admin",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  StatsControllers.getAllAdminStats
);

export const StatsRouters = router;
