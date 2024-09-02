import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api/index.mjs";
import woocommerceAccountModel from "../models/woocommerce.account.model.js";
import { mapProductToWoocommerceSchema } from "../utils/mapProductToWooCommerceSchema.js";

export const createProduct = async (req, res, next) => {
  const { name, products } = req.body;

  const woocommerceAccount = await woocommerceAccountModel.findOne({
    shopName: name,
  });

  if (!woocommerceAccount) {
    return res.status(404).json({ error: "Woocommerce account not found" });
  }

  const { consumerKey, consumerSecret, url } = woocommerceAccount;

  const api = new WooCommerceRestApi({
    url,
    consumerKey,
    consumerSecret,
    version: "wc/v3",
  });

  const data = mapProductToWoocommerceSchema(products);
  try {
    api
      .post("products/batch", data)
      .then((response) => {
        console.log("DDD", response.data);
        res.json(response.data);
      })
      .catch((error) => {
        res.status(500).json({ error: error.response.data });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const createWoocommerceAccount = async (req, res, next) => {
  try {
    const { url, consumerKey, consumerSecret } = req.body;

    const regex = /https?:\/\/(?:www\.)?([^\.]+)\./;
    const match = url.match(regex);
    const shopName = match[1];

    if (!shopName) {
      return res.status(400).json({ error: "Invalid WooCommerce URL" });
    }

    const api = new WooCommerceRestApi({
      url,
      consumerKey,
      consumerSecret,
      version: "wc/v3",
    });

    const response = await api.get("products", { per_page: 1 });

    if (response.status === 200) {
      await new woocommerceAccountModel({
        shopName,
        consumerKey,
        consumerSecret,
        url,
      }).save();

      return res
        .status(201)
        .json({ message: "WooCommerce account created successfully" });
    } else {
      return res.status(response.status).json({
        error:
          "Failed to validate WooCommerce credentials. Please check and try again.",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
