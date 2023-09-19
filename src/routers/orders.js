const Order = require("../models/order");
const OrderItem = require("../models/order-item");
const express = require("express");
const router = new express.Router();

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name")
      .sort({ dateOrdered: -1 });

    if (!orders) {
      return res.status(400).send({
        message: "No orders found",
      });
    }

    res.status(200).send(orders);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name")
      .populate({ path: "orderItems", populate: "product" });
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
    const totalPrices = await Promise.all(
      orderItemsIds.map(async (orderItemID) => {
        const orderItem = await OrderItem.findById(orderItemID).populate(
          "product",
          "price"
        );
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice;
      })
    );
    const totalPrice = totalPrices.reduce((a, b) => a + b, 0);
    console.log(totalPrice);

    let order = new Order({
      orderItems: orderItemsIds,
      shippingAddress1: req.body.shippingAddress1,
      shippingAddress2: req.body.shippingAddress2,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
      phone: req.body.phone,
      status: req.body.status,
      totalPrice: totalPrice,
      user: req.body.user,
    });

    await order.save();
    res.status(201).send(order);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      { new: true }
    );
    if (!updatedOrder) {
      res.status(404).send("The requested resource was not found");
    }
    res.send(updatedOrder);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    let ot;
    const order = await Order.findByIdAndRemove(req.params.id);
    if (!order) {
      return res.status(404).send("The order was not found");
    }
    await order.orderItems.map(async (orderItem) => {
      ot = await OrderItem.findByIdAndRemove(orderItem);
    });
    if (!ot) {
      return res.status(404).send("The order items were not found");
    }

    res.send(order);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/get/totalsales", async (req, res) => {
  try {
    const totalSales = await Order.aggregate([
      { $group: { _id: null, totalsales: { $sum: "$totalPrice" } } },
    ]);

    if (!totalSales) {
      return res.status(404).send("The ordered sales can not be generated");
    }
    res.send({ totalSales: totalSales.pop().totalsales });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/get/count", async (req, res) => {
  const orderCount = await Order.countDocuments();

  if (!orderCount) {
    return res.status(500).send({ Error: "No orders" });
  }
  res.send({ orderCount });
});

router.get("/get/userorders/:userid", async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userid })
      .populate({
        path: "orderItems",
        populate: {
          path: "product",
          populate: "category",
        },
      })
      .sort({ dateOrdered: -1 });

    if (!orders) {
      return res.status(400).send({
        message: "No orders found",
      });
    }

    res.status(200).send(orders);
  } catch (error) {
    res.status(500).send(error);
  }
});
module.exports = router;
