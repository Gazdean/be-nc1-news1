const commentsRouter = require("express").Router()
const { deleteCommentByCommentId, patchCommentsByCommentId } = require("../controllers/comments.controller");

commentsRouter.patch("/:comment_id", patchCommentsByCommentId);  
commentsRouter.delete("/:comment_id", deleteCommentByCommentId);


module.exports = commentsRouter