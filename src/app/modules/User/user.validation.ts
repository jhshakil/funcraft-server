import { UserStatus } from "@prisma/client";
import { z } from "zod";

const createAdmin = z.object({
  body: z.object({
    email: z.string({
      required_error: "Email is required",
    }),
    password: z.string({
      required_error: "Password is required",
    }),
    name: z.string({
      required_error: "Name is required",
    }),
  }),
});

const createVendor = z.object({
  body: z.object({
    email: z.string({
      required_error: "Email is required",
    }),
    password: z.string({
      required_error: "Password is required",
    }),
    name: z.string({
      required_error: "Name is required",
    }),
    contactNumber: z.string().optional(),
    address: z.string().optional(),
  }),
});

const createCustomer = z.object({
  body: z.object({
    email: z.string({
      required_error: "Email is required",
    }),
    password: z.string({
      required_error: "Password is required",
    }),
    name: z.string({
      required_error: "Name is required",
    }),
    contactNumber: z.string().optional(),
  }),
});

const userProfileStatus = z.object({
  body: z.object({
    status: z.enum([UserStatus.ACTIVE, UserStatus.BLOCKED, UserStatus.DELETED]),
  }),
});

const updateUserProfile = z.object({
  name: z.string().optional(),
  contactNumber: z.string().optional(),
  address: z.string().optional(),
});

export const UserValidations = {
  createAdmin,
  createVendor,
  createCustomer,
  userProfileStatus,
  updateUserProfile,
};
