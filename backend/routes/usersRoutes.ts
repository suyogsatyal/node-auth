const express = require('express');
const usersRouter = express.Router();
import { ApiResponse, User } from '../../utils/interface';
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, '../../db', 'database.db')
const db = new sqlite3.Database(dbPath);


usersRouter.get('/count', (_req: any, res: any) => {
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

usersRouter.get('/users', (_req: any, res: any) => {
    const sql = 'SELECT username FROM users';

    db.all(sql, [], (err: any, rows: User[]) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        let details = { users: rows };

        res.json(details);
    })
})

usersRouter.get('/admins', (_req: any, res: any) => {
    const sql = 'SELECT username FROM users WHERE admin_access = 1';

    db.all(sql, [], (err: any, rows: User[]) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        let details = { users: rows };

        res.json(details);
    })
})

usersRouter.get('/user/:uName', (req: any, res: any) => {
    const username = req.params.uName;

    const getUserByUsernameQuery = 'SELECT username, password_hash, admin_access, contributor_access, viewer_access, about FROM users WHERE username = ?';

    db.all(getUserByUsernameQuery, [username], (err: any, rows: any) => {
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

usersRouter.get('/adminsData', (_req: any, res: any) => {
    const sql = 'SELECT user_id, username, admin_access, contributor_access, viewer_access FROM users WHERE admin_access = 1';

    db.all(sql, [], (err: any, rows: any) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // Count the number of users with admin_access: 1

        let details = { admins: rows };
        res.json(details);
    });
})

export default usersRouter