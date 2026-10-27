const express = require('express');
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();

app.use(express.json());

// Rotas da aplicação
app.use('/auth', authRoutes);
app.use('/transactions', transactionRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API de Gestão Financeira rodando!' });
});

module.exports = app;