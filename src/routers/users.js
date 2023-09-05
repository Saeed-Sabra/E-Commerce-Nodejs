const User = require("../models/user");
const express = require("express");
const router = new express.Router();

router.get("/", async (req, res) => {
  const users = await User.find();

  if (!users) {
    return res.status(500).send({
      message: "No Users found",
    });
  }

  res.status(200).send(users);
});

router.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
