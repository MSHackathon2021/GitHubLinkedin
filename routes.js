const express = require('express');
var router = express.Router();
const axios = require('axios')
const passport = require('passport');

const clientID = '4390b5874ad74b454dc0'
const clientSecret = 'e241aa404bcec128197cb9cecf0e13c395535ed0'
var access_token = "";
var userName = "";

router.get('/github/callback', (req, res) => {
  const requestToken = req.query.code
  axios({
    method: 'post',
    url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
    // Set the content type header, so that we get the response in JSON
    headers: {
      accept: 'application/json'
    }
  }).then((response) => {
    access_token = response.data.access_token
    res.redirect('/about');
  })
})

router.get('/about', function (req, res) {
  if (access_token !== null && access_token !== "") {
    axios({
      method: 'get',
      url: `https://api.github.com/user`,
      headers: {
        Authorization: 'token ' + access_token
      }
    }).then((response) => {
      console.log(response);
      userName = response.data.login;
      res.render('pages/about', { userData: response.data });
    })
  }
  else {
    res.redirect('/');
  }
});

router.get('/repositories', function (req, res) {
  if (access_token !== null && access_token !== "") {
    axios({
      method: 'get',
      url: `https://api.github.com/users/${userName}/repos`,
      headers: {
        Authorization: 'token ' + access_token
      }
    }).then((response) => {
      console.log(response);
      res.render('pages/repositories', { repos: response.data });
    })
  }
  else {
    res.redirect('/');
  }
});

router.get('/linkedinLogin', function (req, res) {
  res.render('pages/linkedinLogin.ejs');
});

router.get('/', function (req, res) {
  res.render('pages/home', { client_id: clientID, accesstoken: null });
});

// router.get('*', function(req, res) {
//   res.render('pages/error');
// });

router.get('/linkedin', isLoggedIn, function (req, res) {
  res.render('pages/linkedin.ejs', {
    user: req.user
  });
});

router.get('/home', function (req, res) {
  res.render('pages/home');
});

router.get('/auth/linkedin', passport.authenticate('linkedin', {
  scope: ['r_emailaddress', 'r_liteprofile', 'w_member_social'],
}));

router.get('/auth/linkedin/callback',
  passport.authenticate('linkedin', {
    successRedirect: '/linkedin',
    failureRedirect: '/linkedinLogin'
  }));

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();
  // res.redirect('/linkedinLogin');
  res.redirect('/');
}

module.exports = router;