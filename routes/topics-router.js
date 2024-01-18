const topicsRouter = require("express").Router();
const { getAllTopics } = require("../controllers/topics.controller.js");

topicsRouter.get("/", getAllTopics)

module.exports = topicsRouter