const Order = require("../models/category");
const express = require("express");
const router = new express.Router();

router.get("/", async (req, res) => {
  const categories = await Order.find();

  if (!categories) {
    return res.status(500).send({
      message: "No categories found",
    });
  }

  res.status(200).send(categories);
});

module.exports = router;
