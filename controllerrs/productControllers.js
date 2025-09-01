import pkg from "pg";
import db from "../config/db.js"; // your PostgreSQL client
import cloudinary from "../cloudinary/cloud.js"; 
import streamifier from "streamifier";

const { Pool } = pkg;

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

    // Upload images to Cloudinary
    const uploadPromises = files.map(
      (file) =>
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

    // Prepare dynamic placeholders for PostgreSQL
    const values = [];
    const placeholders = uploadedUrls
      .map((url, index) => {
        const originalName = files[index].originalname;
        const title =
          originalName.substring(0, originalName.lastIndexOf(".")) || originalName;
        values.push(url, title, description, price, features, style, quantity, category);
        const offset = index * 8;
        return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6}, $${offset + 7}, $${offset + 8})`;
      })
      .join(", ");

    const sql = `
      INSERT INTO products 
      (image, title, description, price, features, style, quantity, category) 
      VALUES ${placeholders} 
      RETURNING *`;

    const result = await db.query(sql, values);

    res.status(201).json({
      message: "Products uploaded successfully",
      insertedRows: result.rowCount,
      data: result.rows,
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
