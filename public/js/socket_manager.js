// socket.io
const xssFilters = require('xss-filters');
const sql_manager = require('./sql_manager');
const sqlManager = new sql_manager.sql_manager('express_db');

exports.socket_manager = function (server) {
    const io = require('socket.io')(server, {
        cors: {
            origin: "http://localhost:8080",
            methods: ["GET", "POST"],
        }
    });

    io.on('connection', (socket) => {
        console.log("ユーザが接続しました");

        const sql = `SELECT * FROM message;`;
        sqlManager.sql(sql, (result) => {
            io.emit('s2c_log', result);
        })

        socket.on('c2s_message', function (data) {
            data.message = xssFilters.inHTMLData(data.message);

            const sql = `INSERT INTO message(message) VALUES("${data.message}");`;
            sqlManager.sql(
                sql, (result) => {
                    console.log(data.message + "を保存しました");
                    io.emit('s2c_message', { id: result.insertId, text: data.message });
                });

        });

        socket.on('c2s_delete_message', function (message_id) {
            const sql = `DELETE FROM message WHERE id = ${message_id.id}`;
            sqlManager.sql(
                sql, (result) => {
                    console.log("id:" + message_id.id + "を削除しました");
                }
            )
        });
    });
}
