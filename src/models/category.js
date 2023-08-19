const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  name: String,
  image: String,
  countInStock: {
    type: Number,
    required: [true, "Please enter the number of products in stock"],
  },
});

const Category = mongoose.model("Category", categorySchema);
