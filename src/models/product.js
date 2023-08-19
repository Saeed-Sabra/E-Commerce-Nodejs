const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    require: true,
  },

  richDescription: {
    type: String,
    default: " ",
  },

  image: {
    type: String,
    default: " ",
  },

  images: [
    {
      type: String,
      default: " ",
    },
  ],

  brand: {
    type: String,
    default: " ",
  },

  price: {
    type: Number,
    default: 0,
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },

  countInStock: {
    type: Number,
    required: [true, "Please enter the number of products in stock"],
    min: 0,
    max: 255,
  },

  rating: {
    type: Number,
  },

  numReviews: {
    type: Number,
    default: 0,
  },

  isFeatured: {
    type: Boolean,
    default: false,
  },

  dateCreated: {
    type: Date,
    default: new Date(),
  },
});

const Product = mongoose.model("product", productSchema);

module.exports = Product;
