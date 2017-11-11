var express = require("express");
var router = express.Router();
var { Feature } = require("../database/schemata");

router.post("/", (req, res) => {
  const { featureName: name } = req.body;
  new Feature({
    name,
    type: "atomic"
  })
    .save()
    .then(
      () => {
        return res.redirect("back");
      },
      err => {
        return res.send(err);
      }
    );
});

module.exports = router;
