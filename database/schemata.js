const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const { Schema } = mongoose;
const { Mixed, ObjectId } = Schema.Types;

// feature UNION namespace
const featureSchema = new Schema({
  name: {
    type: String, // name of feature
    required: true,
    unique: true
  },
  type: String, // 'atomic' | 'namespace'
  entries: [String]
});

// environment: holds whether features are enabled
const environmentSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }, // name of environment
  featureValues: Mixed // key-val pair of feature enabled/disabled
});

// log entry, pertaining to a specific flag
const logSchema = new Schema({
  flag: String,
  environment: String, // can be NULL for cross-environment events
  user: String, // IP address
  info: String, // what happened?
  date: {
    type: Date,
    index: true
  }
});

logSchema.statics.findForFlag = function(flag) {
  // null is required for cross-environment events
  return this.find({ flag: { $in: [flag, null] } }).sort({ date: -1 });
};

featureSchema.statics.findByName = function(name) {
  return this.findOne({ name });
};

environmentSchema.statics.findByName = function(name) {
  return this.findOne({ name });
};

environmentSchema.statics.getNames = function(name) {
  return this.find({}).then(
    envs => {
      return envs.map(x => x.name);
    },
    err => {
      console.log(err);
      return err;
    }
  );
};

featureSchema.statics.getAll = function(name) {
  return this.find({}).then(
    features => features.map(x => x.toObject()),
    err => {
      console.log(err);
      return err;
    }
  );
};

module.exports = {
  Feature: mongoose.model("Feature", featureSchema),
  Environment: mongoose.model("Environment", environmentSchema),
  Log: mongoose.model("Log", logSchema)
};
