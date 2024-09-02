import { Schema, model } from "mongoose";

const woocommerceAccountSchema = new Schema(
  {
    url: { type: String, required: true },
    consumerKey: { type: String, required: true },
    consumerSecret: { type: String, required: true },
    shopName: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("woocommerceAccountSchema", woocommerceAccountSchema);
