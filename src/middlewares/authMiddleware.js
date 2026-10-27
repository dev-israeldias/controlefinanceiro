const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Token não fornecido.' });
    }

    const parts = authHeader.split(' ');
    // Corrigido: length em vez de lenght
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ message: 'Formato de Token inválido.' });
    }

    const token = parts[1];
    try {
        // Corrigido: JWT_SECRET em maiúsculo para bater com o .env
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = decoded;
        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido ou expirado.' });
    }
};

module.exports = authMiddleware;