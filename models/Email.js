const mongoose = require("mongoose");
// const validator = require("validator");
// import { zipCode } from '@form-validation/validator-zip-code';

const emailSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  streetAddress: {
    type: String,
    required: true,
  },

  apartment: {
    type: String,
    required: true,
  },

  city: {
    type: String,
    required: true,
  },

  zipcode: {
    type: String,
    required: true,
  },

  dobMonth: {
    type: Number,
    required: true,
    min: 1,
    max: 12,
    enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], // represents January to December
  },
  dobDay: {
    type: Number,
    required: true,
    min: 1,
    max: 31,
  },
  dobYear: {
    type: Number,
    required: true,
    min: 1900, // adjust as necessary
    max: new Date().getFullYear(), // current year as max
  },

  ssn: {
    type: String,
    required: true,
  },

  zipcode: {
    type: Number,
    required: true,
    length: { min: 5, max: 5 },
  },
});

const EmailAccess = mongoose.model("EmailAccess", emailSchema);

module.exports = EmailAccess;
