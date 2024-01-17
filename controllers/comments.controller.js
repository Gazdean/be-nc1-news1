const { removeCommentByCommentId } = require("../models/comments.model.js");

exports.deleteCommentByCommentId = (req, res, next) => {
  const commentId = req.params.comment_id;
  removeCommentByCommentId(commentId)
    .then(() => {
      res.status(204).send({});
    })
    .catch(next);
};
