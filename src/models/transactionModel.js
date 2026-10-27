const pool = require('../config/db');

const transactionModel = {
  create: async (descricao, valor, tipo, categoria, userId) => {
    const [result] = await pool.query(
      'INSERT INTO transactions (descricao, valor, tipo, categoria, user_id) VALUES (?, ?, ?, ?, ?)',
      [descricao, valor, tipo, categoria, userId]
    );
    return result.insertId;
  },

  // Suporta busca global (ADM) ou filtrada por utilizador (OPERATOR)
// Busca com suporte a filtros, propriedade (OPERATOR/ADM) e paginação
  findAll: async ({ userId = null, tipo, categoria, dataInicio, dataFim, page = 1, limit = 10 }) => {
    let query = `
      SELECT t.id, t.descricao, t.valor, t.tipo, t.categoria, t.created_at, u.nome AS usuario
      FROM transactions t
      JOIN users u ON t.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    // Filtro por dono do registro (OPERATOR)
    if (userId) {
      query += ' AND t.user_id = ?';
      params.push(userId);
    }

    // Filtro por tipo (ENTRADA / SAIDA)
    if (tipo) {
      query += ' AND t.tipo = ?';
      params.push(tipo.toUpperCase());
    }

    // Filtro por categoria
    if (categoria) {
      query += ' AND t.categoria LIKE ?';
      params.push(`%${categoria}%`);
    }

    // Filtro por intervalo de datas
    if (dataInicio) {
      query += ' AND t.created_at >= ?';
      params.push(`${dataInicio} 00:00:00`);
    }

    if (dataFim) {
      query += ' AND t.created_at <= ?';
      params.push(`${dataFim} 23:59:59`);
    }

    // Ordenação e Paginação
    const offset = (Number(page) - 1) * Number(limit);
    query += ' ORDER BY t.created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const [rows] = await pool.query(query, params);
    return rows;
  },

  findById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM transactions WHERE id = ?', [id]);
    return rows[0];
  },

  update: async (id, descricao, valor, tipo, categoria) => {
    await pool.query(
      'UPDATE transactions SET descricao = ?, valor = ?, tipo = ?, categoria = ? WHERE id = ?',
      [descricao, valor, tipo, categoria, id]
    );
  },

  delete: async (id) => {
    await pool.query('DELETE FROM transactions WHERE id = ?', [id]);
  },

  // Suporta resumo global (ADM) ou filtrado por utilizador (OPERATOR)
  getSummary: async (userId = null) => {
    let query = `
      SELECT 
        SUM(CASE WHEN tipo = 'ENTRADA' THEN valor ELSE 0 END) AS totalEntradas,
        SUM(CASE WHEN tipo = 'SAIDA' THEN valor ELSE 0 END) AS totalSaidas,
        (SUM(CASE WHEN tipo = 'ENTRADA' THEN valor ELSE 0 END) - SUM(CASE WHEN tipo = 'SAIDA' THEN valor ELSE 0 END)) AS saldoTotal
      FROM transactions
    `;
    const params = [];

    if (userId) {
      query += ' WHERE user_id = ?';
      params.push(userId);
    }

    const [rows] = await pool.query(query, params);
    return rows[0];
  }
};

module.exports = transactionModel;