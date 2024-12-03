import { NextFunction, Request, Response } from "express";
import { Secret } from "jsonwebtoken";
import { verifyToken } from "../../helpers/jwtHelper";
import config from "../../config";
import ApiError from "../errors/ApiError";

export const auth = (...roles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.headers.authorization;

      if (!token) throw new ApiError(401, "You are not authorized");

      const verifyUser = verifyToken(token, config.jwt.jwt_secret as Secret);

      req.user = verifyUser;

      if (roles.length && !roles.includes(verifyUser.role))
        throw new ApiError(403, "Forbidden!");

      next();
    } catch (error) {
      next(error);
    }
  };
};
