const express = require('express');
var router = express.Router();
const axios = require('axios')
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const { SetCache, GetCache } = require('./cache');
const { GetGitHubUserData } = require('./Util/Helper');
const clientID = '4390b5874ad74b454dc0'
const clientSecret = 'e241aa404bcec128197cb9cecf0e13c395535ed0'
var gitAccessToken = "";
var tempUserId = "";
var gitHubUser = "";

router.get('/github/callback', (req, res) => {
  const requestToken = req.query.code
  axios({
    method: 'post',
    url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
    headers: {
      accept: 'application/json'
    }
  }).then((response) => {
    gitAccessToken = response.data.access_token;
    tempUserId = uuidv4().toString().replace("-", "");
    SetCache(`${tempUserId}:access`, gitAccessToken);
    res.redirect(`http://localhost:3000/auth/linkedin`);
  })
})

router.get('/', async function (req, res) {
  res.render('pages/home', { client_id: clientID, accesstoken: null });
});

router.get('/user', async function (req, res) {

  var linkedinUser = await GetCache(`${req.query.userId}:user`);
  GetGitHubUserData(req.query.token).then((response) => {
    gitHubUser = response;
    var obj = { ...JSON.parse(linkedinUser), ...gitHubUser };
    res.send(obj);
  });
});

router.get('/linkedin', isLoggedIn, function (req, res) {
  var user = {
    Linkedin: {
      Displayname: req.user.displayName,
      Photo: req.user.photos[0].value
    }
  }
  SetCache(`${tempUserId}:user`, JSON.stringify(user));
  res.redirect(`http://localhost:3001?userdId=${tempUserId}&gitaccessToken=${gitAccessToken}`);
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
  res.redirect('/');
}

module.exports = router;