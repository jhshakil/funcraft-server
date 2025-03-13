import { Router } from "express";
import { SubscribeControllers } from "./subscribe.controller";

const router = Router();

router.post("/", SubscribeControllers.createSubscribe);

export const subscribeRoutes = router;
