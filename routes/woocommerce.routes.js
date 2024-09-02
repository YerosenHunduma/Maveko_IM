import express from "express";
import {
  createProduct,
  createWoocommerceAccount,
} from "../controllers/woocommerce.controllers.js";

const router = express.Router();

router.post("/products", createProduct);
router.post("/create-account", createWoocommerceAccount);

export default router;
