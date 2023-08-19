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

module.exports = router;
