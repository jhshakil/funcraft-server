import { Router } from "express";
import { DeliveryAddressControllers } from "./deliveryAddress.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { validateRequest } from "../../middlewares/validateRequest";
import { DeliveryAddressValidations } from "./deliveryAddress.validation";

const router = Router();

router.post(
  "/",
  auth(UserRole.CUSTOMER),
  validateRequest(DeliveryAddressValidations.createDeliveryAddress),
  DeliveryAddressControllers.createDeliveryAddress
);

router.patch(
  "/:id",
  auth(UserRole.CUSTOMER),
  validateRequest(DeliveryAddressValidations.updateDeliveryAddress),
  DeliveryAddressControllers.updateDeliveryAddress
);

export const DeliveryAddressRoutes = router;
