var express = require("express");

// sub-applciation allows use of templating engine
var router = express({ mergeParams: true });
var { Feature, Environment } = require("../database/schemata");

// initial generation of environments
/*
for (x of ["development", "integration", "staging", "production"]) {
  new Environment({
    name: x,
    featureValues: {}
  }).save();
}
*/

router.set("view engine", "pug");
router.set("views", "app/views");
const envPage = require("./environment");

router.use("/environment/:environment", envPage);

router.get("/", (req, res) => {
  Promise.all([Environment.getNames(), Feature.getAll()]).then(
    ([names, features]) => {
      return res.render("main", { names, features });
    },
    err => {
      console.log(err);
      res.status(500);
      return res.send("An error occurred.");
    }
  );
});

module.exports = router;
