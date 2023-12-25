const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
const { format } = require('date-fns');
const fetch = require('node-fetch');
const dateTime = format(new Date(), 'MM/dd/yyyy, HH:mm:ss:SS');
const bcrypt = require('bcryptjs');
import { LoginFormData, ApiResponse } from '../utils/interface';
const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');

const path = require('path');
const cors = require('cors')

const dbPath = path.join(__dirname, '../db', 'database.db')
const db = new sqlite3.Database(dbPath);
const app = express();

dotenv.config();
const jwtSecret = process.env.JWT_SECRET;

app.use(cors());
app.use(express.json());


app.get('/count', (_req: any, res: any) => {
    const sql = 'SELECT admin_access FROM users';

    db.all(sql, [], (err: any, rows: any) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // Count the number of users with admin_access: 1
        const adminCount = rows.length > 0 ? rows.filter((user: any) => user.admin_access === 1).length : 0;

        let details = { admins: adminCount };
        res.json(details);
    });
})

type User = {
    username: string;
};




app.get('/users', (_req: any, res: any) => {
    const sql = 'SELECT username FROM users';

    db.all(sql, [], (err: any, rows: User[]) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        let details = { users: rows };

        res.json(details);
    })
})

app.post('/signup', async (req: any, res: any) => {
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

app.get('/user/:uName', (req: any, res: any) => {
    const username = req.params.uName;

    const getUserByUsernameQuery = 'SELECT username, password_hash FROM users WHERE username = ?';

    db.all(getUserByUsernameQuery, [username], (err: any, rows: LoginFormData[]) => {
        if (err) {
            console.error(err);
            const errorResponse: ApiResponse = {
                success: false,
                status: 500,
                message: 'Internal Server Error',
            };
            return res.status(errorResponse.status).json(errorResponse);
        }

        if (!rows) {
            const errorResponse: ApiResponse = {
                success: false,
                status: 404,
                message: 'User not found',
            };
            return res.status(errorResponse.status).json(errorResponse);
        }

        const successResponse: ApiResponse = {
            success: true,
            status: 200,
            data: rows[0],
        };
        return res.status(successResponse.status).json(successResponse);
    });
})

app.post('/login', async (req: any, res: any) => {
    try {
        const loginAttempt: LoginFormData = { username: "suyog", password: "satyal" };
        const userDetailURL = 'http://localhost:3000/user/' + loginAttempt.username;
        const userResponse = await axios.get(userDetailURL);
        const credentials = userResponse.data.data;
        console.log(credentials);
        const userData: LoginFormData = { username: credentials.username, password: credentials.password_hash };

        const correctPassword: boolean = bcrypt.compareSync(loginAttempt.password, userData.password);

        if (correctPassword) {
            const token = jwt.sign({ username: userData.username }, jwtSecret, { expiresIn: '1h' });
            console.log('Authenticated');
            const successResponse: ApiResponse = {
                success: true,
                status: 200,
                data: {token}
            };
            return res.status(successResponse.status).json(successResponse);
        }
    } catch (error: any) {
        console.log("Didn't work");
        const errorResponse: ApiResponse = {
            success: false,
            status: 401,
            message: 'Invalid username or password'
        };
        return res.status(errorResponse.status).json(errorResponse);
    }

})



app.listen(3000);//