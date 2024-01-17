\c nc_news_test

      
SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id)::INT AS comment_count
FROM articles
LEFT OUTER JOIN comments ON articles.article_id = comments.article_id
WHERE articles.topic = $1
GROUP BY articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url
ORDER BY articles.created_at DESC;

SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id):: INT AS comment_count
FROM articles
LEFT OUTER JOIN comments ON articles.article_id = comments.article_id
WHERE articles.topic = $1
GROUP BY articles.article_id
ORDER BY articles.created_at DESC, [topic];