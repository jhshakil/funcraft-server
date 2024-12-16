import { Router } from "express";
import { UserRoutes } from "../modules/User/user.routes";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { CategoryRoutes } from "../modules/Category/category.routes";
import { ShopRoutes } from "../modules/Shop/shop.routes";
import { ProductRoutes } from "../modules/Product/product.routes";
import { DeliveryAddressRoutes } from "../modules/DeliveryAddress/deliveryAddress.routes";
import { ReviewRoutes } from "../modules/Review/review.routes";
import { OrderRoutes } from "../modules/Order/order.routes";
import { PaymentRoutes } from "../modules/Payment/payment.routes";

const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/category",
    route: CategoryRoutes,
  },
  {
    path: "/shop",
    route: ShopRoutes,
  },
  {
    path: "/product",
    route: ProductRoutes,
  },
  {
    path: "/delivery-address",
    route: DeliveryAddressRoutes,
  },
  {
    path: "/review",
    route: ReviewRoutes,
  },
  {
    path: "/order",
    route: OrderRoutes,
  },
  {
    path: "/payment",
    route: PaymentRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
