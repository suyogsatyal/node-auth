const express = require('express');
const authRouter = express.Router();
import { LoginFormData, ApiResponse, User } from '../../utils/interface';
const axios = require('axios');
const sqlite3 = require('sqlite3');
const path =  require('path');
const bcrypt = require('bcryptjs');
const dbPath = path.join(__dirname, '../../db', 'database.db')
const db = new sqlite3.Database(dbPath);
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

authRouter.post('/signup', async (req: any, res: any) => {
    try {
        const newUser: LoginFormData = req.body;

        // Fetch user data and admin count from external API
        const usersResponse = await axios.get('http://localhost:3000/users');
        const countResponse = await axios.get('http://localhost:3000/count');

        const adminsCount: number = countResponse.data.admins;
        const userList: User[] = usersResponse.data.users;

        // Check if the username already exists
        const usernameExists = userList.some((user) => user.username === newUser.username);

        // Declare the SQL query outside of the if-else statement
        const insertUserSql = 'INSERT INTO users (username, password_hash, admin_access, contributor_access, viewer_access) VALUES (?, ?, ?, ?, ?)';

        if (usernameExists) {
            const errorResponse: ApiResponse = {
                success: false,
                status: 400,
                message: 'Username already exists',
            };

            return res.status(errorResponse.status).json(errorResponse);
        } else {
            // Username is unique, proceed with user creation
            const salt = bcrypt.genSaltSync(10);
            const passwordHash = bcrypt.hashSync(newUser.password, salt);

            // Determine admin access based on admin count
            const isAdmin = adminsCount === 0 ? 1 : 0;
            const isContributor = adminsCount === 0 ? 1 : 0;

            // Prepare parameters for SQL query
            const params = [newUser.username, passwordHash, isAdmin, isContributor, 1];

            // Insert new user into the database
            db.run(insertUserSql, params, function (this: any, err: any) {
                if (err) {
                    console.error(`Error: ${err}`);
                    const errorResponse: ApiResponse = {
                        success: false,
                        status: 500,
                        message: 'Internal Server Error',
                    };
                    return res.status(errorResponse.status).json(errorResponse);

                }
                const successResponse: ApiResponse = {
                    success: true,
                    status: 201,
                    message: `User ${newUser.username} created successfully`,
                };
                return res.status(successResponse.status).json(successResponse);

            });
        }
    } catch (error: any) {
        console.error(error);
        const errorResponse: ApiResponse = {
            success: false,
            status: 500,
            message: 'Internal Server Error',
        };
        return res.status(errorResponse.status).json(errorResponse);
    }
});


authRouter.post('/login', async (req: any, res: any) => {
    try {
        const loginAttempt: LoginFormData = req.body;
        const userDetailURL = 'http://localhost:3000/user/' + loginAttempt.username;
        const userResponse = await axios.get(userDetailURL);
        const userDetails = userResponse.data.data;
        // console.log(userDetails);
        const userData: LoginFormData = { username: userDetails.username, password: userDetails.password_hash };

        const correctPassword: boolean = bcrypt.compareSync(loginAttempt.password, userData.password);

        console.log(jwtSecret)
        if (correctPassword) {
            const token = jwt.sign({ username: userData.username }, jwtSecret, { expiresIn: '1h' });
            const successResponse: ApiResponse = {
                success: true,
                status: 200,
                data: {token, userDetails}
            };
            return res.status(successResponse.status).json(successResponse);
        }
        else{
            const errorResponse: ApiResponse = {
                success: false,
                status: 401,
                message: 'Invalid username or password'
            };
            console.log(errorResponse)
            return res.status(errorResponse.status).json(errorResponse);
        }
    } catch (error: any) {
        console.log("Didn't work");
        const errorResponse: ApiResponse = {
            success: false,
            status: 500,
            message: 'Internal Server Error'
        };
        console.log(errorResponse)
        return res.status(errorResponse.status).json(errorResponse);
    }

})


authRouter.post('/relogin', async (req:any, res:any) =>{
    try{
        const currentToken:string = req.body.token;
        // const currentToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN1eW9nIiwiaWF0IjoxNzAzNjA2OTU0LCJleHAiOjE3MDM2MTA1NTR9.s2IXaTiQPISo7Li3XSFX8YyrQFNk4gVNumOujVHUw9E"
        if (!currentToken) {
            // If token is missing, return an error response
            const errorResponse: ApiResponse = {
                success: false,
                status: 400,
                message: 'Token is missing',
            };
            return res.status(errorResponse.status).json(errorResponse);
        }

        const decoded = jwt.decode(currentToken);
        if (!decoded || !decoded.username) {
            // If decoding fails or username is missing, return an error response
            const errorResponse: ApiResponse = {
                success: false,
                status: 401,
                message: 'Invalid token',
            };
            return res.status(errorResponse.status).json(errorResponse);
        }
        const userDetailURL = 'http://localhost:3000/user/' + decoded.username;
        const userResponse = await axios.get(userDetailURL);
        const userDetails = userResponse.data.data;
        console.log(userDetails);
        if(userResponse.data.success){
            const successResponse: ApiResponse = {
                success: true,
                status: 200,
                data: userResponse.data.data
            };
            console.log(successResponse)
            return res.status(successResponse.status).json(successResponse);
        }
    }
    catch (error: any) {
        console.log("Didn't work");
        const errorResponse: ApiResponse = {
            success: false,
            status: 500,
            message: 'Internal Server Error'
        };
        console.log(errorResponse)
        return res.status(errorResponse.status).json(errorResponse);
    }
})

export default authRouter