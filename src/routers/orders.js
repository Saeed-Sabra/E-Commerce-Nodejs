const Order = require("../models/order");
const OrderItem = require("../models/order-item");
const express = require("express");
const router = new express.Router();

router.get("/", async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name")
    .sort({ dateOrdered: -1 });

  if (!orders) {
    return res.status(400).send({
      message: "No orders found",
    });
  }

  res.status(200).send(orders);
});

router.get("/:id", async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name")
    .populate({ path: "orderItems", populate: "product" });

  try {
    if (!order) {
      return res.status(400).send({
        message: "No orders found",
      });
    }
    res.send(order);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const orderItemsIds = await Promise.all(
      req.body.orderItems.map(async (orderItem) => {
        let newOrderItem = new OrderItem({
          quantity: orderItem.quantity,
          product: orderItem.product,
        });

        newOrderItem = await newOrderItem.save();

        return newOrderItem._id;
      })
    );

    let order = new Order({
      orderItems: orderItemsIds,
      shippingAddress1: req.body.shippingAddress1,
      shippingAddress2: req.body.shippingAddress2,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
      phone: req.body.phone,
      status: req.body.status,
      totalPrice: req.body.totalPrice,
      user: req.body.user,
    });

    await order.save();
    res.status(201).send(order);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
