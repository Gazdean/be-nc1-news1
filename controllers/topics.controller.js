const {fetchAllTopics}  = require("../models/topics.model.js");

exports.getAllTopics = (req, res, next) => {
  fetchAllTopics().then((topics) => {
    res.status(200).send({topics});
  }).catch(next)
};
