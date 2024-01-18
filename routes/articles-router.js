const articlesRouter = require('express').Router()
const {getArticlesById,
    getAllArticles,
    getArticleCommentsByArticleId,
    postArticleCommentsByArticleId,
    patchArticlesByArticleId,
  } = require("../controllers/articles.controller.js");

articlesRouter.get("/:article_id", getArticlesById);
articlesRouter.get("/", getAllArticles);
articlesRouter.get("/:article_id/comments", getArticleCommentsByArticleId);
articlesRouter.post("/:article_id/comments", postArticleCommentsByArticleId);
articlesRouter.patch("/:article_id", patchArticlesByArticleId);

module.exports = articlesRouter