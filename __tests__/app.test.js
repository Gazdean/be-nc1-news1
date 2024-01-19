const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");
const endpointsFile = require("../endpoints.json");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("topics", () => {
  describe("getTopics", () => {
    it("should return status code 200 and a body of length 3", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          topics = body.topics;
          expect(topics.length).toBe(3);
        });
    });
    it("should return each topic with the length of 2 and return the correct properties and data types", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          topics = body.topics;
          topics.forEach((topic) => {
            expect(Object.keys(topic).length).toBe(2);
            expect(typeof topic.description).toBe("string");
            expect(typeof topic.slug).toBe("string");
          });
        });
    });
    it("should return the correct values", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          topics = body.topics;
          expect(topics[1].description).toBe("Not dogs");
          expect(topics[1].slug).toBe("cats");
        });
    });
  });
});

describe("endpoints", () => {
  describe("getAllEndpoints", () => {
    it("returns the status code 200 and an object with all available endpoints", () => {
      request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          const { endpoints } = body;
          expect(endpoints).toEqual(endpointsFile);
        });
    });
    it("returns an object with the correct keys", () => {
      request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          const { endpoints } = body;
          const expected = ["description", "queries", "exampleResponse"];
          for (const key in endpoints) {
            expect(Object.keys(endpoints[key])).toEqual(expected);
          }
        });
    });
  });
  describe("invalidEndpoints", () => {
    it("returns a 404 status code with the message 'not found, invalid endpoint'", () => {
      return request(app)
        .get("/api/invalidEndpoint")
        .expect(404)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("not found, invalid endpoint");
        });
    });
  });
});

