const mongoose = require("mongoose");

const Solve = mongoose.model(
  "Solve",
  new mongoose.Schema({
    time: String,
    scamble: String,
    user: String
  })
);

module.exports = Solve;