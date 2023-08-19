const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: String,
  image: String,
  countInStock: {
    type: Number,
    required: [true, "Please enter the number of products in stock"],
  },
});

const Product = mongoose.model("product", productSchema);

module.exports = Product;
