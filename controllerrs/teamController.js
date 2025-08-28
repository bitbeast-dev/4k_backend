import mysql2 from "mysql2";
import db from "../config/db.js";
import cloudinary from "../cloudinary/cloud.js";
import streamifier from "streamifier";

// Get all team members
const getTeam = (req, res) => {
  const sql = "SELECT * FROM team ORDER BY created_at DESC";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

// Create new team member (memory storage + Cloudinary)
const createTeam = async (req, res) => {
  try {
    const { role } = req.body;
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

    // Prepare values for DB insert
    const values = uploadedUrls.map((url, index) => {
      const originalName = files[index].originalname;
      const team_member =
        originalName.substring(0, originalName.lastIndexOf(".")) || originalName;

      return [url, team_member, role || ""];
    });

    const sql = "INSERT INTO team (image, team_member, role) VALUES ?";
    db.query(sql, [values], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      const insertedItems = values.map((val, i) => ({
        id: result.insertId + i,
        image: val[0],
        team_member: val[1],
        role: val[2],
      }));

      res.status(201).json({
        message: "Team members uploaded successfully",
        insertedRows: result.affectedRows,
        data: insertedItems,
      });
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    res.status(500).json({ error: "Failed to upload images" });
  }
};

// Update team member
const updateTeam = (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  const sql = "UPDATE team SET role = ? WHERE id = ?";
  db.query(sql, [role, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Record not found" });

    res.json({ message: "Team member updated successfully", id, role });
  });
};

// Delete team member
const deleteTeam = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM team WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Record not found" });
    res.json({ message: "Team member successfully deleted" });
  });
};

// Truncate team table
const truncateTeam = (req, res) => {
  const sql = "TRUNCATE TABLE team";
  db.query(sql, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "All team members successfully deleted" });
  });
};

export { getTeam, createTeam, updateTeam, deleteTeam, truncateTeam };
