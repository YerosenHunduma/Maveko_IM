import express from "express";
import shopifyRoutes from "./shopify.routes.js";

const router = express.Router();

router.use("/shopify", shopifyRoutes);

export default router;
