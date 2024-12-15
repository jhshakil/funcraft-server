import { Router } from "express";
import { UserValidations } from "./user.validation";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { UserControllers } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";

const router = Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  UserControllers.getAllUser
);

router.get(
  "/:id",
  auth(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.VENDOR,
    UserRole.CUSTOMER
  ),
  UserControllers.getUserById
);

router.post(
  "/create-admin",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(UserValidations.createAdmin),
  UserControllers.createAdmin
);
router.post(
  "/create-vendor",
  validateRequest(UserValidations.createVendor),
  UserControllers.createVendor
);
router.post(
  "/create-customer",
  validateRequest(UserValidations.createCustomer),
  UserControllers.createVendor
);

router.patch(
  "/status/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(UserValidations.userProfileStatus),
  UserControllers.changeProfileStatus
);

router.patch(
  "/profile",
  auth(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.CUSTOMER,
    UserRole.VENDOR
  ),
  validateRequest(UserValidations.updateUserProfile),
  UserControllers.updateUserProfile
);

export const UserRoutes = router;
