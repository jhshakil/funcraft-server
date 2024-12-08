import {
  Admin,
  Customer,
  Prisma,
  UserRole,
  UserStatus,
  Vendor,
} from "@prisma/client";
import * as bcrypt from "bcrypt";
import { prisma } from "../../../shared/prisma";
import { uploadToCloudinary } from "../../../helpers/fileUploader";
import { TFile } from "../../interfaces/file";
import { Request } from "express";
import { TPaginationOptions } from "../../interfaces/pagination";
import { calculatePagination } from "../../../helpers/paginationHelper";
import { userSearchableFields } from "./user.constant";
import { generateToken } from "../../../helpers/jwtHelper";
import config from "../../../config";
import { Secret } from "jsonwebtoken";
import { TAuthUser } from "../../interfaces/common";

const getAllUser = async (params: any, options: TPaginationOptions) => {
  const { searchTerm, ...filterData } = params;
  const { limit, page, skip, sortBy, sortOrder } = calculatePagination(options);
  const andConditions: Prisma.UserWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: userSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updateAt: true,
      admin: true,
      vendor: true,
      customer: true,
    },
  });

  const total = await prisma.user.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getUserById = async (id: string, user: TAuthUser) => {
  let result = {};
  if (user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN) {
    result = await prisma.admin.findUniqueOrThrow({
      where: {
        id,
      },
      select: {
        email: true,
        id: true,
        name: true,
      },
    });
  } else if (user?.role === UserRole.VENDOR) {
    result = await prisma.vendor.findUniqueOrThrow({
      where: {
        id,
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
  } else if (user?.role === UserRole.CUSTOMER) {
    result = await prisma.vendor.findUniqueOrThrow({
      where: {
        id,
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
  }

  return result;
};

const createAdmin = async (req: Request) => {
  const file = req.file as TFile;

  const adminData: { email: string; name: string; profilePhoto?: string } = {
    email: req.body.email,
    name: req.body.name,
  };

  if (file) {
    const upload = await uploadToCloudinary(file);
    adminData.profilePhoto = upload?.secure_url;
  }

  const hashedPassword: string = await bcrypt.hash(req.body.password, 12);

  const userData = {
    email: req.body.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };

  const result = await prisma.$transaction(async (TC) => {
    const createUserData = await TC.user.create({
      data: userData,
    });

    const createdAdminData = await TC.admin.create({
      data: adminData,
    });

    const accessToken = generateToken(
      {
        email: createUserData.email,
        role: createUserData.role,
        id: createdAdminData.id,
      },
      config.jwt.jwt_secret as Secret,
      config.jwt.expires_in as string
    );

    const refreshToken = generateToken(
      {
        email: createUserData.email,
        role: createUserData.role,
        id: createdAdminData.id,
      },
      config.jwt.refresh_token_secret as Secret,
      config.jwt.refresh_token_expires_in as string
    );

    return {
      accessToken,
      refreshToken,
    };
  });

  return result;
};

const createVendor = async (req: Request) => {
  const file = req.file as TFile;

  const vendorData: { email: string; name: string; profilePhoto?: string } = {
    email: req.body.email,
    name: req.body.name,
  };

  if (file) {
    const upload = await uploadToCloudinary(file);
    vendorData.profilePhoto = upload?.secure_url;
  }

  const hashedPassword: string = await bcrypt.hash(req.body.password, 12);

  const userData = {
    email: req.body.email,
    password: hashedPassword,
    role: UserRole.VENDOR,
  };

  const result = await prisma.$transaction(async (TC) => {
    const createUserData = await TC.user.create({
      data: userData,
    });

    const createdVendorData = await TC.vendor.create({
      data: vendorData,
    });

    const accessToken = generateToken(
      {
        email: createUserData.email,
        role: createUserData.role,
        id: createdVendorData.id,
      },
      config.jwt.jwt_secret as Secret,
      config.jwt.expires_in as string
    );

    const refreshToken = generateToken(
      {
        email: createUserData.email,
        role: createUserData.role,
        id: createdVendorData.id,
      },
      config.jwt.refresh_token_secret as Secret,
      config.jwt.refresh_token_expires_in as string
    );

    return {
      accessToken,
      refreshToken,
    };
  });

  return result;
};

const createCustomer = async (req: Request) => {
  const file = req.file as TFile;

  const customerData: { email: string; name: string; profilePhoto?: string } = {
    email: req.body.email,
    name: req.body.name,
  };

  if (file) {
    const upload = await uploadToCloudinary(file);
    customerData.profilePhoto = upload?.secure_url;
  }

  const hashedPassword: string = await bcrypt.hash(req.body.password, 12);

  const userData = {
    email: req.body.email,
    password: hashedPassword,
    role: UserRole.CUSTOMER,
  };

  const result = await prisma.$transaction(async (TC) => {
    const createUserData = await TC.user.create({
      data: userData,
    });

    const createdCustomerData = await TC.customer.create({
      data: customerData,
    });

    const accessToken = generateToken(
      {
        email: createUserData.email,
        role: createUserData.role,
        id: createdCustomerData.id,
      },
      config.jwt.jwt_secret as Secret,
      config.jwt.expires_in as string
    );

    const refreshToken = generateToken(
      {
        email: createUserData.email,
        role: createUserData.role,
        id: createdCustomerData.id,
      },
      config.jwt.refresh_token_secret as Secret,
      config.jwt.refresh_token_expires_in as string
    );

    return {
      accessToken,
      refreshToken,
    };
  });

  return result;
};

const changeProfileStatus = async (
  id: string,
  data: { status: UserStatus }
) => {
  await prisma.user.findUniqueOrThrow({
    where: { id },
  });

  const updateUserStatus = await prisma.user.update({
    where: {
      id,
    },
    data: {
      status: data.status,
    },
  });

  return updateUserStatus;
};

export const UserServices = {
  getAllUser,
  getUserById,
  createAdmin,
  createVendor,
  createCustomer,
  changeProfileStatus,
};
