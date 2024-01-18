const db = require("../db/connection.js");

exports.removeCommentByCommentId = (commentId) => {
  return db
    .query(
      `
        SELECT comment_id FROM comments
        WHERE comment_id = $1
      `,
      [commentId]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "comment_id does not exist",
        });
      } else {
        return db.query(
          `DELETE FROM comments
            WHERE comment_id = $1
            RETURNING *;
        `,
          [commentId]
        );
      }
    });
};

exports.updateCommentsByCommentId = (commentId, incVotes, bodyKeys) => { 
  if (bodyKeys.length === 0 ) {
    return Promise.reject({
      status: 400,
      msg: "bad request must include inc_votes value",
    });
  } else {
    return db
      .query(
        `
    SELECT votes FROM comments
    WHERE comment_id = $1
    ;
  `,
        [commentId]
      )
      .then(({ rows }) => {
        if (rows.length === 0) {
          return Promise.reject({
            status: 404,
            msg: "comment_id doesnt exist",
          });
        } else {
          const existingVotes = rows[0].votes;
          const updatedVotes = existingVotes + incVotes;
          const minValueZeroCheck = Math.max(0, updatedVotes);
          return db
            .query(
              `
          UPDATE comments
          SET votes = $1
          WHERE comment_id = $2
          returning *;
        `,
              [minValueZeroCheck, commentId]
            )
            .then(({ rows }) => {
              return rows[0];
            });
        }
      });
  }
};
