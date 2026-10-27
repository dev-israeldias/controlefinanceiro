const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
//rota para login e obter token (POST /auth/login)
router.post('/login', authController.login);
//rota para registrar novo utilizador (POST /auth/register)
router.post('/register', authController.register);
module.exports = router;