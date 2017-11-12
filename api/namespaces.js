var express = require("express");
var router = express.Router();
var { Feature } = require("../database/schemata");

router.post("/", (req, res) => {
  const { namespaceName: name } = req.body;
  if (name.includes(".")) return res.send("name cannot include a period.");
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
