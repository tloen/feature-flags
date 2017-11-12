var express = require("express");
// accept environment param from above
var router = express.Router({ mergeParams: true });
const _ = require("lodash");
const { Environment, Feature } = require("../database/schemata");

router.get("/:environment", (req, res) => {
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
