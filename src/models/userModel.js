const pool = require('../config/db');

const userModel = {

    findByEmail: async (email) => {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    },

    create: async (nome, email, senhaHash, role = 'OPERATOR') => {
        const [result] = await pool.query(
            'INSERT INTO users (nome, email, senha, role) VALUES (?, ?, ?, ?)',
            [nome, email, senhaHash, role]
        );
        return result.insertId;
    },

    findById: async (id) => {
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
        return rows[0];
    }
};

module.exports = userModel;