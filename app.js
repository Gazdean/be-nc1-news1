const express = require("express");
const app = express();
app.use(express.json());

const { getAllTopics } = require("./controllers/topics.controller.js");
const {
  getArticlesById,
  getAllArticles,
  getArticleCommentsByArticleId,
  postArticleCommentsByArticleId,
  patchArticlesByArticleId,
} = require("./controllers/articles.controller.js");
const {
  getAllEndpoints,
  invalidEndpoints,
} = require("./controllers/endpoint.controller.js");
const {
  deleteCommentByCommentId,
} = require("./controllers/comments.controller.js");

const {
  getAllUsers
} = require("./controllers/users.controller.js")

const {
  handleCustomErrors,
  handlePsqlErrors,
  handleInternalErrors,
} = require("./errors/error-handling.js");

app.get("/api/topics", getAllTopics);

app.get("/api", getAllEndpoints);

app.get("/api/articles/:article_id", getArticlesById);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id/comments", getArticleCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postArticleCommentsByArticleId);
app.patch("/api/articles/:article_id", patchArticlesByArticleId);

app.delete("/api/comments/:comment_id", deleteCommentByCommentId);

app.get("/api/users", getAllUsers);

app.all("/*", invalidEndpoints);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleInternalErrors);

module.exports = app;
