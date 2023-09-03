const express = require("express");
const Product = require("../models/product");
const Category = require("../models/category");
const router = new express.Router();

// router.get("/", async (req, res) => {
//   const products = await Product.find().populate("category");
//   // const products = await Product.find().select("name image -_id");

//   if (!products) {
//     return res.status(500).json({
//       message: "No Products Found",
//     });
//   }

//   res.status(200).send(products);
// });

router.get("/:id", async (req, res) => {
  const products = await Product.findById(req.params.id).populate("category");

  if (!products) {
    return res.status(500).json({
      message: "No Products Found",
    });
  }

  res.status(200).send(products);
});

router.post("/", async (req, res, next) => {
  const category = await Category.findById(req.body.category);

  if (!category) {
    return res.status(401).send({
      error: "Category Not found",
    });
  }

  const product = new Product(req.body);

  try {
    await product.save();
    res.status(201).send(product);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.put("/:id", async (req, res) => {
  const category = await Category.findById(req.body.category);

  if (!category) {
    return res.status(401).send({
      error: "Category Not found",
    });
  }

  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) {
      return res.status(500).send("Not Found!");
    }

    res.send(product);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndRemove(req.params.id);
    if (!product) {
      return res.status(409).send("Product not exist");
    }
    res.send(product);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/get/count", async (req, res) => {
  const productCount = await Product.countDocuments();

  if (!productCount) {
    return res.status(500).send({ Error: "No Products" });
  }
  res.send({ productCount });
});

router.get("/get/featured/:count", async (req, res) => {
  const count = req.params.count ? req.params.count : 0;
  try {
    const products = await Product.find({ isFeatured: true }).limit(count);

    if (!products) {
      return res.status(203).json({ message: "no featured products" });
    }
    res.send(products);
  } catch (err) {
    console.log(`Error in getting the featured ${err}`);
  }
});

router.get("/", async (req, res) => {
  // localhost:3000/api/v1/products?categories=2342342,5555553
  let filter = {};
  try {
    if (req.query.categories) {
      filter = { category: req.query.categories.split(",") };
    }
    const productCategory = await Product.find(filter).populate("category");
    if (!productCategory) {
      return res.status(404).send("Products Not Found");
    }
    res.send(productCategory);
  } catch (error) {
    res.status(500).send(error);
  }
});
// router.get("/:id", async (req, res) => {
//   const _id = req.params.id;
//   const productList = await Product.where("category", _id);
//   if (!productList) {
//     res.status(401).send("No Products!");
//   }
//   res.send(productList);
// });

module.exports = router;
