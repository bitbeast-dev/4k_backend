import mysql2 from "mysql2";
import db from "../config/db.js";

// Get all home items
const getPartner = (req, res) => {
    const sql = "SELECT * FROM partner";
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(result);
        }
    });
};

// Create new home item
const createPartner = (req, res) => {

    const {description } = req.body;
    const files=req.files
    if(!files){
        console.log("No data found")
    }
    const values=files.map((file)=>{
        const image=file.filename;
        const originalName=file.originalname;
        const title=originalName.substring(0,originalName.lastIndexOf(".")) || originalName;
        return [image,title,description];
    })
    const sql = "INSERT INTO partner (image, title, description) VALUES ?";
    db.query(sql, [values], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(201).json({ id: result.insertId, ...req.body });
        }
    });
};

// Update home item
const updatePartner = (req, res) => {
    const { id } = req.params;
    const { description} = req.body;
    const sql = "UPDATE partner SET  description = ? WHERE ID = ?";
    db.query(sql, [description,id], (err, result) => {
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
const deletePartner = (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM partner WHERE id = ?";
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

export { getPartner, createPartner, updatePartner, deletePartner };
