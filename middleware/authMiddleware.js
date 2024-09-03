import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/errorHandler.js";

export const isAuthenticated = (res, req, next) => {
  const accessToken = req.cookies?.access_token;
  if (!accessToken) {
    return next(
      new errorHandler(
        "Access denied.You are not authorized, Please log in.",
        401
      )
    );
  }
  try {
    jwt.verify(accessToken, process.env.jwt_secret_key, (err, decoded) => {
      if (err) {
        return next(new errorHandler(err.message, 401));
      }

      req.email = decoded.email;

      next();
    });
  } catch (error) {
    next(error);
  }
};
