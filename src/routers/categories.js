const Category = require("../models/category");
const express = require("express");
const router = new express.Router();

router.get("/", async (req, res) => {
  const categories = await Category.find();

  if (!categories) {
    return res.status(500).send({
      message: "No categories found",
    });
  }

  res.status(200).send(categories);
});

router.get("/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const category = await Category.findById(_id);
    if (!category) {
      return res.status(404).send("Not Found!");
    }
    res.status(200).send(category);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/", async (req, res) => {
  const newCategory = new Category(req.body);
  try {
    await newCategory.save();
    res.status(201).send(newCategory);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.delete("/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const category = await Category.findByIdAndRemove(_id);

    if (!category) {
      return res.status(404).send("Not Found!");
    }
    res.status(200).send(category);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const category = await Category.findByIdAndUpdate(
      _id,
      {
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color,
      },
      { new: true }
    );

    if (!category) {
      return res.status(404).send("Not Found!");
    }

    res.status(200).send(category);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
