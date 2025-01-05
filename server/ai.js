var express = require('express');
const axios = require('axios');

var router = new express();
const APIKEY = "AIzaSyA4kXUZvlAoLwjblqwZblI-xkO_xtX9Cwc";

router.post("/generate-content", async (req, res) => {
  let userPrompt = req.body.prompt;
  let url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${APIKEY}`;
  let prompt = "Can you please build a LinkedIn post which is more professional and informative about the given topic?";
  prompt += `The topic is ${userPrompt}.`;
  prompt += "Strictly follow these instructions";
  prompt += "1. Make sure there is no spelling mistake and factual mistake in the content"
  prompt += "2. Please provide only the content in a valid format without any additional words or prefixes"
  // prompt += "2. Please provide only the content in a valid parsable JavaScript JSON format, and place only the content inside the key 'post'."
  prompt += "3. Do not include any other extra characters or words which is make the parsing fails";
  prompt += "4. Remove characters like (`, json, \n, \t, \r) and etc. in the response"

  var payload = {
    "contents": {
      "parts": [{
        "text": prompt
      }]
    }
  }

  await axios.post(url, payload, {
     "Content-Type": "application/json"
  }).then ((response) => {
    console.log("Response Successfull");
    console.log(response.data);
    res.send({status: 200, content: response.data.candidates[0]["content"].parts[0].text});
  }).catch((error) => {
    console.log("Error while Fetching content");
    console.log(error);
    // throw error.response.data;
    // res.send({status: 400, error: error, info: error.response.data});
  });
});

module.exports = router;
