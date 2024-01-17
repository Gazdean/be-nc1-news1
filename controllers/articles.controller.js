const {
  fetchArticlesById,
  fetchAllArticles,
  fetchArticleCommentsByArticleId,
  createArticleCommentsByArticleId,
  updateArticlesByArticleId,
} = require("../models/articles.model.js");

exports.getArticlesById = (req, res, next) => {
  const articleId = req.params.article_id;
  fetchArticlesById(articleId)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  const { topic } = req.query;
  fetchAllArticles(topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticleCommentsByArticleId = (req, res, next) => {
  const articleId = req.params.article_id;
  const allPromises = Promise.all([
    fetchArticlesById(articleId),
    fetchArticleCommentsByArticleId(articleId),
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
    fetchArticlesById(articleId),
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
