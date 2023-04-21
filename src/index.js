const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
require('dotenv').config({ path: __dirname + '/.env' });
const jwt = require('jsonwebtoken');
const depthLimit = require('graphql-depth-limit');
const { createComplexityLimitRule } = require('graphql-validation-complexity');
const mongoose = require('mongoose');

// const db = require('./db');
const models = require('./models');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

//Запуск сервера нп порті з файлу .env, або на порті 4000
const port = process.env.PORT || 4000;
const DB_HOST = process.env.DB_HOST;

const getUser = token => {
  if (token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      new Error('Session invalid');
    }
  }
};

const app = express();
app.use(helmet());
app.use(cors());

mongoose.connect(DB_HOST, {
  useNewUrlParser: true,
  useUnifiedTopology: true
  // useFindAndModify: false,
  // useCreateIndex: true
});

// db.connect(DB_HOST);
//Настроюэмо ApolloServer
const server = new ApolloServer({
  typeDefs,
  resolvers,
  validationRules: [depthLimit(5), createComplexityLimitRule(1000)],
  context: ({ req }) => {
    const token = req.headers.authorization;
    const user = getUser(token);
    console.log(user);
    return { models, user };
  }
});

//Застосовуємо проміжне ПЗ Apollo GraphQL і вказуємо шлах до /api
server.applyMiddleware({ app, path: '/api' });

app.listen(port, () => {
  console.log(
    `GraphQL Server running at http://localhost:${port}${server.graphqlPath}`
  );
});
