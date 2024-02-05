const express = require("express");
const app = express();
const cors = require('cors');

app.use(cors());

app.use(express.json());

const { invalidEndpoints } = require("./controllers/endpoint.controller.js");

const {
  handleCustomErrors,
  handlePsqlErrors,
  handleInternalErrors,
} = require("./errors/error-handling.js");

const apiRouter = require("./routes/api-router.js")

app.use("/api", apiRouter)

app.all("/*", invalidEndpoints);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleInternalErrors);

module.exports = app;
