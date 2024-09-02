import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api/index.mjs";
import woocommerceAccountModel from "../models/woocommerce.account.model.js";
import { mapProductToWoocommerceSchema } from "../utils/mapProductToWooCommerceSchema.js";
import { errorHandler } from "../utils/errorHandler.js";

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

    const api = new WooCommerceRestApi({
      url,
      consumerKey,
      consumerSecret,
      version: "wc/v3",
    });

    api
      .get("products", { per_page: 1 })
      .then(async (response) => {
        const regex = /https?:\/\/(?:www\.)?([^\.]+)\./;
        const match = url.match(regex);
        const shopName = match[1];
        // console.log(response.data);
        const woocommerceAccount = await woocommerceAccountModel.findOne({
          shopName,
        });

        if (woocommerceAccount) {
          return next(
            new errorHandler("The woocommerce account already registered", 400)
          );
        }

        await new woocommerceAccountModel({
          shopName,
          consumerKey,
          consumerSecret,
          url,
        }).save();

        res.status(201).json({
          success: true,
          message: "WooCommerce account created successfully",
        });
      })
      .catch((error) => {
        return next(
          new errorHandler("Incorrect WooCommerce credentials.", 401)
        );
      });
  } catch (error) {
    next(error);
  }
};
