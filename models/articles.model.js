const db = require("../db/connection.js");

const { fetchAllTopics } = require("../models/topics.model.js");

exports.fetchArticlesById = (articleId) => {
  return db
    .query(
      `
      SELECT articles.article_id, articles.author, articles.body, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments. article_id)::int AS comment_count
      FROM articles
      LEFT JOIN comments ON comments.article_id = articles.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id;
    `,
      [articleId]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "article_id does not exist",
        });
      } else return rows[0];
    });
};

exports.fetchAllArticles = (topic) => {
  return fetchAllTopics()
  .then((result) => {
    const validTopics = result.map((topicObj) => {
      return topicObj.slug;
    });
    if (topic && !validTopics.includes(topic)) {
      return Promise.reject({ status: 404, msg: "topic does not exist" });
    } else {
      const value = [];
      let whereString = "";
      if (topic) {
        whereString = `WHERE topic = $1`;
        value.push(topic);
      }
      const query = `SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments. article_id)::int AS comment_count
         FROM articles
         LEFT JOIN comments ON comments.article_id = articles.article_id
         ${whereString}
         GROUP BY articles.article_id
         ORDER BY created_at DESC;`;
      return db.query(query, value)
      .then(({ rows }) => {
        return rows;
      });
    };
  });
};

exports.fetchArticleCommentsByArticleId = (articleId) => {
  return db
    .query(
      `
        SELECT * FROM comments
        WHERE article_id = $1
        ORDER BY created_at DESC
    `,
      [articleId]
    )
    .then(({ rows }) => {
       return rows;
    });
};

exports.createArticleCommentsByArticleId = (articleId, username, body) => {
  if (body === undefined || username === undefined) {
    return Promise.reject({
      status: 400,
      msg: "both username and comment body is required",
    });
  } else if (typeof body !== "string" || typeof username !== "string") {
    return Promise.reject({
      status: 400,
      msg: "bad request invalid data type",
    });
  } else {
    const commentValues = [username, body, articleId];
    return db
      .query(
        `
    SELECT * FROM users
    WHERE username = $1`,
        [username]
      )
      .then(({ rows }) => {
        if (rows.length === 0) {
          return Promise.reject({ status: 404, msg: "user does not exist" });
        } else {
          return db
            .query(
              `
    INSERT INTO comments
    (author, body, article_id)
    VALUES
    ($1, $2, $3) 
    RETURNING *;`,
              commentValues
            )
            .then(({ rows }) => {
              return rows[0];
            });
        }
      });
  }
};

exports.updateArticlesByArticleId = (articleId, incVotes) => {
  if (incVotes === undefined) {
    return Promise.reject({
      status: 400,
      msg: "bad request body must only have inc_vote property",
    });
  } else if (typeof incVotes !== "number") {
    return Promise.reject({
      status: 400,
      msg: "bad request invalid data type",
    });
  } else {
    return db
      .query(
        `
    SELECT votes FROM articles
    WHERE article_id = $1;
  `,
        [articleId]
      )
      .then(({ rows }) => {
          const existingVotes = rows[0].votes;
          const updatedVotes = existingVotes + incVotes;
          return db.query(
            `
      UPDATE articles
      SET votes = $1
      WHERE article_id = $2;
    `,
            [updatedVotes, articleId]
          );
        
      })
      .then(() => {
        return db
          .query(
            `
        SELECT * FROM articles
        WHERE article_id = $1;
      `,
            [articleId]
          )
          .then(({ rows }) => {
            return rows[0];
          });
      });
  }
};
