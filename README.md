# Northcoders News API

# Northcoders News API

This project is an API for the which gives the client endpoints to access a databasecreated with PSQL, and 
using ElephantSQL to create an online location for the database, and Render to host the API.
The database is composed of news articles, comments on those articles, article topics and users

API link https://newsflash-e6p1.onrender.com

https://newsflash-e6p1.onrender.com/api

this endpoint give the client all of the possible endpoints
including :-    a short description
                the queries that can be used
                and an example of the response

The repsoitory is available on www.github.com/Gazdean/be-nc-news
In the terminal run `git clone <github-link-here>` - makes a local copy of the remote repo at the specified link


You will need to create two .env files this project: .env.test and .env.development.
Into each file add PGDATABASE= with the correct database name for that environment.
(There is a .env.example text file which shows this)
(also see /db/setup.sql for the database names).

To run this project you will need

PostgreSQL version 16
node.js v20.5.1

The dependencies needed are

    husky: v 8.0.2          www.npmjs.com/package/husky
    pg-format: v 1.0.4      www.npmjs.com/package/pg-format
    dotenv: v 16.0.0        www.npmjs.com/package/dotenv       
    express: v 4.18.2       www.npmjs.com/package/express
    pg: v 8.11.3            www.npmjs.com/package/pg

The dev dependencies needed are

    
    jest: v 27.5.1          www.npmjs.com/package/jest
    jest-extended: v 2.0.0  www.npmjs.com/package/jest-extended
    jest-sorted: v 1.0.14   www.npmjs.com/package/jest-sorted
    supertest: v 6.3.3      www.npmjs.com/package/supertest

to set up the database run npm `setup-dbs`
to seed the database run `npm run seed`
to run the test suite run `npm test api` in the terminal 
