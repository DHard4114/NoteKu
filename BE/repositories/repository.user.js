const db = require("../database/pg.database");
const bcrypt = require('bcrypt');

exports.getAllUsers = async () => {
    try {
        const res = await db.query("SELECT * FROM users");
        return res.rows;
    }
    catch (error) {
        console.error("Database query failed", error);
    }
};

exports.registerUser =  async (user) => {
    try {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        console.log("Registering user with hashed password:", hashedPassword);
        const res = await db.query(
            "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
            [user.name, user.email, hashedPassword]
        );
        return res.rows[0];
    }
    catch (error) {
        console.log(error);
        console.error("Database query failed", error);
    }
};

exports.updateUserbyID = async (user) => {
    try {
        const res = await db.query(
            "UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *",
            [user.name, user.email, user.password, user.id]
        );
        return res.rows[0];
    }
    catch (error) {
        console.log(error);
        console.error("Database query failed", error);
    }
};

exports.deleteUserID = async (id) => {
    try {
        const res = await db.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);
        return res.rows[0];
    }
    catch (error) {
        console.error("Database query failed", error);
    }
};

exports.getUserbyEmail = async (email) => {
    try {
        const res = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        return res.rows[0];
    } catch (error) {
        console.error("Database query failed", error);
        throw error;
    }
};