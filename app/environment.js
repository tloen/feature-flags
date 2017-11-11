var express = require("express");

// accept environment param from above
var router = express.Router({ mergeParams: true });

router.get("/:environment", (req, res) => {
  return res.send("environment page not implemented");
});

module.exports = router;
