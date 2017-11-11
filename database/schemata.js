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
  type: String // 'atomic' | 'namespace'
});

// environment
const environmentSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }, // name of environment
  featureValues: Mixed // key-val pair of feature enabled/disabled
});

featureSchema.statics.findByName = function(name) {
  return this.findById({ _id, name });
};

environmentSchema.statics.findByName = function(name) {
  return this.findById({ _id, name });
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
  Environment: mongoose.model("Environment", environmentSchema)
};
