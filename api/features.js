var express = require("express");
var router = express.Router();
var { Feature } = require("../database/schemata");

router.post("/", (req, res) => {
  const updateAndSend = function(feature) {
    feature.save().then(
      () => {
        return res.redirect("back");
      },
      err => {
        return res.send(err);
      }
    );
  };
  const { featureName: name, namespace } = req.body;
  if (name.includes(".")) return res.send("name cannot include a period.");
  if (namespace) {
    Feature.findByName(namespace).then(
      feature => {
        if (!feature) {
          return res.send("namespace not found");
        }
        // add name to namespace
        feature.entries = [...(feature.entries || []), name];
        updateAndSend(feature);
      },
      err => {
        return res.send(err);
      }
    );
  } else {
    updateAndSend(
      new Feature({
        name,
        type: "atomic"
      })
    );
  }
});

module.exports = router;
