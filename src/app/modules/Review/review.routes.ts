import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { ReviewControllers } from "./review.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { ReviewValidations } from "./review.validation";

const router = Router();

router.get(
  "/review-check",
  auth(UserRole.CUSTOMER),
  ReviewControllers.checkForReview
);
router.post(
  "/",
  auth(UserRole.CUSTOMER),
  validateRequest(ReviewValidations.createReview),
  ReviewControllers.createReview
);
router.patch(
  "/:id",
  auth(UserRole.CUSTOMER),
  validateRequest(ReviewValidations.updateReview),
  ReviewControllers.updateReview
);
router.delete("/:id", auth(UserRole.CUSTOMER), ReviewControllers.deleteReview);

export const ReviewRoutes = router;
