import "@shopify/shopify-api/adapters/node";
import {
  shopifyApi,
  LATEST_API_VERSION,
  Session,
  DataType,
} from "@shopify/shopify-api";
import shopifyAccountModel from "../models/shopify.account.model.js";
import { mapProductToShopifySchema } from "../utils/mapProductToShopifySchema.js";

export const createProduct = async (req, res, next) => {
  const { shopUrl, products } = req.body;

  const shopifyAccount = await shopifyAccountModel.findOne({ shopUrl });

  if (!shopifyAccount) {
    return res.status(404).json({ error: "Shopify account not found" });
  }

  const { accessToken, apiKey, apiSecretKey } = shopifyAccount;

  const shopify = shopifyApi({
    apiKey,
    apiSecretKey,
    scopes: ["write_products", "read_products"],
    hostName: "localhost:3000",
    apiVersion: LATEST_API_VERSION,
  });

  const session = new Session({
    shop: shopUrl,
    accessToken: accessToken,
    isOnline: false,
  });

  try {
    const client = new shopify.clients.Rest({ session });

    const newProducts = mapProductToShopifySchema(products);

    for (const product of newProducts) {
      await client.post({
        path: "products",
        data: product,
        type: DataType.JSON,
      });
    }

    res
      .status(200)
      .json({ success: true, message: "Products created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to create products" });
  }
};

export const createShopifyAccount = async (req, res, next) => {
  const { apiKey, apiSecretKey, accessToken, shopUrl } = req.body;

  const cleanedUrl = shopUrl.replace(/^https?:\/\//, "");
  const regex = /^([a-zA-Z0-9-]+)\.myshopify\.com$/;

  const match = cleanedUrl.match(regex);
  const shopName = match ? match[1] : null;
  try {
    const shopify = shopifyApi({
      apiKey,
      apiSecretKey,
      scopes: ["write_products", "read_products"],
      hostName: "localhost:3000",
      apiVersion: LATEST_API_VERSION,
    });

    const session = new Session({
      shop: shopUrl,
      accessToken: accessToken,
      isOnline: false,
    });

    const client = new shopify.clients.Rest({ session });

    await client.get({ path: "shop", type: DataType.JSON });

    const existingShop = await shopifyAccountModel.findOne({ shopName });

    if (existingShop) {
      return res.status(400).json({ error: "The shop is already registered" });
    }

    await new shopifyAccountModel({
      apiKey,
      apiSecretKey,
      accessToken,
      shopName,
      shopUrl,
    }).save();

    res
      .status(200)
      .json({ success: true, message: "Shopify account created successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};
