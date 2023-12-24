const express = require('express');
const jwt = require('jsonwebtoken');
const { format } = require('date-fns');
const dateTime = format(new Date(), 'MM/dd/yyyy, HH:mm:ss:SS');

const app = express();

app.get('/', (_req:any, res:any) =>{
    res.end(dateTime);
})

app.listen(3000);//