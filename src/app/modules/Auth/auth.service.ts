import { generateToken, verifyToken } from "../../../helpers/jwtHelper";
import { prisma } from "../../../shared/prisma";
import bcrypt from "bcrypt";
import { Secret } from "jsonwebtoken";
import config from "../../../config";
import { emailSender } from "./emailSender";
import ApiError from "../../errors/ApiError";
import { UserRole, UserStatus } from "@prisma/client";

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new Error("Password incorrect");
  }

  let currentUser: { email: string; id: string; name: string } | null = null;

  if (
    userData?.role === UserRole.ADMIN ||
    userData?.role === UserRole.SUPER_ADMIN
  ) {
    currentUser = await prisma.admin.findUniqueOrThrow({
      where: {
        email: userData.email,
      },
      select: {
        email: true,
        id: true,
        name: true,
      },
    });
  } else if (userData?.role === UserRole.VENDOR) {
    currentUser = await prisma.vendor.findUniqueOrThrow({
      where: {
        email: userData.email,
      },
      select: {
        email: true,
        id: true,
        name: true,
        profilePhoto: true,
        address: true,
        contactNumber: true,
      },
    });
  } else if (userData?.role === UserRole.CUSTOMER) {
    currentUser = await prisma.customer.findUniqueOrThrow({
      where: {
        email: userData.email,
      },
      select: {
        email: true,
        id: true,
        name: true,
        profilePhoto: true,
        deliveryAddress: true,
        contactNumber: true,
      },
    });
  }

  const accessToken = generateToken(
    {
      email: userData.email,
      role: userData.role,
      id: currentUser?.id,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = generateToken(
    {
      email: userData.email,
      role: userData.role,
      id: currentUser?.id,
    },
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string) => {
  let decodedData;

  try {
    decodedData = verifyToken(token, config.jwt.refresh_token_secret as Secret);
  } catch (error) {
    throw new Error("You are not authorized!");
  }

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData?.email,
      status: UserStatus.ACTIVE,
    },
  });

  const accessToken = generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    "abcdefg",
    "5m"
  );

  return {
    accessToken,
  };
};

const changePassword = async (user: any, payload: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );

  if (!isCorrectPassword) throw new Error("Password incorrect!");

  const hashedPassword: string = await bcrypt.hash(payload.newPassword, 12);

  await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hashedPassword,
    },
  });
};

const forgotPassword = async (payload: { email: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const resetPassToken = generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.reset_pass_token as Secret,
    config.jwt.reset_pass_token_expires_in as string
  );

  const resetPassLink =
    config.reset_pass_link + `?userId=${userData.id}&token=${resetPassToken}`;

  await emailSender(
    userData.email,

    `
    <div>
      <p>Dear User,</p>
      <p>Your password reset link 
      <a href=${resetPassLink}>Reset Password</a>
      </p>
    </div>
    `
  );
};

const resetPassword = async (
  token: string,
  payload: { id: string; password: string }
) => {
  prisma.user.findUniqueOrThrow({
    where: {
      id: payload.id,
      status: UserStatus.ACTIVE,
    },
  });

  const isValidToken = verifyToken(
    token,
    config.jwt.reset_pass_token as Secret
  );

  if (!isValidToken) throw new ApiError(403, "Forbidden!");

  const hashedPassword: string = await bcrypt.hash(payload.password, 12);

  await prisma.user.update({
    where: {
      id: payload.id,
    },
    data: {
      password: hashedPassword,
    },
  });
};

export const AuthServices = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
