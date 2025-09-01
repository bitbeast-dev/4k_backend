import pkg from "pg";
const { Pool } = pkg;
import db from "../config/db.js"; // your PostgreSQL config

const pool = new Pool(db);

// Get all categories
const getCategory = async (req, res) => {
    try {
        const sql = "SELECT * FROM category ORDER BY id ASC";
        const result = await pool.query(sql);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create new category
const createCategory = async (req, res) => {
    const { category } = req.body;
    try {
        const sql = "INSERT INTO category (id) VALUES ($1)";
        const result = await pool.query(sql, [category]);
        res.status(201).json({
            message: "Category inserted successfully",
            insertedRows: result.rowCount,
        });
    } catch (err) {
        console.error("PostgreSQL insert error:", err);
        res.status(500).json({ error: err.message });
    }
};

// Update category
const updateCategory = async (req, res) => {
    const { cat_id } = req.params;
    const { id } = req.body;
    try {
        const sql = "UPDATE category SET id = $1 WHERE cat_id = $2";
        const result = await pool.query(sql, [id, cat_id]);
        if (result.rowCount === 0) {
            res.status(404).json({ error: "Record not found" });
        } else {
            res.json({ id: id, ...req.body });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete category
const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const sql = "DELETE FROM category WHERE cat_id = $1";
        const result = await pool.query(sql, [id]);
        if (result.rowCount === 0) {
            res.status(404).json({ error: "Record not found" });
        } else {
            res.json({ message: "Data successfully deleted" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export { getCategory, createCategory, updateCategory, deleteCategory };
