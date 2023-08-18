const express = require("express");
const port = process.env.PORT;
const api = process.env.API_URI;
const morgan = require("morgan");
const Product = require("./models/product");
require("./db/mongoose");

const app = express();

app.use(express.json());
app.use(morgan("tiny"));

const product = {
  id: 1,
  name: "product",
  price: "10",
};
app.get(`${api}/product`, (req, res) => {
  res.send(product);
});

app.post(`${api}/product`, async (req, res, next) => {
  const product = new Product({
    name: req.body.name,
    image: req.body.image,
    countInStock: req.body.countInStock,
  });

  try {
    await product.save();
    res.send(product).status(201);
  } catch (error) {
    res.send(error).status(500);
  }
});

app.listen(port, () => {
  console.log(api);
  console.log("Server is running on port " + port);
});
