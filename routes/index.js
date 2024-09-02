import express from "express";
import shopifyRoutes from "./shopify.routes.js";
import woocommerceRoutes from "./woocommerce.routes.js";

const router = express.Router();

router.use("/shopify", shopifyRoutes);
router.use("/woocommerce", woocommerceRoutes);

export default router;
