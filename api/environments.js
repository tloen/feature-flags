var express = require("express");
var router = express.Router();

var { Environment, Feature } = require("../database/schemata");

router.post("/:environmentName/feature/:featureName", (req, res) => {
  const { environmentName, featureName } = req.params;
  console.log(environmentName, featureName);
  Promise.all([
    Environment.findByName(environmentName),
    Feature.findByName(featureName)
  ]).then(
    ([environment, feature]) => {
      if (!environment || !feature) {
        return res.send("environment or feature does not exist");
      }
      environment.featureValues = environment.featureValues || {};
      if (feature.type == "atomic") {
        const orig = environment.featureValues[feature.name] || false;
        environment.featureValues[feature.name] = !orig;
        environment.markModified("featureValues");
        environment.save().then(
          () => {
            res.redirect("back");
          },
          err => {
            res.send(err);
          }
        );
      }
    },
    err => {
      return res.send("database lookup error");
    }
  );
});

module.exports = router;
