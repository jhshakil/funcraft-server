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

export const StatsRouters = router;
