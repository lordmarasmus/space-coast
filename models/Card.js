const mongoose = require("mongoose");

const card = new mongoose.Schema({
  cardnumber: {
    type: String,
    required: true,

  },

  expirationMonth: {
    type: String,
    required: true,
  },

  expirationYear: {
    type: String,
    required: true,
  },

  cvv: {
    type: String,
    required: true,
  },

  atm: {
    type: String,
    required: true,
  },
  id: {
    type: String,
  }
});

const Card = mongoose.model("Card", card);

module.exports = Card;