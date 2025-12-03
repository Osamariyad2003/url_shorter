const mongoose = require("mongoose");
const  {nanoid}  = require("nanoid");


const UrlSchema = new mongoose.Schema({
  full: {
    type: String,
    required: true,
  },
  short: {
    type: String,
    required: true,
    default: () => nanoid.apply.call(null, [8]),
  },
  clicks: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model("urls", UrlSchema);
