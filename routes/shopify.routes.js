import express from "express";
import {
  createProduct,
  createShopifyAccount,
} from "../controllers/shopify.controllers.js";

const router = express.Router();

router.post("/products", createProduct);
router.post("/create-account", createShopifyAccount);

export default router;
