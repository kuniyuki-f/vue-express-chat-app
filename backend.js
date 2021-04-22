const express = require('express');
const app = express();

const socket_manager = require('./public/js/socket_manager.js');

// setting cors policy 
const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true,
    optionsSuccessStatus: 200
}));

// run server
const server = app.listen(3000, () => {
    console.log('server running on port 3000');
});

// socket.io
socket_manager.socket_manager(server);

