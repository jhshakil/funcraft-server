import { Admin, Prisma, Status, UserRole } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { prisma } from "../../../shared/prisma";
import { uploadToCloudinary } from "../../../helpers/fileUploader";
import { TFile } from "../../interfaces/file";
import { Request } from "express";
import { TPaginationOptions } from "../../interfaces/pagination";
import { calculatePagination } from "../../../helpers/paginationHelper";
import { userSearchableFields } from "./user.constant";

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

const createAdmin = async (req: Request): Promise<Admin> => {
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
    await TC.user.create({
      data: userData,
    });

    const createdAdminData = await TC.admin.create({
      data: adminData,
    });

    return createdAdminData;
  });

  return result;
};

const createVendor = async (req: Request): Promise<Admin> => {
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
    await TC.user.create({
      data: userData,
    });

    const createdVendorData = await TC.vendor.create({
      data: vendorData,
    });

    return createdVendorData;
  });

  return result;
};

const createCustomer = async (req: Request): Promise<Admin> => {
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
    await TC.user.create({
      data: userData,
    });

    const createdCustomerData = await TC.customer.create({
      data: customerData,
    });

    return createdCustomerData;
  });

  return result;
};

const changeProfileStatus = async (id: string, data: { status: Status }) => {
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
  createAdmin,
  createVendor,
  createCustomer,
  changeProfileStatus,
};
