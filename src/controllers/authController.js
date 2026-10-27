const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const authController = {
    register: async (req, res) => {
        try {
            const { nome, email, senha, role } = req.body;
            if (!nome || !email || !senha) {
                return res.status(400).json({ message: 'É obrigatório responder todos os dados.' });
            }

            const userExists = await userModel.findByEmail(email);
            if (userExists) {
                return res.status(400).json({ message: 'Usuário já existe.' });
            }

            const senhaHash = await bcrypt.hash(senha, 10);
            const userRole = role === 'ADM' ? 'ADM' : 'OPERATOR';

            const userId = await userModel.create(nome, email, senhaHash, userRole);
            return res.status(201).json({ message: 'Usuário registrado com sucesso.', userId });
        } catch (error) {
            console.error('Erro no register:', error);
            return res.status(500).json({ message: 'Erro do servidor no registro.', erro: error.message });
        }
    },

    login: async (req, res) => {
        try {
            const { email, senha } = req.body;
            const user = await userModel.findByEmail(email);
            if (!user) {
                return res.status(401).json({ message: 'Credenciais inválidas.' });
            }

            const passMatch = await bcrypt.compare(senha, user.senha);
            if (!passMatch) {
                return res.status(401).json({ message: 'Credenciais inválidas.' });
            }

            const token = jwt.sign(
                { id: user.id, role: user.role },
                process.env.JWT_SECRET || 'secret',
                { expiresIn: '8h' }
            );

            return res.json({
                message: 'Login feito com sucesso!',
                token,
                user: {
                    id: user.id,
                    nome: user.nome,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            console.error('Erro no login:', error);
            return res.status(500).json({ message: 'Erro do servidor no login.', erro: error.message });
        }
    }
};

module.exports = authController;