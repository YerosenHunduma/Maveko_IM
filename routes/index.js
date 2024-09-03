import express from "express";
import shopifyRoutes from "./shopify.routes.js";
import woocommerceRoutes from "./woocommerce.routes.js";
import globalErrorHandler from "../middleware/globalErrorHandler.js";
import loginRoutes from "./auth.routes.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";
const router = express.Router();

router.use("/auth", loginRoutes);
router.use("/shopify", isAuthenticated, shopifyRoutes);
router.use("/woocommerce", isAuthenticated, woocommerceRoutes);
router.use(globalErrorHandler);

export default router;
