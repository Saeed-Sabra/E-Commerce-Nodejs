const express = require("express");
const port = process.env.PORT;
const morgan = require("morgan");
const ProductRoute = require("./routers/product");
require("./db/mongoose");

const api = process.env.API_URI;

const app = express();

app.use(express.json());
app.use(morgan("tiny"));
app.use(`${api}/products`, ProductRoute);

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
