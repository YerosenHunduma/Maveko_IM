import jwt from "jsonwebtoken";
import adminAccountModel from "../models/admin.account.model.js";
export const Login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await adminAccountModel.findOne({ email });

    const token = jwt.sign({ user: email }, process.env.jwt_secret_key);

    const { password: pass, ...userInfo } = user._doc;

    res
      .cookie("access_token", token, {
        httpOnly: true,
        sameSite: "None",
      })
      .status(200)
      .json({ success: true, userInfo });
  } catch (error) {
    next(error);
  }
};
