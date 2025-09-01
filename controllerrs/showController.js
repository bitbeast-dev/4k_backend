import mysql2 from "mysql2";
import db from "../config/db.js";
import cloudinary from "../cloudinary/cloud.js";
import streamifier from "streamifier";

// Get all showcase items
const getShowcase = (req, res) => {
  const sql = "SELECT * FROM showcase ORDER BY created_at DESC";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result.rows);
  });
};

// Create new showcase item (memory storage + Cloudinary)
const createShowcase = async (req, res) => {
  try {
    const { description } = req.body;
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
      return [url, title, description || ""];
    });

    const sql = "INSERT INTO showcase (image, title, description) VALUES ?";
    db.query(sql, [values], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      const insertedItems = values.map((val, i) => ({
        id: result.insertId + i,
        image: val[0],
        title: val[1],
        description: val[2],
      }));

      res.status(201).json({
        message: "Showcase items uploaded successfully",
        insertedRows: result.affectedRows,
        data: insertedItems,
      });
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    res.status(500).json({ error: "Failed to upload images" });
  }
};

// Update showcase item
const updateShowcase = (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const sql = "UPDATE showcase SET title = ?, description = ? WHERE id = ?";
  db.query(sql, [title, description, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Record not found" });

    res.json({ message: "Showcase updated successfully", id, title, description });
  });
};

// Delete showcase item
const deleteShowcase = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM showcase WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Record not found" });
    res.json({ message: "Showcase item successfully deleted" });
  });
};

// Truncate showcase items
const truncateShowcase = (req, res) => {
  const sql = "TRUNCATE TABLE showcase";
  db.query(sql, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "All showcase items successfully deleted" });
  });
};

export { getShowcase, createShowcase, updateShowcase, deleteShowcase, truncateShowcase };
