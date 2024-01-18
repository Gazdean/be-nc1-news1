const db = require("../db/connection");

exports.fetchAllTopics = () => {
  return db.query("SELECT * FROM topics")
  .then((result) => {
    const topics = result.rows
    if (topics.length === 0 ) {
      return Promise.reject({status: 200, msg: 'no topics available'})
    }else return topics;
  });
};
