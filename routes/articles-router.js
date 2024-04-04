const articlesRouter = require('express').Router()
const {getArticlesById,
    getAllArticles,
    getArticleCommentsByArticleId,
    postArticleCommentsByArticleId,
    patchArticlesByArticleId,
    postArticles
  } = require("../controllers/articles.controller.js");

articlesRouter.get("/", getAllArticles);
articlesRouter.get("/:article_id", getArticlesById);
articlesRouter.get("/:article_id/comments", getArticleCommentsByArticleId);
articlesRouter.post("/:article_id/comments", postArticleCommentsByArticleId);
articlesRouter.patch("/:article_id", patchArticlesByArticleId);
articlesRouter.post("/", postArticles);

module.exports = articlesRouter