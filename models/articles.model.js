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

exports.fetchAllArticles = (topic, sortBy = "created_at", order = "desc", limit, page) => {
  return fetchAllTopics().then((result) => {
    const validTopics = result.map((topicObj) => {
      return topicObj.slug;
    });
    if (topic && !validTopics.includes(topic)) {
      return Promise.reject({ status: 404, msg: "topic does not exist" });
    } else {
      const values = [];
      const greenLightSortBys = [
        "votes",
        "comment_count",
        "article_id",
        "author",
        "title",
        "topic",
        "created_at",
      ];
      const greenLightOrder = ["desc", "asc"];

      let query = `SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments. article_id)::int AS comment_count
      FROM articles
      LEFT JOIN comments ON comments.article_id = articles.article_id
      `;

      if (topic) {
        query += ` WHERE topic = $1`;
        values.push(topic);
      }

      query += ` GROUP BY articles.article_id`;
      if (greenLightSortBys.includes(sortBy)) {
        query += ` ORDER BY ${sortBy}`;
      } else {
        return Promise.reject({
          status: 400,
          msg: "bad request invalid sort_by",
        });
      }
      if (greenLightOrder.includes(order)) {
        query += ` ${order}`;
      } else {
        return Promise.reject({
          status: 400,
          msg: "bad request in valid order by",
        });
      }
      if(limit || page){
        let offset = 0
        if(!page || page < 0) page = 0
        if (isNaN(Number(limit)) || isNaN(Number(page))) {
          return Promise.reject({status: 400, msg: "bad request incorrect data types"})
        }

        if (limit < 10) limit = 10
        if (page) offset = ((page -1) * limit)
      
        query += ` OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY;`
      }
      return db.query(query, values).then(({ rows }) => {
        return rows;
      });
    }
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
          return Promise.reject({
            status: 404,
            msg: "username does not exist",
          });
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

exports.createArticles = (articleDataObj) => {
  const { author, title, body, topic, article_img_url } = articleDataObj;
  const values = [author, title, body, topic, article_img_url];

  const validateDataType = values.map(value =>{
    if (typeof value === "string") return value
  })
  if (values.includes(undefined)) {
    return Promise.reject({status: 400, msg: "bad request all requested properties are required"})
  } else if (validateDataType.includes(undefined)) {
    return Promise.reject({status: 400, msg: "bad request invalid data type"})
  } else {
  return db
    .query(
      `
      INSERT INTO articles
      (author, title, body, topic, article_img_url)
      VALUES
      ($1, $2, $3, $4, $5) 
      RETURNING *;
    `,
      values
    )
    .then(({ rows }) => {
      const articleId = rows[0].article_id;
      return this.fetchArticlesById(articleId)
    })
    .then((result) => {
      return result;
    });
  }
};
