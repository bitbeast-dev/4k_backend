import mysql2 from "mysql2";
import db from "../config/db.js";
import cloudinary from "../cloudinary/cloud.js";
import streamifier from "streamifier";

// Get all mission items
const getMission = (req, res) => {
  const sql = "SELECT * FROM mission ORDER BY created_at DESC";
  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(result);
    }
  });
};

// Create new mission item (memory storage + Cloudinary stream)
const createMission = async (req, res) => {
  const { title, description } = req.body;
  const files = req.files;

  if (!files || files.length === 0) {
    return res.status(400).json({ message: "Image is required" });
  }

  try {
    // Upload all images to Cloudinary using streamifier
    const uploadPromises = files.map(
      (file) =>
        new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "4k_vision", use_filename: true, unique_filename: false },
            (error, result) => {
              if (error) return reject(error);
              resolve(result.secure_url);
            }
          );
          streamifier.createReadStream(file.buffer).pipe(uploadStream);
        })
    );

    const uploadedUrls = await Promise.all(uploadPromises);

    // Prepare values for DB insert
    const values = uploadedUrls.map((url, index) => {
      const originalName = files[index].originalname;
      const fileTitle =
        originalName.substring(0, originalName.lastIndexOf(".")) || originalName;

      return [fileTitle || title || "", description || "", url];
    });

    const sql =
      "INSERT INTO mission (title_of_section, description, image) VALUES ?";
    db.query(sql, [values], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({
        message: "Mission created successfully",
        insertedRows: result.affectedRows,
      });
    });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
};

// Update mission item
const updateMission = (req, res) => {
  const { id } = req.params;
  const { image, description } = req.body;
  const sql = "UPDATE mission SET image = ?, description = ? WHERE id = ?";
  db.query(sql, [image, description, id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "Record not found" });
    } else {
      res.json({ message: "Mission updated successfully", id });
    }
  });
};

// Delete mission item
const deleteMission = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM mission WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "Record not found" });
    } else {
      res.json({ message: "Mission successfully deleted" });
    }
  });
};

export { getMission, createMission, updateMission, deleteMission };
