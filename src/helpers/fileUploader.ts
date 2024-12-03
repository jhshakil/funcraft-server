import multer from "multer";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import { TCloudinaryResponse, TFile } from "../app/interfaces/file";
import config from "../config";

// Configuration
cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage: storage });

export const uploadToCloudinary = async (
  file: TFile
): Promise<TCloudinaryResponse | undefined> => {
  // Upload an image
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file.path,
      (error: Error, result: TCloudinaryResponse) => {
        fs.unlinkSync(file.path);
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};
