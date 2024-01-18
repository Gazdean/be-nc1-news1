const commentsRouter = require("express").Router()
const { deleteCommentByCommentId, patchCommentsByCommentId } = require("../controllers/comments.controller");
  
commentsRouter.delete("/:comment_id", deleteCommentByCommentId);
commentsRouter.patch("/:comment_id", patchCommentsByCommentId);

module.exports = commentsRouter