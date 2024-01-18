const commentsRouter = require("express").Router()
const { deleteCommentByCommentId } = require("../controllers/comments.controller");
  
commentsRouter.delete("/:comment_id", deleteCommentByCommentId);

module.exports = commentsRouter