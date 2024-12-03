import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import { upload } from "../../../helpers/fileUploader";
import { UserValidations } from "./user.validation";

const router = Router();

router.post(
  "/create-admin",
  // auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidations.createAdmin.parse(JSON.parse(req.body.data));
    return userController.createAdmin(req, res, next);
  }
);

export const userRoutes = router;
