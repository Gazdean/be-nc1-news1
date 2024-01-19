\c nc_news_test

SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments. article_id)::int AS comment_count
FROM articles
LEFT JOIN comments ON comments.article_id = articles.article_id
GROUP BY articles.article_id
OFFSET 0 ROWS FETCH NEXT 10 ROWS ONLY;