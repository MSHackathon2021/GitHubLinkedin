const axios = require('axios')

module.exports = {
  GetGitHubUserData: async function (access_token) {
    try {
      let userRes = await axios({
        method: 'get',
        url: `https://api.github.com/user`,
        headers: {
          Authorization: 'token ' + access_token
        }
      });
      var gitUser = {
        Git: {
          avatar_url: userRes.data.avatar_url,
          url: userRes.data.avatar_url,
          login: userRes.data.login,
          name: userRes.data.name,
          repos: []
        }
      };

      let orgRes = await axios({
        method: 'get',
        url: `https://api.github.com/users/${userRes.data.login}/repos`,
        headers: {
          Authorization: 'token ' + access_token
        }
      });

      for (var i = 0; i < orgRes.data.length; i++) {
        gitUser.Git.repos.push(orgRes.data[i].name);
      }
      return gitUser;

    }
    catch (err) {
      console.error(err);
      var gitUser = {
        Git: { avatar_url: "", url: "", login: "", name: "", repos: [] }
      };
      return gitUser;
    }
  },
  GetGitHubOrg: async function (access_token) {
    axios({
      method: 'get',
      url: `https://api.github.com/user`,
      headers: {
        Authorization: 'token ' + access_token
      }
    }).then((response) => {
    })
  },
  GetGitHubRepo: async function (access_token) {
    axios({
      method: 'get',
      url: `https://api.github.com/user`,
      headers: {
        Authorization: 'token ' + access_token
      }
    }).then((response) => {
    })
  }
}