import bcrypt from "bcryptjs";
import adminAccountModel from "../models/admin.account.model.js";
export const seed = async () => {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash("Admin@Mav", salt);

  try {
    const user = await adminAccountModel.findOne({ email: "admin@Maveko.com" });
    if (!user) {
      await new adminAccountModel({
        email: "admin@Maveko.com",
        password: hashedPassword,
      }).save();
      console.log("Admin account created successfully");
    } else {
      console.log("Admin account already exists");
    }
  } catch (error) {
    console.error("Error creating admin account:", error);
  }
};
