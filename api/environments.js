var express = require("express");
var router = express.Router();

var { Environment, Feature } = require("../database/schemata");

router.post("/:environmentName/feature/:featureName", (req, res) => {
  const { environmentName, featureName } = req.params;
  Promise.all([
    Environment.findByName(environmentName),
    Feature.findByName(featureName)
  ]).then(
    ([environment, feature]) => {
      if (!environment || !feature || feature.type !== "atomic") {
        return res.send("environment or feature does not exist");
      }
      environment.featureValues = environment.featureValues || {};
      environment.featureValues[feature.name] = !environment.featureValues[
        feature.name
      ];
      // mongoose doesn't detect changed subdoc
      environment.markModified("featureValues");
      environment.save().then(
        () => {
          res.redirect("back");
        },
        err => {
          res.send(err);
        }
      );
    },
    err => {
      return res.send("database lookup error");
    }
  );
});

router.post(
  "/:environmentName/namespace/:namespaceName/feature/:featureName",
  (req, res) => {
    // remember that we model namespaces as features with subfeatures
    const {
      environmentName,
      namespaceName: featureName,
      featureName: entry
    } = req.params;
    console.log(environmentName, featureName);
    Promise.all([
      Environment.findByName(environmentName),
      Feature.findByName(featureName)
    ]).then(
      ([environment, feature]) => {
        if (!environment || !feature || feature.type != "namespace") {
          return res.send("environment or namespace does not exist");
        }
        environment.featureValues = environment.featureValues || {};
        environment.featureValues[feature.name] =
          environment.featureValues[feature.name] || {};
        environment.featureValues[feature.name][entry] = !environment
          .featureValues[feature.name][entry];

        // mongoose doesn't detect changed subdoc
        environment.markModified("featureValues");
        environment.markModified("featureValues." + feature.name);
        environment.save().then(
          () => {
            res.redirect("back");
          },
          err => {
            res.send(err);
          }
        );
      },
      err => {
        return res.send("database lookup error");
      }
    );
  }
);

module.exports = router;
