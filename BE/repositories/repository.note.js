const db = require("../database/pg.database");
const { validate: isUUID } = require('uuid');

exports.getNotes = async () => {
    try {
        const res = await db.query("SELECT * FROM notes");
        return res.rows;
    } catch (error) {
        console.error("Error executing query", error);
    }
};

exports.getNotesByUserId = async (userId) => {
    try {
        if (!isUUID(userId)) {
            throw new Error(`Invalid UUID format: ${userId}`);
        }

        const query = 'SELECT * FROM notes WHERE user_id = $1';
        const result = await db.query(query, [userId]);
        
        if (result && result.rows) {
            return result.rows;
        } else {
            throw new Error('No notes found');
        }
    } catch (err) {
        console.error('Error executing query:', err);
        throw err;
    }
};

exports.createNote = async (note) => {
    try {
        const query = `
            INSERT INTO notes (user_id, title, content)
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        const values = [note.user_id, note.title, note.content];
        const res = await db.query(query, values);
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
    }
};

exports.updateNote = async (id, note) => {
    try {
        const query = `
            UPDATE notes
            SET title = $1, content = $2
            WHERE id = $3
            RETURNING *
        `;
        const values = [note.title, note.content, id];
        const res = await db.query(query, values);
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
    }
};

exports.deleteNote = async (id) => {
    try {
        const query = `
            DELETE FROM notes
            WHERE id = $1
            RETURNING *
        `;
        const res = await db.query(query, [id]);
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
    }
};
