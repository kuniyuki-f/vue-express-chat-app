const express = require('express');
const router = express.Router();

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const sql_manager = require('../public/js/sql_manager');
const sqlManager = new sql_manager.sql_manager('express_db');

const bcrypt = require('bcrypt');

const User1 = {
    name: "hoge",
    password: "fuga"
};

const Users = async () => {
    let users = await sqlManager.sql("select * from users");

    users.rows.forEach(element => {
        console.log(element);
    });
    return users.rows;
}



// ローカルストラテジーによる認証
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
}, async (email, password, done) => {
    let sql = `SELECT * FROM users WHERE email = "${email}"`;
    let result = await sqlManager.sql(sql);

    if (result) {
        if (email !== result['rows'][0]['email']) {
            // Error
            return done(null, false,);
        } else if (!bcrypt.compareSync(password, result['rows'][0]['password'])) {
            // Error
            return done(null, false,);
        } else {
            // Success and return user information.
            return done(null, email);
        }
    } else {
        console.log('SQL側でエラーが起きました');
        return done(null, false,);
    }
}
));

// シリアライズ
passport.serializeUser((user, done) => {
    console.log('Serialize ...');
    console.log(user);
    done(null, user);
})
// デシリアライズ
passport.deserializeUser((user, done) => {
    console.log('Deserialize ...');
    done(null, user);
})

router.use(passport.initialize());
router.use(passport.session());

const authMiddleware = (req, res, next) => {
    if (req.isAuthenticated()) {
        console.log("認証済みです");
        next();
    } else {
        console.log(req.isAuthenticated());
        console.log(req.email);
        console.log("未認証です");
    }
}

router.get('/', (req, res) => {
    console.log(req.user);
    res.status(200).send({ test: "tst" });
});

router.post(
    '/login',
    passport.authenticate('local', {
        session: true,
        successRedirect: "/user",
        failureRedirect: "/login",
    }), (req, res) => {
        console.log(req.user);
        res.status(200).send({ user: req.user });
    }
)

router.get('/user', authMiddleware, (req, res) => {
    console.log(req.user);
    console.log('ログイン完了！');
});

router.post('/entry', async (req, res) => {
    const name = req.body.user.name;
    const email = req.body.user.email;
    const password = req.body.user.password;
    const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    console.log(date)
    const sql = `INSERT INTO users(name, email, password, createdAt, updatedAt) VALUES("${name}", "${email}", "${password}", "${date}", "${date}");`
    const result = await sqlManager.insert(sql);
    if (result) {
        console.log("insert success: ", result);
        res.status(200).send({ msg: "登録成功", result: result })
    } else {
        res.status(400).send({ msg: "登録失敗" },)
    }
})

module.exports = router;