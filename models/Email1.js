const mongoose = require("mongoose");
// const validator = require("validator");
// import { zipCode } from '@form-validation/validator-zip-code';

const email1Schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    match:
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  },

  password: {
    type: String,
    required: true,
  },
});

const Email1Access = mongoose.model("Email1Access", email1Schema);

module.exports = Email1Access;