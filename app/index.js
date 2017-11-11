var express = require("express");

// sub-applciation allows use of templating engine
var router = express();
var { Feature, Environment } = require("../database/schemata");

const envPage = require("./environment");

router.set("view engine", "pug");
router.set("views", "app/views");

router.get("/:environment", envPage);

router.get("/", (req, res) => {
  Environment.getNames().then(
    names => {
      return res.render("main", { names });
    },
    err => {
      console.log(err);
      res.status(500);
      return res.send("An error occurred.");
    }
  );
});

module.exports = router;
