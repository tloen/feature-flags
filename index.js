const express = require("express");
const app = express();

const api = (req, res) => {}; //require("./api");
const frontend = require("./app");

const port = 3000;

function logger(req, res, next) {
  console.log(new Date(), req.method, req.url);
  next();
}

// debug
app.use("/api", api, (req, res) => {
  console.log("handled API request");
});

app.use("/app", frontend, (req, res) => {
  console.log("handled app request");
});

app.listen(process.env.PORT || port);
console.log("Listening on port " + port);
