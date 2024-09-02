import "@shopify/shopify-api/adapters/node";
import {
  shopifyApi,
  LATEST_API_VERSION,
  Session,
  DataType,
} from "@shopify/shopify-api";
import shopifyAccountModel from "../models/shopify.account.model.js";
import { mapProductToShopifySchema } from "../utils/mapProductToShopifySchema.js";
import { errorHandler } from "../utils/errorHandler.js";

export const createProduct = async (req, res, next) => {
  const { shopName, products } = req.body;

  const shopifyAccount = await shopifyAccountModel.findOne({ shopName });

  if (!shopifyAccount) {
    return next(
      new errorHandler(
        "Can't find Shopify account associated with this ShopName",
        404
      )
    );
  }

  const { accessToken, apiKey, apiSecretKey, shopUrl } = shopifyAccount;

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
    next(error);
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
      return next(
        new errorHandler("The shopify account already registered", 400)
      );
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
    next(error);
  }
};
