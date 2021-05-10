// setting express
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const app = express();

// setting cors policy 
const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true,
    exposedHeaders: ['set-cookie'],
    optionsSuccessStatus: 200
}));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());
const MySQLStore = require('express-mysql-session')(session);
const sessionStore = new MySQLStore({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'express_db'
});

app.use(session({
    key: 'express.sid',
    secret: 'keyboard cat',
    resave: false,
    store: sessionStore,
    saveUninitialized: true,
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
