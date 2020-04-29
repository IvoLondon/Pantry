import jwt from 'jsonwebtoken';
import config from './../config';

const withAuth = function(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        res.status(401).send('Unauthorized: No token provided');
    } else {
        jwt.verify(token, config.authSecret, function(err, decoded) {
            if (err) {
                res.status(401).send('Unauthorized: Invalid token');
            } else {
                req.email = decoded.email;
                next();
            }
        });
    }
}

export default withAuth;