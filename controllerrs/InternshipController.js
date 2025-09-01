import mysql2 from "mysql2";
import db from "../config/db.js";

// ✅ Get all internship items
const getInternship = (req, res) => {
    const sql = "SELECT * FROM internship ORDER BY created_at DESC";
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(result.rows);
    });
};

// ✅ Create new internship item
const createInternship = (req, res) => {
    const { title, description, requirement, duration } = req.body;

    const sql = "INSERT INTO internship (title, description, requirement, duration) VALUES (?, ?, ?, ?)";
    db.query(sql, [title, description, requirement, duration], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: result.insertId, ...req.body });
    });
};

// ✅ Update internship item
const updateInternship = (req, res) => {
    const { id } = req.params;
    const { icon, title, description, requirement, duration } = req.body;

    const sql = "UPDATE internship SET icon = ?, title = ?, description = ?, requirement = ?, duration = ? WHERE id = ?";
    db.query(sql, [icon, title, description, requirement, duration, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Record not found" });
        }
        res.json({ id: id, ...req.body });
    });
};

// ✅ Delete internship item
const deleteInternship = (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM internship WHERE id = ?";
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

export { getInternship, createInternship, updateInternship, deleteInternship };
