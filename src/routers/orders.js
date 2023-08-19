const Order = require("../models/order");
const express = require("express");
const router = new express.Router();

router.get("/", async (req, res) => {
  const orders = await Order.find();

  if (!orders) {
    return res.status(500).send({
      message: "No orders found",
    });
  }

  res.status(200).send(orders);
});

module.exports = router;
