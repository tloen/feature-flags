const mongoose = require("mongoose");
mongoose.Promise = global.Promise; // use ES6 promises

// ideally, these should be environment variables on the server
// they should NEVER be hard-coded, especially not in a public repository!
const username = "user1";
const password = "opengov";
const database = "db-flags";
const host = "ds159235.mlab.com:59235";
const connectionString = `mongodb://${username}:${password}@${host}/${database}`;

module.exports = function connectDatabase() {
  mongoose
    .connect(connectionString, {
      useMongoClient: true
    })
    .then(
      () => {
        console.log("database connection successful");
      },
      err => {
        console.log("ERROR: failed to connect to database");
        console.log(err);
      }
    );
};
