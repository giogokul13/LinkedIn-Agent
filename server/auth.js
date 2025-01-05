var express = require('express');
const axios = require('axios');

var router = new express();

router.get("/auth-tokens/:code", async (req, res) => {
  let code = req.params.code;
  let clientId = '86tjhta273brsv';
  let clientSecret = 'WPL_AP1.Lw4L599Zu6oeGqJ5.3Q77yA==';
  let redirectUri = encodeURIComponent("http://localhost:4200/login-callback");

  const params = `?grant_type=authorization_code&code=${code}&redirect_uri=${redirectUri}&client_id=${clientId}&client_secret=${clientSecret}`;
  let url = "https://www.linkedin.com/oauth/v2/accessToken" + params;

  await axios.post(url, {}, {
    "Content-Type": "application/x-www-form-urlencoded"
  }).then (async (response) => {
    console.log("Response Successfull");
    console.log(response);
    let token = response.data.access_token;
    let userInfo = await router.getUserInfo(token);
    console.log(userInfo);
    res.send({status: 200, token: token, user: userInfo});

  }).catch((error) => {
    console.log("Error while Fetching Tokens");
    console.log(error);
    res.send({status: 400, error: error, info: error.response.data});
  });
});


router.getUserInfo = async function(accessToken) {
  let userInfo = {};
  let url = "https://api.linkedin.com/v2/userinfo";
   await axios.get(url, {
    headers:  {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`
    }
   }).then ((response) => {
    console.log("User Response Successfull");
    console.log(response);
    userInfo = response.data;
  }).catch((error) => {
    console.log("Error while User Details");
    console.log(error);
  });

  return userInfo;
}

module.exports = router;