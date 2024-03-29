const {
  fetchArticlesById,
  fetchAllArticles,
  fetchArticleCommentsByArticleId,
  createArticleCommentsByArticleId,
  updateArticlesByArticleId,
  createArticles
} = require("../models/articles.model.js");

const {fetchUsersByUsername} = require("../models/users.model.js")
const {checkValueExists} = require("../api-utils.js")

exports.getArticlesById = (req, res, next) => {
  const articleId = req.params.article_id;
  fetchArticlesById(articleId)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  const sortBy = req.query.sort_by
  const {order} = req.query
  const { topic } = req.query;
  const { limit } = req.query;
  const page = req.query.p;

  fetchAllArticles(topic, sortBy, order, limit, page)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticleCommentsByArticleId = (req, res, next) => {
  const articleId = req.params.article_id;
  const allPromises = Promise.all([
    checkValueExists(articleId, "article_id", "articles"),
    fetchArticleCommentsByArticleId(articleId)
  ]);
  allPromises
    .then((result) => {
      const comments = result[1];
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postArticleCommentsByArticleId = (req, res, next) => {
  const articleId = req.params.article_id;
  const { username, body } = req.body;
  createArticleCommentsByArticleId(articleId, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.patchArticlesByArticleId = (req, res, next) => {
  const articleId = req.params.article_id;
  const incVotes = req.body.inc_votes;
  const allPromises = Promise.all([
    checkValueExists(articleId, "article_id", "articles"),
    updateArticlesByArticleId(articleId, incVotes),
  ]);
  allPromises
    .then((result) => {
      const article = result[1];
      res.status(201).send({ article });
    })
    .catch((err) => {
      next(err)})
};

exports.postArticles = (req, res, next) => {
  const articleDataObj = req.body
  const username = req.body.author
  const topic= req.body.topic
  const allPromises = Promise.all([fetchUsersByUsername(username), checkValueExists(topic, "slug", "topics"), createArticles(articleDataObj)])
  allPromises
  .then(result =>{
    const article = result[2]
    res.status(201).send({article})
  }).catch(next)
}

