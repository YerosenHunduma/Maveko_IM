import express from "express";
import shopifyRoutes from "./shopify.routes.js";
import woocommerceRoutes from "./woocommerce.routes.js";
import globalErrorHandler from "../middleware/globalErrorHandler.js";

const router = express.Router();

router.use("/shopify", shopifyRoutes);
router.use("/woocommerce", woocommerceRoutes);
router.use(globalErrorHandler);

export default router;
