const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = (req, res, next) => {
    const decoded = jwt.verify(req.headers['authorization'], config.secret)
    if (decoded.userType == "admin") {
        res.send("Admin aceite com sucesso.");
        next();
    }
    else {
        return res.status(401).json({
            message: "Acesso restrito a Admins."
        })
    }
}