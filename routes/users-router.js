const usersRouter = require("express").Router();
const { getAllUsers } = require("../controllers/users.controller.js")

usersRouter.get("/", getAllUsers);

module.exports = usersRouter;