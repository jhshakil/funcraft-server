import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import { upload } from "../../../helpers/fileUploader";
import { UserValidations } from "./user.validation";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.post(
  "/create-admin",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidations.createAdmin.parse(JSON.parse(req.body.data));
    return userController.createAdmin(req, res, next);
  }
);
router.post(
  "/create-vendor",
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidations.createVendor.parse(JSON.parse(req.body.data));
    return userController.createVendor(req, res, next);
  }
);
router.post(
  "/create-customer",
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidations.createCustomer.parse(JSON.parse(req.body.data));
    return userController.createCustomer(req, res, next);
  }
);

export const userRoutes = router;
