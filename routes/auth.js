import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import streamifier from "streamifier";

import cloudinary from "../cloudinary/cloud.js";// your Cloudinary config

import { 
  getHome, deleteHome, updateHome, createHome, truncateHome 
} from "../controllerrs/homeController.js";
import { 
  createProducts, deleteProducts, getProducts, truncateProducts, updateProducts 
} from "../controllerrs/productControllers.js";
import {createShowcase, deleteShowcase, getShowcase,updateShowcase,truncateShowcase} from "../controllerrs/showController.js";
import { 
  createMission, deleteMission, getMission, updateMission 
} from "../controllerrs/missionController.js";
import { 
  createInternship, deleteInternship, getInternship, updateInternship 
} from "../controllerrs/InternshipController.js";
import { 
  createValues, deleteValues, getValues, updateValues 
} from "../controllerrs/valuesController.js";
import { 
  createCategory, deleteCategory, getCategory, updateCategory 
} from "../controllerrs/category.js";
import { 
  createTeam, deleteTeam, getTeam, updateTeam 
} from "../controllerrs/teamController.js";
import { 
  createcustomer, deletecustomer, getcustomer, updatecustomer 
} from "../controllerrs/customerController.js";
import { 
  checkAdmin, createAccount, loginAccount, unlockAdmin 
} from "../controllerrs/adminController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer memory storage for all image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper function to upload files to Cloudinary
export const uploadToCloudinary = async (files, folder) => {
  const uploadedUrls = [];

  for (const file of files) {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }
      );
      streamifier.createReadStream(file.buffer).pipe(stream);
    });
    uploadedUrls.push(result);
  }

  return uploadedUrls;
};

// Home routes
const homeCard = express.Router();
homeCard.post("/add", upload.array("images"), createHome);
homeCard.get("/read", getHome);
homeCard.delete("/delete/:id", deleteHome);
homeCard.put("/update/:id", updateHome);
homeCard.delete("/truncate", truncateHome);

// Product routes
const productCard = express.Router();
productCard.post("/add", upload.array("images"), createProducts);
productCard.get("/read", getProducts);
productCard.delete("/delete/:id", deleteProducts);
productCard.delete("/truncate", truncateProducts);
productCard.put("/update/:id", updateProducts);

// Showcase routes
const showcaseCard = express.Router();
showcaseCard.post("/add", upload.array("images"), createShowcase);
showcaseCard.get("/read", getShowcase);
showcaseCard.delete("/delete/:id", deleteShowcase);
showcaseCard.put("/update/:id", updateShowcase);
showcaseCard.delete("/truncate", truncateShowcase);

// Mission routes
const missionCard = express.Router();
missionCard.post("/add", upload.array("images"), createMission);
missionCard.get("/read", getMission);
missionCard.delete("/delete/:id", deleteMission);
missionCard.put("/update/:id", updateMission);

// Internship routes
const internshipCard = express.Router();
internshipCard.post("/add", upload.array("icon"), createInternship);
internshipCard.get("/read", getInternship);
internshipCard.delete("/delete/:id", deleteInternship);
internshipCard.put("/update/:id", updateInternship);

// Values routes
const valuesCard = express.Router();
valuesCard.post("/add", upload.array("images"), createValues);
valuesCard.get("/read", getValues);
valuesCard.delete("/delete/:id", deleteValues);
valuesCard.put("/update/:id", updateValues);

// Category routes (no images)
const categoryCard = express.Router();
categoryCard.post("/add", createCategory);
categoryCard.get("/read", getCategory);
categoryCard.delete("/delete/:id", deleteCategory);
categoryCard.put("/update/:cat_id", updateCategory);

// Team routes
const teamCard = express.Router();
teamCard.post("/add", upload.array("images"), createTeam);
teamCard.get("/read", getTeam);
teamCard.delete("/delete/:id", deleteTeam);
teamCard.put("/update/:id", updateTeam);

// Customer routes
const customerCard = express.Router();
customerCard.post("/add", upload.array("images"), createcustomer);
customerCard.get("/read", getcustomer);
customerCard.delete("/delete/:id", deletecustomer);
customerCard.put("/update/:id", updatecustomer);

// Admin routes
const userAdmin = express.Router();
userAdmin.post("/signup", createAccount);
userAdmin.post("/login", loginAccount);
userAdmin.post("/check", checkAdmin);
userAdmin.put("/unlock", unlockAdmin);

export { 
  homeCard,
  productCard,
  showcaseCard,
  missionCard,
  internshipCard,
  valuesCard,
  categoryCard,
  teamCard,
  customerCard,
  userAdmin
};