describe("articles", () => {
  describe("getArticlesById", () => {
    it("returns a status code 200 and a article object with the correct properties", () => {
      return request(app)
        .get("/api/articles/3")
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          const articleKeys = Object.keys(article);
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("body");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
        });
    });
    it("returns a status code 200 and a article object with the correct data", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          expect(article).toMatchObject({
            article_id: 1,
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
        });
    });
    it("returns a status code 404 with the message 'article_id does not exist' if passed a valid but non exsistant article_id", () => {
      return request(app)
        .get("/api/articles/2000")
        .expect(404)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("article_id does not exist");
        });
    });
    it("returns a status code 400 with the message 'bad request' if passed an invalid article_id", () => {
      return request(app)
        .get("/api/articles/invalidIdCode")
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("bad request invalid data type");
        });
    });
    it("returns the article with a comment_count key value pair", () => {
      return request(app)
        .get("/api/articles/9")
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          expect(typeof article.comment_count).toBe("number");
          expect(article.comment_count).toBe(2);
        });
    });
    it("returns the article with a zero comment_count if it has no comments", () => {
      return request(app)
        .get("/api/articles/11")
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          expect(typeof article.comment_count).toBe("number");
          expect(article.comment_count).toBe(0);
        });
    });
  });
  describe("getArticles", () => {
    it("returns status code 200 and array of article objects with the correct keys", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles.length).toBe(13);
          articles.forEach((article) => {
            expect(Object.keys(article).length).toBe(8);
            expect(article).toHaveProperty("author");
            expect(article).toHaveProperty("title");
            expect(article).toHaveProperty("article_id");
            expect(article).toHaveProperty("topic");
            expect(article).toHaveProperty("created_at");
            expect(article).toHaveProperty("votes");
            expect(article).toHaveProperty("article_img_url");
            expect(article).toHaveProperty("comment_count");
          });
        });
    });
    it("it return the articles without a body key/value pair", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles.length).toBe(13);
          articles.forEach((article) => {
            expect(article).not.toHaveProperty("body");
          });
        });
    });
    it("returns a status code 200 and an array of article objects with the correct data types", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          articles.forEach((article) => {
            expect(article).toMatchObject({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            });
          });
        });
    });
    it("returns the correct value for comment_count", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          articles.forEach((article) => {
            if (article.article_id === 1) {
              expect(article.comment_count).toBe(11);
            }
            if (article.article_id === 7) {
              expect(article.comment_count).toBe(0);
            }
          });
        });
    });
    it("returns a status code 200 and an array of article objects sorted by DATE in DESC order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
    });
    it("allows the client to query /api/articles by topic", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles.length).toBe(12);
          articles.forEach((article) => {
            expect(article.topic).toBe("mitch");
          });
        });
    });
    it("returns status code 404 and the msg 'topic does not exist' if passed a valid but non existant topic", () => {
      return request(app)
        .get("/api/articles?topic=doggy")
        .expect(404)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("topic does not exist");
        });
    });
    it("returns status code 200 and an empty array if passed a valid topic that has no articles", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles.length).toBe(0);
        });
    });
    describe("sort_by query", () => {
      it("allows the client to use the query sort_by=created_at which sorts the articles by created_at in descending order", () => {
        return request(app)
          .get("/api/articles?sort_by=created_at")
          .expect(200)
          .then(({ body }) => {
            const { articles } = body;
            expect(articles).toBeSortedBy("created_at", { descending: true });
          });
      });
      it("allows the client to use the query sort_by=votes which sorts the articles by votes in descending order", () => {
        return request(app)
          .get("/api/articles?sort_by=votes")
          .expect(200)
          .then(({ body }) => {
            const { articles } = body;
            expect(articles).toBeSortedBy("votes", { descending: true });
          });
      });
      it("allows the client to use the query sort_by=article_id which sorts the articles by article_id in descending order", () => {
        return request(app)
          .get("/api/articles?sort_by=article_id")
          .expect(200)
          .then(({ body }) => {
            const { articles } = body;
            expect(articles).toBeSortedBy("article_id", { descending: true });
          });
      });
      it("allows the client to use the query sort_by=author which sorts the articles by author in descending order", () => {
        return request(app)
          .get("/api/articles?sort_by=author")
          .expect(200)
          .then(({ body }) => {
            const { articles } = body;
            expect(articles).toBeSortedBy("author", { descending: true });
          });
      });
      it("allows the client to use the query sort_by=title which sorts the articles by title in descending order", () => {
        return request(app)
          .get("/api/articles?sort_by=title")
          .expect(200)
          .then(({ body }) => {
            const { articles } = body;
            expect(articles).toBeSortedBy("title", { descending: true });
          });
      });
      it("allows the client to use the query sort_by=topic which sorts the articles by topic in descending order", () => {
        return request(app)
          .get("/api/articles?sort_by=topic")
          .expect(200)
          .then(({ body }) => {
            const { articles } = body;
            expect(articles).toBeSortedBy("topic", { descending: true });
          });
      });
      it("allows the client to use the query sort_by=comment_count which sorts the articles by comment_count in descending order", () => {
        return request(app)
          .get("/api/articles?sort_by=comment_count")
          .expect(200)
          .then(({ body }) => {
            const { articles } = body;
            expect(articles).toBeSortedBy("comment_count", {
              descending: true,
            });
          });
      });
      it("allows the client to use the query sort_by=comment_count which sorts the articles by comment_count in descending order", () => {
        return request(app)
          .get("/api/articles?sort_by=comment_count")
          .expect(200)
          .then(({ body }) => {
            const { articles } = body;
            expect(articles).toBeSortedBy("comment_count", {
              descending: true,
            });
          });
      });
      it("defaults to sort_by=created_at", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            const { articles } = body;
            expect(articles).toBeSortedBy("created_at", {
              descending: true,
            });
          });
      });
      it("returns a 400 status code and the msg 'bad request invalid data' if the client uses an in valid sort_by column", () => {
        return request(app)
          .get("/api/articles?sort_by=invalid_column")
          .expect(400)
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("bad request invalid sort_by");
          });
      });
    });
    describe("order desc or asc", () => {
      it("allows the client to use the order the request in descending order", () => {
        return request(app)
          .get("/api/articles?order=desc")
          .expect(200)
          .then(({ body }) => {
            const { articles } = body;
            expect(articles).toBeSortedBy("created_at", { descending: true });
          });
      });
      it("allows the client to use the order the rerquest in ascending order", () => {
        return request(app)
          .get("/api/articles?order=asc")
          .expect(200)
          .then(({ body }) => {
            const { articles } = body;
            expect(articles).toBeSortedBy("created_at", { descending: false });
          });
      });
      it("defaults to descending order", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            const { articles } = body;
            expect(articles).toBeSortedBy("created_at", { descending: true });
          });
      });
      it("returns status code 400 and the msg 'bad request in valid order by'", () => {
        return request(app)
          .get("/api/articles?order=invalidOrder")
          .expect(400)
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("bad request in valid order by");
          });
      });
    });
  });

  describe("getArticleCommentsByArticleId", () => {
    it("returns status code 200 and array of comments objects for the requested article with the correct keys and data types", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          comments.forEach((comment) => {
            expect(Object.keys(comment).length).toBe(6),
              expect(comment).toMatchObject({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                article_id: expect.any(Number),
              });
          });
        });
    });
    it("returns the comment array sorted by created_at in DESC order", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(comments).toBeSortedBy("created_at", { descending: true });
        });
    });
    it("returns a status code 200 and an empty array if its a valid article_id but it has no comments", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(comments.length).toBe(0);
        });
    });
    it("returns a status code 404 with the message 'article_id does not exist' if passed a valid but non exsistant article_id", () => {
      return request(app)
        .get("/api/articles/2000/comments")
        .expect(404)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("article_id does not exist");
        });
    });
    it("returns a status code 400 with the message 'bad request' if passed an invalid article_id", () => {
      return request(app)
        .get("/api/articles/invalidIdCode/comments")
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("bad request invalid data type");
        });
    });
  });

  describe("postArticleCommentsByArticleId", () => {
    it("returns a 201 status code and the created comment if the article_id is valid and the username is valid", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ username: "rogersop", body: "wowzers" })
        .expect(201)
        .then(({ body }) => {
          const { comment } = body;
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          });
        });
    });
    it("returns a status code 404 with the message 'article_id does not exist' if passed a valid but non exsistant article_id", () => {
      return request(app)
        .post("/api/articles/2000/comments")
        .send({ username: "rogersop", body: "wowzers" })
        .expect(404)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("article_id does not exist");
        });
    });
    it("returns a status code 400 with the message 'bad request invalid data type' if passed an invalid article_id", () => {
      return request(app)
        .post("/api/articles/inValid/comments")
        .send({ username: "rogersop", body: "wowzers" })
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("bad request invalid data type");
        });
    });
    it("returns a status code 404 with the message 'user does not exist' if passed an username that is not in the database", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ username: "colin", body: "wowzers" })
        .expect(404)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("username does not exist");
        });
    });
    it("returns a status code 400 with the message 'both username and comment body is required' if client doesnt send all the required data fields", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ username: "butter_bridge" })
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("both username and comment body is required");
        });
    });
    it("ignores any extra field that are sent and returns a status code 201 and the comment object", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          username: "butter_bridge",
          body: "thats great",
          colour: "blue",
          legs: true,
        })
        .expect(201)
        .then(({ body }) => {
          const { comment } = body;
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          });
        });
    });
    it("returns a status code 400 with the message 'bad request invalid data type' if client sends incorrect data types", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ username: true, body: 1 })
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("bad request invalid data type");
        });
    });
  });

  describe("patchArticlesByArticleId", () => {
    it("returns a status code 201 and the article object with the votes inreased by the correct amount when sent an object with a positive inc_votes key value pair ", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 10 })
        .expect(201)
        .then(({ body }) => {
          const { article } = body;
          expect(article.article_id).toBe(1);
          expect(article.votes).toBe(110);
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
        });
    });
    it("returns a status code 201 and the article object with the votes inreased by the correct amount when sent an object with a ngative inc_votes key value pair ", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: -10 })
        .expect(201)
        .then(({ body }) => {
          const { article } = body;
          expect(article.article_id).toBe(1);
          expect(article.votes).toBe(90);
        });
    });
    it("returns a status code 400 with the message 'bad request invalid data type' if client sends incorrect data types", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: true })
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("bad request invalid data type");
        });
    });
    it("returns a status code 400 with the message 'bad request body must only have inc_vote property' if client tries to update any other key value pair", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ title: "help" })
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("bad request body must only have inc_vote property");
        });
    });
    it("returns a status code 404 with the message 'article_id does not exist' if passed a valid but non exsistant article_id", () => {
      return request(app)
        .patch("/api/articles/2000")
        .send({ inc_votes: 20 })
        .expect(404)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("article_id does not exist");
        });
    });
    it("returns a status code 400 with the message 'bad request' if passed an invalid article_id", () => {
      return request(app)
        .patch("/api/articles/inValid")
        .send({ inc_votes: 20 })
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("bad request invalid data type");
        });
    });
  });
});

