const express = require("express");
const port = process.env.PORT;
const morgan = require("morgan");
require("./db/mongoose");
const authJwt = require("../helpers/jwt");
const errorHandler = require("../helpers/error-handler");

const app = express();

app.use(express.json());
app.use(morgan("tiny"));
app.use(authJwt());
app.use(errorHandler);

// Routes
const UserRoute = require("./routers/users");
const OrderRoute = require("./routers/orders");
const ProductRoute = require("./routers/products");
const categoryRoute = require("./routers/categories");

const api = process.env.API_URI;

app.use(`${api}/users`, UserRoute);
app.use(`${api}/orders`, OrderRoute);
app.use(`${api}/products`, ProductRoute);
app.use(`${api}/categories`, categoryRoute);

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
