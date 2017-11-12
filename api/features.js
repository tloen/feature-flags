var express = require("express");
var router = express.Router();
var { Feature, Log } = require("../database/schemata");

router.post("/", (req, res) => {
  const updateAndSend = function(feature) {
    return feature.save().then(
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
  console.log(namespace);
  if (namespace != "(none)") {
    Feature.findByName(namespace).then(
      feature => {
        if (!feature) {
          return res.send("namespace not found");
        }
        // add name to namespace
        feature.entries = [...(feature.entries || []), name];
        updateAndSend(feature).then(() => {
          new Log({
            flag: namespace + "." + featureName,
            environment: null,
            user: req.ip,
            info: "created", // what happened?
            date: new Date()
          }).save();
        });
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
    ).then(() => {
      new Log({
        flag: name,
        environment: null,
        user: req.ip,
        info: "created", // what happened?
        date: new Date()
      }).save();
    });
  }
});

module.exports = router;
