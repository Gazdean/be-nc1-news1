const usersRouter = require("express").Router();
const { getAllUsers, getUsersByUsername} = require("../controllers/users.controller.js")

usersRouter.get("/", getAllUsers);
usersRouter.get("/:username", getUsersByUsername)

module.exports = usersRouter;