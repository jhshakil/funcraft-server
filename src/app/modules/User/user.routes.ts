import { NextFunction, Request, Response, Router } from "express";
import { upload } from "../../../helpers/fileUploader";
import { UserValidations } from "./user.validation";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { UserControllers } from "./user.controller";

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
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidations.createAdmin.parse(JSON.parse(req.body.data));
    return UserControllers.createAdmin(req, res, next);
  }
);
router.post(
  "/create-vendor",
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidations.createVendor.parse(JSON.parse(req.body.data));
    return UserControllers.createVendor(req, res, next);
  }
);
router.post(
  "/create-customer",
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidations.createCustomer.parse(JSON.parse(req.body.data));
    return UserControllers.createCustomer(req, res, next);
  }
);

export const UserRoutes = router;
