const { removeCommentByCommentId, updateCommentsByCommentId} = require("../models/comments.model.js");

exports.deleteCommentByCommentId = (req, res, next) => {
  const commentId = req.params.comment_id;
  removeCommentByCommentId(commentId)
    .then(() => {
      res.status(204).send({});
    })
    .catch(next);
};

exports.patchCommentsByCommentId = (req, res, next) =>{
  const commentId = req.params.comment_id
  const incVotes = req.body.inc_votes
  const bodyKeys = Object.keys(req.body)
  console.log(bodyKeys)
  updateCommentsByCommentId(commentId, incVotes, bodyKeys).then(comment => {
    res.status(200).send({comment})
  }).catch(next)
}