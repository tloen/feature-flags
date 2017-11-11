var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");

const features = require("./features");
const environments = require("./environments");
const namespaces = require("./namespaces");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.use("/features", features);

router.get("/", (req, res) => {
  res.json({
    features: "/api/features",
    environments: "/api/environments",
    namespaces: "/api/namespaces"
  });
});

module.exports = router;
