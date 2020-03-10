const { getInfo } = require("ytdl-core");
const express = require("express");
var cors = require("cors");

const app = express();

app.use(cors());

app.get("/v/:videoId", function(req, res) {
  getInfo(req.params.videoId).then(function(data) {
    res.status(200);
    res.json(data);
  });
});

app.listen(8000, function() {
  console.log("listening on port 8000");
});
