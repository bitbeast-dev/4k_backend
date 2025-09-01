import mysql2 from "mysql2";
import db from "../config/db.js";
import cloudinary from "../cloudinary/cloud.js";
import streamifier from "streamifier";

// Get all home items
const getHome = (req, res) => {
  const sql = "SELECT * FROM home ORDER BY created_at DESC";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result.rows);
  });
};

// Create new home item (memory storage + Cloudinary, like products)
const createHome = async (req, res) => {
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
      return [title, description || "", url];
    });

    const sql = "INSERT INTO home (title, description, image) VALUES ?";
    db.query(sql, [values], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      const insertedItems = values.map((val, i) => ({
        id: result.insertId + i,
        title: val[0],
        description: val[1],
        image: val[2],
      }));

      res.status(201).json({
        message: "Home items uploaded successfully",
        insertedRows: result.affectedRows,
        data: insertedItems,
      });
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    res.status(500).json({ error: "Failed to upload images" });
  }
};

// Update home item
const updateHome = (req, res) => {
  const { id } = req.params;
  const { description } = req.body;

  const sql = "UPDATE home SET description = ? WHERE id = ?";
  db.query(sql, [description, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Record not found" });

    res.json({ message: "Home record updated successfully", id, description });
  });
};

// Delete home item
const deleteHome = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM home WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Record not found" });
    res.json({ message: "Home item successfully deleted" });
  });
};

// Truncate home items
const truncateHome = (req, res) => {
  const sql = "TRUNCATE TABLE home";
  db.query(sql, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "All home items successfully deleted" });
  });
};

export { getHome, createHome, updateHome, deleteHome, truncateHome };
