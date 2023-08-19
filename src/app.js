const express = require("express");
const port = process.env.PORT;
const morgan = require("morgan");
require("./db/mongoose");

const app = express();

app.use(express.json());
app.use(morgan("tiny"));

const ProductRoute = require("./routers/product");
const UserRoute = require("./routers/users");

const api = process.env.API_URI;

app.use(`${api}/products`, ProductRoute);
app.use(`${api}/users`, UserRoute);

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
