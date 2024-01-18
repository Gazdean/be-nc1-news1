const { fetchAllEndpoints } = require("../models/endpoints.model");

exports.getAllEndpoints = (req, res, next) => {
    fetchAllEndpoints().then((endpoints) => {
        res.status(200).send({endpoints})
    })
    .catch(next)
}

exports.invalidEndpoints = (req, res, next) => {
  res.status(404).send({msg: "not found, invalid endpoint"})
}
