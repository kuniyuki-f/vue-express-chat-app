const bcrypt = require('bcrypt');

const express = require('express');
const session = require('express-session');
const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use(session({
    key: 'express.sid',
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}));

const passport = require('passport');
router.use(passport.initialize());
router.use(passport.session());

// シリアライズ
passport.serializeUser((email, done) => {
    console.log('Serialize ...');
    console.log(email);
    done(null, email);
})
// デシリアライズ
passport.deserializeUser((email, done) => {
    console.log('Deserialize ...');
    done(null, email);
})

const sql_manager = require('../public/js/sql_manager');
const sqlManager = new sql_manager.sql_manager('express_db');
const Users = async () => {
    let users = await sqlManager.sql("select * from users");

    users.rows.forEach(element => {
        console.log(element);
    });
    return users.rows;
}

const LocalStrategy = require('passport-local').Strategy;

// ローカルストラテジーによる認証
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
}, async function (email, password, done) {
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

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        console.log("認証済みです");
        return next();
    } else {
        console.log("未認証です");
    }
}

router.get('/', isAuthenticated, async (req, res) => {
    if (req.user) {
        console.log('ログイン状態が保持できていますね：', req.user, req.cookies);
        const sql = `SELECT * FROM users WHERE email = ${req.user}`;
        const result = await sqlManager.sql(sql);
        if (result) {
            console.log("result:", result);
            res.status(200).send({ user: req.user, });
        }
    } else {
        res.status(403).send("ユーザーがいません");
    }
});

// ログイン処理
router.post('/login', passport.authenticate('local', {
    failureRedirect: '/loginFailure',
    successRedirect: '/loginSuccess',
}));

// ログイン成功処理
router.get('/loginSuccess', async (req, res) => {
    console.log('user logged in: ' + req.user);
    const sql = `SELECT * FROM users WHERE email = "${req.user}";`;
    const result = await sqlManager.sql(sql);
    if (result) {
        res.status(200).send({ user: result.rows[0].name });
    }
});

// ログイン失敗処理
router.get('/loginFailure', (req, res) => {
    res.status(401).send('ログインに失敗しました');
})

// ログアウト処理
router.post('/logout', (req, res) => {
    req.logout();
    res.status(200).send('ログアウトに成功しました');
});

// フロント側からログインしているか確認する
router.get('/checkLoggedIn', async (req, res) => {
    if (req.isAuthenticated()) {
        const sql = `SELECT * FROM users WHERE email = "${req.user}";`;
        const result = await sqlManager.sql(sql);
        if (result) {
            res.status(200).send({ isLoggedIn: true, user: result.rows[0].name });
        }
        else {
            res.status(500).send("error");
        }
    } else {
        res.status(200).send({ isLoggedIn: false });
    }
});

// ユーザー登録処理
router.post('/entry', async (req, res) => {
    if (req.body.user.name.length === 0 || req.body.user.email.length === 0 || req.body.user.password.length === 0) {
        res.status(400).send('validation error');
    }
    const name = req.body.user.name;
    const email = req.body.user.email;
    const password = req.body.user.password;
    const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
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