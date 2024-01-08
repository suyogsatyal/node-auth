const jwt = require('jsonwebtoken');
import { ApiResponse } from '../../utils/interface'
const JWT_SECRET = process.env.JWT_SECRET;
const backendURL = process.env.REACT_APP_BACKEND_URL;
const axios = require('axios');

const authenticateToken = async (req: any, res: any, next: any) => {
    console.log(`authenticateToken invoked for ${req.method} ${req.url}`);
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
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
        console.log(decoded.username);
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

const authenticateAdmin = async (req: any, res: any, next: any) => {
    console.log(`authenticateAdmin invoked for ${req.method} ${req.url}`);
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    // console.log(token);
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
        console.log(decoded.username);
        if (!decoded || !decoded.username) {
            throw new Error('Invalid token');
        }
        else if(!decoded.isAdmin){
            const errorResponse: ApiResponse = {
                        success: false,
                        status: 401,
                        message: 'Unauthorized Access to Admin Only Endpoints',
                    };
                    console.error(errorResponse);
                    return res.status(errorResponse.status).json(errorResponse);
        }
        else if (decoded.isAdmin) {
            res.locals.user = decoded;
            next();
        }
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


module.exports = {authenticateToken, authenticateAdmin};