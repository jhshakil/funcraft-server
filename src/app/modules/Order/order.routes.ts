import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { validateRequest } from "../../middlewares/validateRequest";
import { OrderValidations } from "./order.validation";
import { OrderControllers } from "./order.controller";

const router = Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  OrderControllers.getAllOrder
);

router.post(
  "/",
  auth(UserRole.CUSTOMER),
  validateRequest(OrderValidations.createOrder),
  OrderControllers.createOrder
);

router.patch(
  "/:id",
  auth(UserRole.VENDOR, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(OrderValidations.updateOrder),
  OrderControllers.updateOrder
);

export const OrderRoutes = router;
