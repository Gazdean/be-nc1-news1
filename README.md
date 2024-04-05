# Northcoders News API

This project is an API for the which gives the client endpoints to access a databasecreated with PSQL, and 
using ElephantSQL to create an online location for the database, and Render to host the API.
The database is composed of news articles, comments on those articles, article topics and users

API link: https://newsflash-e6p1.onrender.com

all endpoints: https://newsflash-e6p1.onrender.com/api

This gives the client all of the possible endpoints
including : 
- A short description
- The queries that can be used (an empty array [] means there are no queries available)
- The data needed for a patch or post request (an empty object {} means no data needs to be sent)
- An example of the response


The repsoitory is available on https://www.github.com/Gazdean/be-nc-news
<br>To make a copy of the project copy the repo address from github then
in the terminal run <br><br>`git clone <github-link-here>` <br><br>
This makes a local copy of the remote repo from the specified link


You will need to create two .env files this project: .env.test and .env.development.
Into each file add PGDATABASE= with the correct database name for that environment.
(There is a .env.example text file which shows this)
(also see /db/setup.sql for the database names).

To run this project you will need

PostgreSQL version 16
node.js v20.5.1

The dependencies needed are

- pg-format: v 1.0.4      https://www.npmjs.com/package/pg-format
- dotenv: v 16.0.0        https://www.npmjs.com/package/dotenv       
- express: v 4.18.2       https://www.npmjs.com/package/express
- pg: v 8.11.3            https://www.npmjs.com/package/pg

The dev dependencies needed are

- cors: 2.8.5,            https://www.npmjs.com/package/cors
- husky: v 8.0.2          https://www.npmjs.com/package/husky
- jest: v 27.5.1          https://www.npmjs.com/package/jest
- jest-extended: v 2.0.0  https://www.npmjs.com/package/jest-extended
- jest-sorted: v 1.0.14   https://www.npmjs.com/package/jest-sorted
- supertest: v 6.3.3      https://www.npmjs.com/package/supertest

When making requests to the API from a React app, you will run into a Cross Origin Resource Sharing (CORS) error. To enable requests on the backend from my frontend react project https://github.com/Gazdean/fe-nc-news I installed the CORS package from npm

to set up the database run npm `setup-dbs`
to seed the database run `npm run seed`
to run the test suite run `npm test api` in the terminal 
