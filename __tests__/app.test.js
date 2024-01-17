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
    it("returns the article with a comment_count key value pair", ()=>{
      return request(app)
        .get("/api/articles/9")
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          expect(typeof article.comment_count).toBe("number")
          expect(article.comment_count).toBe(2);
        });
    })
    it("returns the article with a zero comment_count if it has no comments", ()=>{
      return request(app)
        .get("/api/articles/11")
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          expect(typeof article.comment_count).toBe("number")
          expect(article.comment_count).toBe(0);
        });
    })
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
            if(article.article_id === 1){
            expect(article.comment_count).toBe(11);
            }
            if(article.article_id === 7){
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
    it("returns a status code 200 and an empty array if its a valid article_id but it has no comments", ()=> {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(comments.length).toBe(0);
        });
    })
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
    it("returns a status code 400 with the message 'bad request' if passed an invalid article_id", () => {
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
          expect(msg).toBe("user does not exist");
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

describe("users", () => {
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
  it("rteurns the correct data", () => {
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
