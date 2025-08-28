import mysql2 from "mysql2";
import db from "../config/db.js";
import cloudinary from "../cloudinary/cloud.js";
import streamifier from "streamifier";

// Get all 4k_values items
const getValues = (req, res) => {
  const sql = "SELECT * FROM 4k_values ORDER BY created_at DESC";
  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(result);
    }
  });
};

// Create new 4k_values item (Cloudinary + streamifier)
const createValues = async (req, res) => {
  const { description } = req.body;
  const files = req.files;

  // Validate inputs
  if (!files || files.length === 0) {
    return res.status(400).json({ error: "No files uploaded" });
  }
  if (!description) {
    return res.status(400).json({ error: "Description is required" });
  }

  try {
    // Upload to Cloudinary via streamifier
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

    // Prepare DB insert
    const values = uploadedUrls.map((url) => [url, description]);

    const sql = "INSERT INTO `4k_values` (`image`, `description`) VALUES ?";
    db.query(sql, [values], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: err });
      }

      res.status(201).json({
        message: "Values inserted successfully",
        insertedRows: result.affectedRows,
      });
    });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    res.status(500).json({ error: "Image upload failed", details: err.message });
  }
};

// Update 4k_values item
const updateValues = (req, res) => {
  const { id } = req.params;
  const { image, description } = req.body;
  const sql = "UPDATE 4k_values SET image = ?, description = ? WHERE id = ?";
  db.query(sql, [image, description, id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "Record not found" });
    } else {
      res.json({ message: "Values updated successfully", id, image, description });
    }
  });
};

// Delete 4k_values item
const deleteValues = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM 4k_values WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "Record not found" });
    } else {
      res.json({ message: "Data successfully deleted" });
    }
  });
};

export { getValues, createValues, updateValues, deleteValues };
