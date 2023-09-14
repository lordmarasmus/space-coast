const mongoose = require('mongoose');

const idImageSchema = new mongoose.Schema({
  image1: {
    data: Buffer,
    contentType: String,
  },

  image2: {
    data: Buffer,
    contentType: String,
  },
})

const Image = mongoose.model('idImage', idImageSchema);

module.exports = Image;