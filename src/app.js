const express = require("express");
const port = process.env.PORT;
const api = process.env.API_URI;
const morgan = require("morgan");
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

app.post(`${api}/product`, (req, res, next) => {
  const newProduct = req.body;
  console.log(newProduct);
  res.send(newProduct);
});

app.listen(port, () => {
  console.log(api);
  console.log("Server is running on port " + port);
});
