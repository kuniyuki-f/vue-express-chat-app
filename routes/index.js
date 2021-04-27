const express = require('express');
const router = express.Router();

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User1 = {
    name: "hoge",
    password: "fuga"
};

passport.use(new LocalStrategy(
    (username, password, done) => {
        if (username !== User1.name) {
            // Error
            return done(null, false);
        } else if (password !== User1.password) {
            // Error
            return done(null, false);
        } else {
            // Success and return user information.
            return done(null, username);
        }
    }
));

passport.serializeUser((user, done) => {
    console.log('Serialize ...');
    done(null, user);
})

passport.deserializeUser((user, done) => {
    console.log('Deserialize ...');
    done(null, user);
})

router.use(passport.initialize());
router.use(passport.session());

router.post('/login', passport.authenticate('local', {
    session: true,
}),
    (req, res) => {
        console.log(req)
        res.send(
            'success'
        )
    }
)

module.exports = router;