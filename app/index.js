var express = require("express");
var router = express.Router();

const envPage = require("./environment");

router.get("/:environment", envPage);

router.get("/", (req, res) => {
  return res.send("main page not implemented");
});

module.exports = router;
