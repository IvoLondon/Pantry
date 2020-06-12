import jwt from 'jsonwebtoken';
import config from './../config';

const withAuth = function(req, res, next) {
    const token = 
      req.body.token ||
      req.query.token ||
      req.headers['x-access-token'] ||
      req.cookies.token;
      
    if (!token) {
        res.status(401).json({ status: 401, message: 'Unauthorized: No token provided, please Login'}).end();
    } else {
        jwt.verify(token, config.authSecret, function(err, decoded) {
            if (err) {
                res.status(401).json({ status: 401, message: 'Unauthorized: Invalid token'}).end();
            } else {
                req.authUser = decoded.email;
                next(); 
            }
        });
    }
}

export default withAuth;