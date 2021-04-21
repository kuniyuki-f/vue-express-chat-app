const express = require('express');
const app = express();
const xssFilters = require('xss-filters');

// setting cors policy 
const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true,
    optionsSuccessStatus: 200
}));



const server = app.listen(3000, () => {
    console.log('server running on port 3000');
});

const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"],
    }
});

io.on('connection', (socket) => {
    console.log("ユーザが接続しました");

    socket.on('c2s_message', function (data) {
        data.message = xssFilters.inHTMLData(data.message);
        io.emit('s2c_message', data);
    });
});

