const express = require('express');

const dotenv = require('dotenv')

const cors = require('cors')

const app = express();

dotenv.config();
const jwtSecret = process.env.JWT_SECRET;

app.use(cors());
app.use(express.json());

import usersRouter from './routes/usersRoutes';
import authRouter from './routes/authRoutes'
import adminRouter from './routes/adminRoutes'

app.use(usersRouter);
app.use(authRouter);
app.use(adminRouter);


app.listen(3000);//