const {
  fetchAllUsers,
  fetchUsersByUsername,
} = require("../models/users.model.js");

exports.getAllUsers = (req, res, next) => {
  fetchAllUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.getUsersByUsername = (req, res, next) => {
  const { username } = req.params;
  fetchUsersByUsername(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};
