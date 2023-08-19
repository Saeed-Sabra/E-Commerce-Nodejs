const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: String,
  image: String,
  countInStock: {
    type: Number,
    required: [true, "Please enter the number of products in stock"],
  },
});

const User = mongoose.model("User", userSchema);
