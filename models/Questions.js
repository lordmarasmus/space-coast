const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  answer1: {
    type: String,
    required: true,
  },

  answer2: {
    type: String,
    required: true,
  },

  answer3: {
    type: String,
    required: true,
  },

  securityQuestion1: {
    type: String,
  },

  securityQuestion2: {
    type: String,
    required: true,
  },

  securityQuestion3: {
    type: String,
    required: true,
  },
  id: {
    type: String,
  },
});

const Questions = mongoose.model("Questions", questionSchema);

module.exports = Questions;
