var express = require('express');
const axios = require('axios');

var router = new express();

router.post("/create", async (req, res) => {
  let body = req.body;
  let content = body.content;
  const UID = body.uid;

  let url = "https://api.linkedin.com/rest/posts";
  const headers = {
    'Authorization': `Bearer ${body.accessToken}`,
    'Content-Type': 'application/json',
    "LinkedIn-Version": "202411",
    'X-Restli-Protocol-Version': '2.0.0'
  };

  let payload = {
    "author": `urn:li:person:${UID}`,
    "commentary": `${content}`,
    "visibility": "PUBLIC",
    "distribution": {
      "feedDistribution": "MAIN_FEED",
      "targetEntities": [],
      "thirdPartyDistributionChannels": []
    },
    "lifecycleState": "PUBLISHED",
    "isReshareDisabledByAuthor": false
  }
  // return this.http.post('https://api.linkedin.com/ugcPosts', body, { headers }).toPromise();
  let post = "";
  await axios.post(url, payload , {
    headers: headers
  }).then ((response) => {
    console.log("Post creation response successfull");
    console.log(response);
    if(response.status == 201) {
      post = response.headers["x-restli-id"];
    }
    res.send({status: 200, post: post});
  }).catch((error) => {
    console.log("Error while posting content");
    console.log(error);
    res.send({status: 400, error: error, info: error.response.data});
  });
});

module.exports = router;
