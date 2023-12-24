const express = require('express');
const jwt = require('jsonwebtoken');
const { format } = require('date-fns');
const fetch = require('node-fetch');
const dateTime = format(new Date(), 'MM/dd/yyyy, HH:mm:ss:SS');
import { LoginFormData } from '../utils/interface';
const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');

const path = require('path');
const cors = require('cors')

const dbPath = path.join(__dirname, '../db', 'database.db')
const db = new sqlite3.Database(dbPath);
const app = express();

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
        //     let test = "ram";

        // if (details.users) {
        //     // Check if the test username already exists
        //     const usernameExists = details.users.some(user => user.username === test);
        //     if (usernameExists) {
        //         // Username already exists, return an error response
        //         res.status(409).json({ error: 'Username already exists' });
        //     } else {
        //         // Username is unique, add it to the users arra
        //         res.status(201).json({ success: 'User created successfully' });
        //     }
        // }
    })
})

app.post('/signup', async (req: any, res: any) => {
    try {
        const newUser: LoginFormData = req.body;
        const response = await axios.get('http://localhost:3000/users');

        const userList: User[] = response.data.users;
        console.log(newUser);
        const usernameExists = userList.some((user) => user.username === newUser.username);

        if (usernameExists) {
            // Username already exists, return an error response
            return res.status(400).json({ error: 'Username already exists' });
        } else {
            // Username is unique, add it to the users arra
            return res.status(201).json({ success: 'User created successfully' });
        }
    } catch (error: any) {
        if (error instanceof Error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});


app.listen(3000);//