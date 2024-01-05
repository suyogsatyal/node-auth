const jwt = require('jsonwebtoken');
import { ApiResponse } from '../../utils/interface'
const JWT_SECRET = process.env.JWT_SECRET;
const backendURL = process.env.REACT_APP_BACKEND_URL;
const axios = require('axios');

const authenticateToken = async (req: any, res: any, next: any) => {
    const token = req.headers.authorization && req.headers.authorization;
    if (!token) {
        const errorResponse: ApiResponse = {
            success: false,
            status: 401,
            message: 'No token provided',
        };
        console.error(errorResponse);
        return res.status(errorResponse.status).json(errorResponse);
    }
    try {
        const decoded = jwt.decode(token);
        if (!decoded || !decoded.username) {
            throw new Error('Invalid token');
        }
        res.locals.user = decoded;
        next();
    }
    catch (error) {
        const errorResponse: ApiResponse = {
            success: false,
            status: 401,
            message: 'Invalid token',
          };
          console.error(errorResponse);
          return res.status(errorResponse.status).json(errorResponse);
      
    }
}


module.exports = authenticateToken;