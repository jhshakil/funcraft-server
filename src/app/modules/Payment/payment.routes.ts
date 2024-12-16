import { Router } from "express";
import { PaymentControllers } from "./payment.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.post("/", auth(UserRole.CUSTOMER), PaymentControllers.makePayment);
router.post("/confirmation", PaymentControllers.confirmPayment);

export const PaymentRoutes = router;
