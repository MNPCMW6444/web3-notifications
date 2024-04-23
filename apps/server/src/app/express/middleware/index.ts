import errorLogModel from "../../mongo/logs/errorLogModel";
import jsonwebtoken, { JwtPayload } from "jsonwebtoken";
import settings from "../../../config";
import userModel from "../../mongo/auth/userModel";
import { Request as ExpressRequest } from "express";
import { User } from "@w3notif/shared";

export interface AuthenticatedRequest extends ExpressRequest {
  user: User | null;
}

export const serverErrorHandler = async (err, _, res, next) => {
  if (err) {
    try {
      await new (errorLogModel())({
        stringifiedError: err.toString(),
      }).save();
      console.log("Error was logged to mongo");
    } catch (e) {
      console.log("Error logging error to mongo: ", e);
    }
    if (!res.headersSent) {
      return res.status(500).send("Server error");
    }
  } else {
    next(err);
  }
};

export const authRequester = async (req, _, next) => {
  try {
    const validatedUser = jsonwebtoken.verify(
      req.cookies.jwt,
      settings.jwtSecret,
    );
    req.user = await userModel().findById((validatedUser as JwtPayload).id);
  } catch (err) {
    req.user = null;
  }
  next();
};

export const adminAuth = async (req: AuthenticatedRequest, res, next) =>
  req.user.type === "admin"
    ? next()
    : res.status(401).send("You are not an Admin");
