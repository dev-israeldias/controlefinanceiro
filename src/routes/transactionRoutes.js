const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Todas as rotas de transação exigem login (authMiddleware)
router.use(authMiddleware);

// Permite OPERATOR e ADM criar, listar e ver resumo
router.post('/', roleMiddleware(['ADM', 'OPERATOR']), transactionController.create);
router.get('/', roleMiddleware(['ADM', 'OPERATOR']), transactionController.getAll);
router.get('/summary', roleMiddleware(['ADM', 'OPERATOR']), transactionController.getSummary);
router.get('/:id', roleMiddleware(['ADM', 'OPERATOR']), transactionController.getById);
router.put('/:id', roleMiddleware(['ADM', 'OPERATOR']), transactionController.update);

// Apenas ADM pode EXCLUIR transações
router.delete('/:id', roleMiddleware(['ADM']), transactionController.delete);

module.exports = router;