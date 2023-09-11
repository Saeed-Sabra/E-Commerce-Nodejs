const User = require("../models/user");
const express = require("express");
const router = new express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

router.get("/", async (req, res) => {
  const users = await User.find().select("-password");

  if (!users) {
    return res.status(500).send({
      message: "No Users found",
    });
  }

  res.status(200).send(users);
});

router.post("/register", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(400).send("No user found!");
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).send("User not found!");
    }
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      console.log(process.env.JWT_SECRET);
      const token = jwt.sign(
        { userId: user.id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );
      res.send({ user, token });
    } else {
      res.status(400).send("password is wrong!");
    }
  } catch (error) {
    res.status(400).send();
  }
});

router.get("/get/count", async (req, res) => {
  const usersCount = await User.countDocuments();

  if (!usersCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    usersCount,
    success: true,
  });
});

router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id);
    if (!user) {
      return res.status(409).send("no such user");
    }
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});
module.exports = router;
