const express = require("express");
const port = process.env.PORT;
const morgan = require("morgan");
require("./db/mongoose");

const app = express();

app.use(express.json());
app.use(morgan("tiny"));

const UserRoute = require("./routers/users");
const OrderRoute = require("./routers/orders");
const ProductRoute = require("./routers/product");
const categoryRoute = require("./routers/categories");

const api = process.env.API_URI;

app.use(`${api}/users`, UserRoute);
app.use(`${api}/orders`, OrderRoute);
app.use(`${api}/products`, ProductRoute);
app.use(`${api}/categories`, categoryRoute);

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
