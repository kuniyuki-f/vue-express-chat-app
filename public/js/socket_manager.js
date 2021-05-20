// socket.io
const xssFilters = require('xss-filters');
const sql_manager = require('./sql_manager');
const sqlManager = new sql_manager.sql_manager('express_db');

exports.socket_manager = class {
    constructor(server, sessionMiddleware,) {
        this.io = require('socket.io')(server, {
            cors: {
                origin: true,
                methods: ["GET", "POST",],
                credentials: true
            }
        });

        const wrap =
            middleware =>
                (socket, next) =>
                    middleware(socket.request, {}, next);

        this.io.use(wrap(sessionMiddleware));
    }

    getMessageList = async function (userEmail) {
        const sql = `SELECT * FROM message;`;
        const result = await sqlManager.sql(sql);

        if (result) {
            console.log("SQL Result:", result['rows'][0].email);
            this.io.emit('getMessageList', result['rows']);
        } else {
            this.io.emit('getMessageList', null)
        }
    }
    startSocket = function () {
        this.io.on('connection', async socket => {
            console.log("socket.io: ユーザが接続しました");
            console.log("Request User: ", socket.request.session.passport.user);

            let userEmail = socket.request.session.passport.user;
            console.log(socket.request.session.id)

            this.getMessageList(userEmail);

            socket.on('c2s_message', async data => {
                data.message = xssFilters.inHTMLData(data.message);
                const date = new Date().toISOString().slice(0, 19).replace('T', ' ');

                const sql = `INSERT INTO message(message, createdAt, updatedAt, email) VALUES("${data.message}", "${date}", "${date}", "${userEmail}");`;
                const result = await sqlManager.insert(sql);

                if (result) {
                    console.log(data.message + 'を保存しました');
                    this.io.emit('s2c_message', { id: result.insertId, text: data.message });
                    this.getMessageList(userEmail);
                }
            });

            socket.on('c2s_delete_message', async msg => {
                console.log(msg.email == socket.request.session.passport.user);
                if (msg.email == socket.request.session.passport.user) {
                    const sql = `DELETE FROM message WHERE id = ${msg.id}`;
                    const result = await sqlManager.sql(sql);
                    if (result) {
                        console.log("id:" + msg.id + "を削除しました");
                        this.getMessageList(userEmail);
                    }
                } else {
                    console.log('不正なリクエストです');
                }
            });
        });
    }
}