// Corrigido: allowedRoles (com 'w')
const roleMiddleware = (allowedRoles = []) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(403).json({ message: 'Acesso negado. Informação de perfil não encontrada.' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: 'Acesso negado. Você não tem permissão para acessar este recurso.'
            });
        }

        return next();
    };
};

module.exports = roleMiddleware;