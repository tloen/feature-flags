var express = require("express");
var router = express.Router();
var { Feature } = require("../database/schemata");

router.post("/", (req, res) => {
  const { namespaceName: name } = req.body;
  console.log(name);
  new Feature({
    name,
    type: "namespace",
    entries: []
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
