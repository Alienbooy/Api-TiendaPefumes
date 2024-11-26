const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {

    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'No se proporcionó un token.' });
    }
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        console.log("Token decodificado:", decoded);
        req.id_cliente = decoded.id_cliente; 
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token inválido o expirado.' });
    }
}

module.exports = verificarToken;
