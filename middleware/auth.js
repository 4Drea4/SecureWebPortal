const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    let token = req.headers.authorization;

    //bearer
    if (token) {
        token = token.split('').pop().trim();

    }
    if (!token){
        return res.status(401).json({message: 'No token'});

    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.data;
        next();
    }catch {
        return res.status(401).json({message: 'Token is invalid'});
    }
    
};
module.exports = authMiddleware;