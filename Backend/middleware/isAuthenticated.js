import jwt from 'jsonwebtoken';

const isAuthenticated = (req, res, next) => {
    try {
        // Check for token in cookies first, then in Authorization header
        const token = req.cookies?.token || (req.headers?.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null);

        if (!token) {
            return res.status(401).clearCookie('token').json({
                message: 'Authentication required. Please log in.',
                success: false
            });
        }

        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).clearCookie('token').json({
                    message: 'Your session has expired. Please log in again.',
                    success: false,
                    isTokenExpired: true
                });
            } else {
                return res.status(401).clearCookie('token').json({
                    message: 'Invalid token. Please log in again.',
                    success: false
                });
            }
        }

        if (!decoded || !decoded.id) {
            return res.status(401).clearCookie('token').json({
                message: 'Invalid token. Please log in again.',
                success: false
            });
        }

        // Attach user ID to request object for use in route handlers
        req.id = decoded.id;
        
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(500).json({
            message: 'Internal server error during authentication',
            success: false,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export default isAuthenticated;
