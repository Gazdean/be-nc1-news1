const db = require("../db/connection.js");


exports.fetchAllUsers = () => {
  return db
    .query(
      `
        SELECT * FROM users
    `
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.fetchUsersByUsername = (username) => {
    return db
    .query(
      `
        SELECT * FROM users
        WHERE username = $1
      `, [username]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
      return Promise.reject({status: 404, msg: `username does not exist`})
      } else return rows;
    });
};
