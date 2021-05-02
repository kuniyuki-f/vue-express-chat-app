// setting express
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());
app.use(session({
    key: 'express.sid',
    secret: 'keyboard cat',
    store: new MySQLStore("express_db", "root", ""),
    resave: false,
    saveUninitialized: true,
}));

// setting cors policy 
const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true,
    optionsSuccessStatus: 200
}));

// setting routes
app.use('/', require('./routes'));

// run server
const server = app.listen(3000, () => {
    console.log('server running on port 3000');
});

// socket.io
const socket_manager = require('./public/js/socket_manager.js');
const { sql_manager } = require('./public/js/sql_manager');
socket_manager.socket_manager(server);
