const express = require('express');
const jwt = require('jsonwebtoken');
const { format } = require('date-fns');
const dateTime = format(new Date(), 'MM/dd/yyyy, HH:mm:ss:SS');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors')

const dbPath = path.join(__dirname, '../db', 'database.db')
const db = new sqlite3.Database(dbPath);
const app = express();

app.use(cors());
app.use(express.json());


app.get('/count', (_req:any, res:any) =>{
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

app.listen(3000);//