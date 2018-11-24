module.exports = function(root) {

  const session = require('express-session');
  const passport = require('passport');
  const crypto = require('crypto');
  const LocalStrategy = require('passport-local').Strategy;
  const User = root.db.use('users').schema;
  const cookieParser = require('cookie-parser');
  const bodyParser = require('body-parser');

  root.app.use(cookieParser('secret-login-string'));
  root.app.use(bodyParser.json());
  root.app.use(session({
      secret: 'secret-login-string',
      resave: true,
      saveUninitialized: false
    }));
  root.app.use(passport.initialize());
  root.app.use(passport.session());

  passport.use('login', new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'pass',
    },
    function(email, pass, done) {

      User.model('users').findOne({ email: email }, function (err, user) {

        if (err) { return done(err); }
        if (!user) { return done(null, false, {message: 'User not found.'}); }
        if (!verifyPassword(pass, user.password)) { return done(null, false, {message: 'Incorrect password.'}); }

        return done(null, user);
      });
    }
  ));

  passport.serializeUser(function(user, done) {
      done(null, user);
  });

  passport.deserializeUser(function(id, done) {
    User.model('users').findById(id, function (err, user) {
        done(err, user);
    });
  });



  function verifyPassword(posted_pass, user_pass) {

      let _pass = crypto.createHash('sha256').update( posted_pass ).digest('hex');

  return _pass === user_pass ? true : false;
  }


  function getPassport() {
    return passport;
  }


  return {
    passport: getPassport
  };

};
