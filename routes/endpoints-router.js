const endpointsRouter = require("express").Router()
const { getAllEndpoints } = require("../controllers/endpoint.controller.js");
  
endpointsRouter.get("/", getAllEndpoints)

module.exports = endpointsRouter