// setting express
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const app = express();

// setting cors policy 
const cors = require('cors');
app.use(cors({
    origin: true,
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

const sessionOption = {
    key: 'express.sid',
    secret: 'keyboard cat',
    resave: false,
    store: sessionStore,
    saveUninitialized: true,
};
const sessionMiddleware = session(sessionOption);
app.session = sessionMiddleware;
app.use(sessionMiddleware);

// setting routes
const routes = require('./routes');

app.use('/', routes.router);

// run server
const server = app.listen(3000, () => {
    console.log('server running on port 3000');
});

// socket.io
const socket_manager = require('./public/js/socket_manager.js');
const socketManager = new socket_manager.socket_manager(server, sessionMiddleware,);
socketManager.startSocket();