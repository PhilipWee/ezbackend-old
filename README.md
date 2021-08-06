# EzBackend

Create a ~~fully extensible~~ backend in **two lines of code**

> ⚠️ Package still in development

> 💡 Currently working on the fully extensible part

## Usage

Create a new node package (Or use an existing one)
```
mkdir ezbackend-testing
cd ezbackend-testing
npm init -y
```
Instantiate Ezbackend
```
npx ezbackend init
npm run ezb
```

## What it does

1. Look at schemas inside the generated .ezb folder
2. Automatically generate generic endpoints for each schema
3. Automatically create the tables in SQLite3 in-memory DB
4. Automatically create the documentation for each endpoint
5. Leave you more time to work on the things that actually matter

![documentation](/swagger-image.png)

## How it works
1. It uses [sequelize](https://sequelize.org/master/) to connect to any sequelize supported DB (Postgres, MySQL, SQLite, etc)
2. It uses [fastify](https://www.fastify.io/) to create the endpoints
3. It uses [fastify swagger](https://github.com/fastify/fastify-swagger) to generate the documentation



## Planned Features

1. One line authentication (Google, facebook, etc)
2. One line file storage
3. One line custom functions (CRON jobs, etc)
4. One click deploy (Server)
5. One click deploy (Serverless)
6. One line GraphQL
7. Database Editor
8. One line client side code
9. Benchmarks (Firebase, AWS Amplify, etc)

# 📞Contact Us📞
> If you are keen on contributing/using EzBackend contact us at we.are.collaboroo@gmail.com

> Or submit a pull request to the [main repo](https://github.com/Collaboroo/ezbackend)


## Work to be done before initial release

1. Refactor code to be extensible with fastify/express plugins
2. Expose ability to customise transpiling/compiling (Whichever it ends up being)
3. Make code into monorepo to seperate cli tool from core tool to reduce bloat (Not sure if the is even needed for backend though)
4. Refactor code to use node modules within .ezb folder (Similar to firebase functions)
5. Expose prehandler, handler, posthandler functions
6. Expose middleware, etc
7. Actually populate the descriptions on swagger