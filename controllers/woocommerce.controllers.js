import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api/index.mjs";
import woocommerceAccountModel from "../models/woocommerce.account.model.js";
import { mapProductToWoocommerceSchema } from "../utils/mapProductToWooCommerceSchema.js";
import { errorHandler } from "../utils/errorHandler.js";

export const createProduct = async (req, res, next) => {
  const { shopName, products } = req.body;
  const woocommerceAccount = await woocommerceAccountModel.findOne({
    shopName,
  });

  if (!woocommerceAccount) {
    return next(new errorHandler("Woocommerce account not found", 400));
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
        res.status(201).json({
          success: true,
          message: "WooCommerce Product is created successfully",
        });
      })
      .catch((error) => {
        console.log(error.response.data);
        return next(
          new errorHandler(
            error.response.data.message,
            error.response.data.status
          )
        );
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
