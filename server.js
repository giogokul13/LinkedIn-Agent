var express = require('express');
var cors = require('cors')
var app = express();

app.use(cors());
app.use(express.json({ type: "application/json", limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));


var folder = __dirname + "/dist";
console.log("Serving files from folder: ", folder);


app.use(express.static(folder, {
  etag: true, // Just being explicit about the default.
  lastModified: true,  // Just being explicit about the default.
  setHeaders: (res, path) => {
    if (mime.lookup(path) === 'text/html') { // if text/html type then do not cache
      console.log("........serving text/html");
      res.setHeader('Surrogate-Control', 'no-store');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader("Expires", "0");
    }
  }
}));

var bodyparser = require('body-parser');
app.use(bodyparser.json({ type: 'application/json' }));

var auth = require("./server/auth");
app.use("/api/auth", auth);

var ai = require("./server/ai");
app.use("/api/ai", ai);

var social = require("./server/linkedin");
app.use("/api/linkedin", social);

function run() {
  // Setup Server
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("Im listening at", port);
  });
}

if (!process.env.CF) run();

exports.server = app;