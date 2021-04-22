const mysql = require('mysql');

exports.sql_manager = class {
    constructor(db_name) {
        this.con = mysql.createConnection({
            host: "localhost",
            user: 'root',
            password: '',
            database: db_name
        });
    }
    sql(sql, func) {
        this.con.query(sql, (err, result) => {
            if (err) throw err;
            func(result);
        });
    }

}