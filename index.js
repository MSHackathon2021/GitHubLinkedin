/*  EXPRESS */
const express = require('express');
const app = express();
const path = require("path");
const passport = require('passport');
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const session = require('express-session');
const config = require('./config')

const routes = require('./routes');
app.set('view engine', 'ejs');
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET'
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

passport.use(new LinkedInStrategy({
  clientID: config.linkedinAuth.clientID,
  clientSecret: config.linkedinAuth.clientSecret,
  callbackURL: config.linkedinAuth.callbackURL,
  scope: ['r_emailaddress', 'r_liteprofile', 'w_member_social'],
}, function (token, tokenSecret, profile, done) {
  process.nextTick(function () {
    console.log(token)
    return done(null, profile);
  });
}
));

app.use('/', routes);
app.use(express.static(path.join(__dirname, "public")));
const port = process.env.PORT || 2400;
app.listen(port, () => console.log('App listening on port ' + port));

// This is the client ID and client secret that you obtained
// while registering on github app


// Declare the callback route