describe("comments", () => {
  describe("DELETE /api/comments/:comment_id", () => {
    it("allows the client to delete an article comment by comment_id", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then(() => {
          return db.query(`SELECT * FROM comments`).then(({ rows }) => {
            expect(rows.length).toBe(17);
            rows.forEach((comment) => {
              expect(comment.comment_id).not.toBe(1);
            });
          });
        });
    });

    it("returns a status code 404 with the message 'comment_id does not exist' if passed a valid but non exsistant comment_id", () => {
      return request(app)
        .delete("/api/comments/2000")
        .expect(404)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("comment_id does not exist");
        });
    });
    it("returns a status code 400 with the message 'bad request' if passed an invalid comment_id", () => {
      return request(app)
        .delete("/api/comments/inValid")
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("bad request invalid data type");
        });
    });
  });
  describe("PATCH /api/comments/:comment_id", () => {
    it("increases the votes by the required amount when sent a positive inc_votes value and returns status code 200 and the updated comment object with the correct values", () => {
      return request(app)
        .patch("/api/comments/2")
        .send({ inc_votes: 3 })
        .expect(200)
        .then(({ body }) => {
          const { comment } = body;
          expect(comment).toMatchObject({
            body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
            votes: 17,
            author: "butter_bridge",
            article_id: 1,
            created_at: expect.any(String),
          });
        });
    });
    it("decreases the votes by the required amount when sent a negative inc_votes value and returns status code 200 and the updated comment object with the correct values", () => {
      return request(app)
        .patch("/api/comments/2")
        .send({ inc_votes: -3 })
        .expect(200)
        .then(({ body }) => {
          const { comment } = body;
          expect(comment).toMatchObject({
            body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
            votes: 11,
            author: "butter_bridge",
            article_id: 1,
            created_at: expect.any(String),
          });
        });
    });
    it("doesnt let the votes value be less than 0", () => {
      return request(app)
        .patch("/api/comments/2")
        .send({ inc_votes: -16 })
        .expect(200)
        .then(({ body }) => {
          const { comment } = body;
          expect(comment.votes).toBe(0);
        });
    });
    it("returns status code 404 and the msg 'comment_id doesnt exist'", () => {
      return request(app)
        .patch("/api/comments/9999")
        .send({ inc_votes: 4 })
        .expect(404)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe('comment_id doesnt exist');
        });
    });
    it("returns status code 400 and the msg 'bad request invalid data type' when the comment_id isnt a number", () => {
      return request(app)
        .patch("/api/comments/invalid")
        .send({ inc_votes: 4 })
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe('bad request invalid data type');
        });
    });
    it("returns status code 400 and the msg 'bad request invalid data type' when the inc_votes value is not a number", () => {
      return request(app)
        .patch("/api/comments/2")
        .send({ inc_votes: "invalid" })
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe('bad request invalid data type');
        });
    });
    it("returns status code 400 and the msg 'bad request invalid data type' if the client tries to patch any other than votes", () => {
      return request(app)
        .patch("/api/comments/2")
        .send({ author: "John" })
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe('bad request invalid data type');
        });
    });
    it("returns status code 400 and the msg 'bad request must include inc_votes value' if the client doesnt include inc_votes in the request", () => {
      return request(app)
        .patch("/api/comments/1")
        .send()
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe('bad request must include inc_votes value');
        });
    });


  });
});

