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
router.get("/product", ReviewControllers.getReviewByProductId);
router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  ReviewControllers.getAllReview
);
router.get(
  "/customer/:customerId",
  auth(UserRole.CUSTOMER),
  ReviewControllers.getAllUserReview
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
router.delete(
  "/:id",
  auth(UserRole.CUSTOMER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  ReviewControllers.deleteReview
);

export const ReviewRoutes = router;
