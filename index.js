const express = require('express')
const mongoose = require('./database');
const bcrypt = require('bcryptjs');
const app = express()


app.use(
    express.urlencoded({
        extended: true,
    }),
)

app.use(express.json())

const userRoutes = require('./routes/userRoutes')

app.use('/user', userRoutes)


app.listen(3000)