describe("users", () => {
  describe("/api/users", () => {
    it("returns status code 200 and an array of user objects with the correct properties", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          const { users } = body;
          expect(users.length).toBe(4);
          users.forEach((user) => {
            expect(Object.keys(user).length).toBe(3),
              expect(user).toMatchObject({
                username: expect.any(String),
                name: expect.any(String),
                avatar_url: expect.any(String),
              });
          });
        });
    });
    it("returns the correct data", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          const { users } = body;
          expect(users[0]).toMatchObject({
            username: "butter_bridge",
            name: "jonny",
            avatar_url:
              "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
          });
        });
    });
  });
  describe("/api/users/:username", () => {
    it("responds with a 200 status code and a user object when a specific user is requested", () => {
      return request(app)
        .get("/api/users/butter_bridge")
        .expect(200)
        .then(({ body }) => {
          const { user } = body;
          expect(Object.keys(user[0]).length).toBe(3);
          expect(user[0]).toMatchObject({
            username: "butter_bridge",
            name: "jonny",
            avatar_url:
              "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
          });
        });
    });
    it("responds with a 404 status code and the message 'username does not exist' when a valid but none existant username is sent", () => {
      return request(app)
        .get("/api/users/nonExistent")
        .expect(404)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("username does not exist");
        });
    });
  });
});
