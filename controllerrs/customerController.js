import mysql2 from "mysql2";
import db from "../config/db.js";
import cloudinary from "../cloudinary/cloud.js";

// Get all customer items
const getcustomer = (req, res) => {
  const sql = "SELECT * FROM partner";
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(result.rows);
  });
};

// Create new customer item
const createcustomer = async (req, res) => {
  const { description } = req.body;
  const files = req.files;

  if (!files || files.length === 0) {
    return res.status(400).json({ error: "No files uploaded" });
  }

  try {
    // Upload files to Cloudinary from buffer (since using multer.memoryStorage)
    const uploadPromises = files.map((file) =>
      cloudinary.uploader.upload_stream({
        folder: "4k_vision",
        use_filename: true,
        unique_filename: false,
      },
      (error, result) => {
        if (error) throw error;
        return result;
      }).end(file.buffer)
    );

    // The above won't work directly because cloudinary.uploader.upload_stream uses callback style,
    // so we need to wrap it in a promise:

    const uploadToCloudinary = (file) =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "4k_vision",
            use_filename: true,
            unique_filename: true,
          },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        stream.end(file.buffer);
      });

    // Upload all files using promises
    const uploadResults = await Promise.all(files.map(uploadToCloudinary));

    // Prepare values for DB insert
    const values = uploadResults.map((result, index) => {
      const originalName = files[index].originalname;
      const title =
        originalName.substring(0, originalName.lastIndexOf(".")) || originalName;

      return [result.secure_url, title, description || ""];
      // Note: Your SQL expects (image, title_name, description) in that order.
    });

    const sql = "INSERT INTO partner (image, title_name, description) VALUES ?";
    db.query(sql, [values], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: result.insertId, ...req.body });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Cloudinary upload failed" });
  }
};

// Update customer item
const updatecustomer = (req, res) => {
  const { id } = req.params;
  const { description } = req.body;
  const sql = "UPDATE partner SET description = ? WHERE id = ?";
  db.query(sql, [description, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Record not found" });
    }
    res.json({ id: id, ...req.body });
  });
};

// Delete customer item
const deletecustomer = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM partner WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Record not found" });
    }
    res.json({ message: "Data successfully deleted" });
  });
};

export { getcustomer, createcustomer, updatecustomer, deletecustomer };
