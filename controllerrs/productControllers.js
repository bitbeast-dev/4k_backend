import mysql2 from "mysql2";
import db from "../config/db.js";
import cloudinary from "../cloudinary/cloud.js"; // your Cloudinary config
import streamifier from "streamifier";

// Get all products
const getProducts = (req, res) => {
  const sql = "SELECT * FROM products ORDER BY created_at DESC";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

// Create new product (fully working with memory storage & Cloudinary)
 const createProducts = async (req, res) => {
  try {
    const { description, price, features, style, quantity, category } = req.body;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "At least one image is required" });
    }

    // Upload all images to Cloudinary
    const uploadPromises = files.map((file) =>
      new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "4k_vision", use_filename: true, unique_filename: true },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          }
        );
        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      })
    );

    const uploadedUrls = await Promise.all(uploadPromises);

    // Prepare data for DB insert
    const values = uploadedUrls.map((url, index) => {
      const originalName = files[index].originalname;
      const title =
        originalName.substring(0, originalName.lastIndexOf(".")) || originalName;
      return [url, title, description, price, features, style, quantity, category];
    });

    const sql =
      "INSERT INTO products (image, title, description, price, features, style, quantity, category) VALUES ?";
    db.query(sql, [values], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      const insertedItems = values.map((val, i) => ({
        id: result.insertId + i,
        image: val[0],
        title: val[1],
        description: val[2],
        price: val[3],
        features: val[4],
        style: val[5],
        quantity: val[6],
        category: val[7],
      }));

      res.status(201).json({
        message: "Products uploaded successfully",
        insertedRows: result.affectedRows,
        data: insertedItems,
      });
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    res.status(500).json({ error: "Failed to upload images" });
  }
};

// Update product
 const updateProducts = (req, res) => {
  const { id } = req.params;
  const { description, price, category } = req.body;
  const sql = "UPDATE products SET description = ?, price = ?, category = ? WHERE id = ?";
  db.query(sql, [description, price, category, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Record not found" });
    res.json({ message: "Product updated successfully", id, description, price, category });
  });
};

// Delete product
const deleteProducts = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM products WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Record not found" });
    res.json({ message: "Product successfully deleted" });
  });
};

// Truncate products
 const truncateProducts = (req, res) => {
  const sql = "TRUNCATE TABLE products";
  db.query(sql, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "All products successfully deleted" });
  });
};



export { getProducts, createProducts, updateProducts, deleteProducts ,truncateProducts};
