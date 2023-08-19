const express = require("express");
const Product = require("../models/product");
const router = new express.Router();


router.get("/", async (req, res) => {
  const products = await Product.find();

  if (!products) {
    return res.status(500).json({
      message: "No Products Found",
    });
  }

  res.status(200).send(products);
});

router.post("/", async (req, res, next) => {
  const product = new Product({
    name: req.body.name,
    image: req.body.image,
    countInStock: req.body.countInStock,
  });

  try {
    await product.save();
    res.status(201).send(product);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
