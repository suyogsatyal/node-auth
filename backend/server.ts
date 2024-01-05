
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

app.use(usersRouter);
app.use(authRouter);



app.listen(3000);//