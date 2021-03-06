var express = require("express");
var router = express.Router();

var { Environment, Feature, Log } = require("../database/schemata");

// toggles single feature
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

      const desc = environment.featureValues[feature.name]
        ? "enabled"
        : "disabled";
      // mongoose doesn't detect changed subdoc
      environment.markModified("featureValues");
      new Log({
        flag: feature.name,
        environment: environment.name,
        user: req.ip,
        info: desc,
        date: new Date()
      }).save();
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

// sets all features in namespace
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
        const desc = environment.featureValues[feature.name][entry]
          ? "enabled"
          : "disabled";
        // mongoose doesn't detect changed subdoc
        environment.markModified("featureValues");
        environment.markModified("featureValues." + feature.name);
        new Log({
          flag: feature.name + "." + entry,
          environment: environment.name,
          user: req.ip,
          info: desc,
          date: new Date()
        }).save();
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

// set all features in namespace
router.post("/:environmentName/namespace/:namespaceName/", (req, res) => {
  // remember that we model namespaces as features with subfeatures
  const { environmentName, namespaceName: featureName } = req.params;
  const { action } = req.body;
  const enable = action == "Enable All";
  Promise.all([
    Environment.findByName(environmentName),
    Feature.findByName(featureName)
  ]).then(
    ([environment, feature]) => {
      if (!environment || !feature || feature.type != "namespace") {
        return res.send("environment or namespace does not exist");
      }
      environment.featureValues = environment.featureValues || {};
      // set all to true
      environment.featureValues[feature.name] = Object.assign(
        ...feature.entries.map(entry => ({
          [entry]: enable
        }))
      );
      const desc = environment.featureValues[feature.name][entry]
        ? "enabled with namespace"
        : "disabled with namespace";
      for (flag of feature.entries) {
        new Log({
          flag: feature.name + "." + flag,
          environment: environment.name,
          user: req.ip,
          info: desc,
          date: new Date()
        }).save();
      }
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
});

module.exports = router;
