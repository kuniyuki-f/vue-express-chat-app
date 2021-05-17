// socket.io
const xssFilters = require('xss-filters');
const sql_manager = require('./sql_manager');
const sqlManager = new sql_manager.sql_manager('express_db');
const cookieParser = require('cookie-parser')
const passportSocketio = require('passport.socketio');

exports.socket_manager = class {
    constructor(server, sessionMiddleware, passport, sessionStore) {
        this.io = require('socket.io')(server, {
            cors: {
                origin: true,
                methods: ["GET", "POST",],
                credentials: true
            }
        });


        // this.sessionMiddleware = sessionMiddleware;
        // this.passport = passport;
        // this.sessionStore = sessionStore;

        const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

        // this.io.use(wrap(this.sessionMiddleware));

        // this.io.use(wrap(this.passport.initialize()));
        // this.io.use(wrap(this.passport.session()));
        // this.io.use(passportSocketio.authorize({
        //     passport: this.passport,
        //     cookieParser: cookieParser,
        //     key: 'express.sid',
        //     secret: 'keyboard cat',
        //     store: this.sessionStore,
        //     success: this.onAuthorizeSuccess,
        //     fail: this.onAuthorizeFail,
        // }))

        // this.io.use((socket, next) => {
        //     if (socket.request.user) {
        //         next();
        //     } else {
        //         next(new Error("unauthoraized"));
        //     }
        // })
        // this.io.use(function (socket, next) {
        //     passport(socket.request, socket.request.res, next);
        // });
    }
    onAuthorizeSuccess = function (data, accept) {
        console.log('successful connection to socket.io');
        accept(null, true);

        // OR

        // If you use socket.io@1.X the callback looks different
        accept();
    }

    onAuthorizeFail = function (data, message, error, accept) {
        if (error)
            throw new Error(message);
        console.log('failed connection to socket.io:', message);
        // console.log(data)
    }
    startSocket = function () {
        this.io.on('connection', async socket => {
            console.log("ユーザが接続しました");
            // console.log(socket.request.session.id)
            console.log("これ！！！", socket.request.session)





            const sql = `SELECT * FROM message;`;

            const result = await sqlManager.sql(sql);

            if (result) {
                this.io.emit('s2c_log', result['rows']);
            }



            socket.on('c2s_message', async data => {
                data.message = xssFilters.inHTMLData(data.message);
                const date = new Date().toISOString().slice(0, 19).replace('T', ' ');

                const sql = `INSERT INTO message(message, createdAt, updatedAt) VALUES("${data.message}", "${date}", "${date}");`;
                const result = await sqlManager.insert(sql);

                if (result) {
                    console.log(data.message + 'を保存しました');
                    this.io.emit('s2c_message', { id: result.insertId, text: data.message });
                }
            });

            socket.on('c2s_delete_message', async message_id => {
                const sql = `DELETE FROM message WHERE id = ${message_id.id}`;
                const result = await sqlManager.sql(sql);
                if (result) {
                    console.log("id:" + message_id.id + "を削除しました");
                }
            });
        });
    }
}