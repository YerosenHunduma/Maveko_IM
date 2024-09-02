import { Schema, model } from "mongoose";

const ShopifyAccountSchema = new Schema(
  {
    shopName: { type: String, required: true },
    accessToken: { type: String, required: true },
    shopUrl: { type: String, required: true },
    apiKey: { type: String, required: true },
    apiSecretKey: { type: String, required: true },
  },
  { timestamps: true, versionKey: false }
);

export default model("ShopifyAccount", ShopifyAccountSchema);
