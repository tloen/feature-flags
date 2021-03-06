const express = require("express");
const connectDatabase = require("./database/connect");
const app = express();

const api = require("./api");
const frontend = require("./app");

connectDatabase();

const port = 3000;

// used for logging IPs
app.enable("trust proxy");

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

app.get("/", (req, res) => {
  return res.redirect("/app");
});

app.listen(process.env.PORT || port);
console.log("Listening on port " + port);
