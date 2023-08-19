const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  name: String,
  image: String,
  countInStock: {
    type: Number,
    required: [true, "Please enter the number of products in stock"],
  },
});

const Order = mongoose.model("Order", orderSchema);
