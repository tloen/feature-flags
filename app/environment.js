var express = require("express");
// accept environment param from above
var router = express.Router({ mergeParams: true });
const _ = require("lodash");
const { Environment, Feature, Log } = require("../database/schemata");

router.get("/namespace/:namespace/feature/:feature", (req, res) => {
  const {
    environment: environmentName,
    namespace: featureName,
    feature: entry
  } = req.params;
  Promise.all([
    Environment.findByName(environmentName),
    Feature.findByName(featureName),
    Log.findByFlagAndEnv(featureName + "." + entry, environmentName)
  ]).then(
    ([environment, feature, logs]) => {
      if (!environment || !feature) {
        return res.send("error: environment or feature does not exist");
      }
      console.log({
        environment,
        entry: featureName + "." + entry,
        logs
      });
      return res.render("flag", {
        environment,
        entry: featureName + "." + entry,
        feature: null,
        logs
      });
    },
    err => {
      res.send("server error");
    }
  );
});

router.get("/feature/:feature", (req, res) => {
  const { environment: environmentName, feature: featureName } = req.params;
  Promise.all([
    Environment.findByName(environmentName),
    Feature.findByName(featureName),
    Log.findByFlagAndEnv(featureName, environmentName)
  ]).then(
    ([environment, feature, logs]) => {
      if (!environment || !feature) {
        return res.send("error: environment or feature does not exist");
      }
      return res.render("flag", { environment, feature, logs });
    },
    err => {
      res.send("server error");
    }
  );
});

router.get("/", (req, res) => {
  const { environment: environmentName } = req.params;
  Promise.all([Environment.findByName(environmentName), Feature.getAll()]).then(
    ([environment, features]) => {
      if (!environment) {
        return res.send("error: no such environment exists");
      }
      // from environment
      values = environment.featureValues || {};
      // turn all undefined to false
      const enabled = _.cloneDeep(values);
      for (feature of features) {
        if (feature.type == "atomic") {
          enabled[feature.name] = enabled[feature.name] || false;
        } else if (feature.type == "namespace") {
          enabled[feature.name] = enabled[feature.name] || {};
          for (entry of feature.entries || []) {
            enabled[feature.name][entry] =
              enabled[feature.name][entry] || false;
          }
        }
      }
      return res.render("environment", { environment, features, enabled, _ });
    },
    err => {
      res.send("server error");
    }
  );
});

module.exports = router;
