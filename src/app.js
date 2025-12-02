const express = require('express');
const cors = require('cors');
const authRouter = require('./routers/Auth.router');
const userRouter = require('./routers/User.router');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.use('/auth', authRouter);
app.use('/user', userRouter);

module.exports = app;
