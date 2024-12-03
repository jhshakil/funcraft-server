import { Admin, Status, UserRole } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { prisma } from "../../../shared/prisma";
import { uploadToCloudinary } from "../../../helpers/fileUploader";
import { TFile } from "../../interfaces/file";
import { Request } from "express";

const createAdmin = async (req: Request) => {
  const file = req.file as TFile;

  console.log(req.body);
  // if (file) {
  //   const upload = await uploadToCloudinary(file);
  //   req.body.admin.profilePhoto = upload?.secure_url;
  // }

  // const hashedPassword: string = await bcrypt.hash(req.body.password, 12);

  // const userData = {
  //   email: req.body.admin.email,
  //   password: hashedPassword,
  //   role: UserRole.ADMIN,
  // };

  // const result = await prisma.$transaction(async (TC) => {
  //   await TC.user.create({
  //     data: userData,
  //   });

  //   const createdAdminData = await TC.admin.create({
  //     data: req.body.admin,
  //   });

  //   return createdAdminData;
  // });

  // return result;
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

export const userService = {
  createAdmin,
  changeProfileStatus,
};
