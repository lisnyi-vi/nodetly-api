const Query = require('./query');
const Mutation = require('./mutation');
const Note = require('./note');
const User = require('./user');
const { GraphQLDateTime } = require('graphql-iso-date');

module.exports = {
  DateTime: GraphQLDateTime,
  Query,
  Mutation,
  Note,
  User
};
