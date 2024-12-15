import { Prisma, UserRole, UserStatus } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { prisma } from "../../../shared/prisma";
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
    where: {
      ...whereConditions,
      status: {
        in: ["ACTIVE", "BLOCKED"],
      },
    },
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
  let result = null;
  if (user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN) {
    result = await prisma.admin.findUniqueOrThrow({
      where: {
        id,
        isDeleted: false,
      },
      select: {
        email: true,
        id: true,
        name: true,
        profilePhoto: true,
      },
    });
  } else if (user?.role === UserRole.VENDOR) {
    result = await prisma.vendor.findUniqueOrThrow({
      where: {
        id,
        isDeleted: false,
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
    result = await prisma.customer.findUniqueOrThrow({
      where: {
        id,
        isDeleted: false,
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

  if (result?.email) {
    await prisma.user.findUniqueOrThrow({
      where: {
        email: result.email,
        status: "ACTIVE",
      },
    });
  }

  return result;
};

const createAdmin = async (payload: any) => {
  const adminData: { email: string; name: string; profilePhoto?: string } = {
    email: payload.email,
    name: payload.name,
  };

  const hashedPassword: string = await bcrypt.hash(payload.password, 12);

  const userData = {
    email: payload.email,
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

const createVendor = async (payload: any) => {
  const vendorData: { email: string; name: string; profilePhoto?: string } = {
    email: payload.email,
    name: payload.name,
  };

  const hashedPassword: string = await bcrypt.hash(payload.password, 12);

  const userData = {
    email: payload.email,
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

const createCustomer = async (payload: any) => {
  const customerData: { email: string; name: string; profilePhoto?: string } = {
    email: payload.email,
    name: payload.name,
  };

  const hashedPassword: string = await bcrypt.hash(payload.password, 12);

  const userData = {
    email: payload.email,
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

  const result = await prisma.$transaction(async (TC) => {
    const updateUserStatus = await TC.user.update({
      where: {
        id,
      },
      data: {
        status: data.status,
      },
    });
    if (updateUserStatus.role === "ADMIN") {
      await TC.admin.update({
        where: {
          email: updateUserStatus.email,
        },
        data: {
          isDeleted: data.status === "ACTIVE" ? false : true,
        },
      });
    } else if (updateUserStatus.role === "VENDOR") {
      await TC.vendor.update({
        where: {
          email: updateUserStatus.email,
        },
        data: {
          isDeleted: data.status === "ACTIVE" ? false : true,
        },
      });
    } else if (updateUserStatus.role === "CUSTOMER") {
      await TC.customer.update({
        where: {
          email: updateUserStatus.email,
        },
        data: {
          isDeleted: data.status === "ACTIVE" ? false : true,
        },
      });
    }

    return updateUserStatus;
  });

  return result;
};

const updateUserProfile = async (payload: any, user: TAuthUser) => {
  const userRole = user?.role;
  const userEmail = user?.email;

  await prisma.user.findUniqueOrThrow({
    where: { email: userEmail },
  });

  if (userRole === "ADMIN" || userRole === "SUPER_ADMIN") {
    const result = await prisma.admin.update({
      where: {
        email: userEmail,
      },
      data: payload,
    });

    return result;
  } else if (userRole === "VENDOR") {
    const result = await prisma.vendor.update({
      where: {
        email: userEmail,
      },
      data: payload,
    });

    return result;
  } else if (userRole === "CUSTOMER") {
    const result = await prisma.customer.update({
      where: {
        email: userEmail,
      },
      data: payload,
    });

    return result;
  }
};

export const UserServices = {
  getAllUser,
  getUserById,
  createAdmin,
  createVendor,
  createCustomer,
  changeProfileStatus,
  updateUserProfile,
};
