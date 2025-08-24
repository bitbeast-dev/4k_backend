import mysql2 from "mysql2";
import db from "../config/db.js";

// Get all home items
const getCategory = (req, res) => {
    const sql = "SELECT * FROM category ORDER BY id ASC";
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(result);
        }
    });
};

// Create new home item
const createCategory = (req, res) => {
  const { category } = req.body;
  const sql = "INSERT INTO category (id) VALUES (?)";
  db.query(sql, [category], (err, result) => {
    if (err) {
      console.error("MySQL insert error:", err);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({
      message: "Category Inserted successfully",
      insertedRows: result.affectedRows,
    });
  });
};


// Update home item
const updateCategory = (req, res) => {
    const { cat_id } = req.params;
    const { id } = req.body;
    const sql="UPDATE category SET id = ? WHERE cat_id = ?";
    db.query(sql, [id,cat_id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ error: "Record not found" });
        } else {
            res.json({ id: id, ...req.body });
        }
    });
};

// Delete home item
const deleteCategory = (req, res) => {
    const { id } = req.params;
    const sql =  "DELETE FROM category WHERE cat_id=?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ error: "Record not found" });
        } else {
            
            res.json({message:"data successfully deleted"})
        }
    });
};

export { getCategory, createCategory, updateCategory, deleteCategory };
