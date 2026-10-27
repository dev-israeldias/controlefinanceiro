const transactionModel = require('../models/transactionModel');

const transactionController = {
  // Criar transação
  create: async (req, res) => {
    try {
      const { descricao, valor, tipo, categoria } = req.body;

      if (!descricao || !valor || !tipo || !categoria) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
      }

      if (!['ENTRADA', 'SAIDA'].includes(tipo)) {
        return res.status(400).json({ message: 'O tipo deve ser ENTRADA ou SAIDA.' });
      }

      // O user.id vem do authMiddleware
      const transactionId = await transactionModel.create(
        descricao,
        valor,
        tipo,
        categoria,
        req.user.id
      );

      return res.status(201).json({
        message: 'Transação registrada com sucesso!',
        transactionId
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro do servidor ao criar transação.' });
    }
  },

// Listar transações com filtros e paginação
  getAll: async (req, res) => {
    try {
      const userId = req.user.role === 'OPERATOR' ? req.user.id : null;
      const { tipo, categoria, dataInicio, dataFim, page, limit } = req.query;

      const transactions = await transactionModel.findAll({
        userId,
        tipo,
        categoria,
        dataInicio,
        dataFim,
        page,
        limit
      });

      return res.json({
        page: Number(page) || 1,
        limit: Number(limit) || 10,
        totalResultados: transactions.length,
        data: transactions
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro do servidor ao listar transações.' });
    }
  },

  // Buscar por ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const transaction = await transactionModel.findById(id);

      if (!transaction) {
        return res.status(404).json({ message: 'Transação não encontrada.' });
      }

      return res.json(transaction);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro do servidor ao buscar transação.' });
    }
  },

  // Atualizar
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { descricao, valor, tipo, categoria } = req.body;

      const transaction = await transactionModel.findById(id);
      if (!transaction) {
        return res.status(404).json({ message: 'Transação não encontrada.' });
      }

      await transactionModel.update(id, descricao, valor, tipo, categoria);
      return res.json({ message: 'Transação atualizada com sucesso!' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro do servidor ao atualizar transação.' });
    }
  },

  // Excluir (Apenas ADM via rota)
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const transaction = await transactionModel.findById(id);

      if (!transaction) {
        return res.status(404).json({ message: 'Transação não encontrada.' });
      }

      await transactionModel.delete(id);
      return res.json({ message: 'Transação excluída com sucesso!' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro do servidor ao excluir transação.' });
    }
  },

// Resumo global ou individual
  getSummary: async (req, res) => {
    try {
      const userId = req.user.role === 'OPERATOR' ? req.user.id : null;
      const summary = await transactionModel.getSummary(userId);
      return res.json({
        totalEntradas: summary.totalEntradas || 0,
        totalSaidas: summary.totalSaidas || 0,
        saldoTotal: summary.saldoTotal || 0
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro do servidor ao buscar resumo.' });
    }
  }
};

module.exports = transactionController;