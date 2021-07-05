import express from "express";
import { ApolloServer, gql } from "apollo-server-express";
import { buildFederatedSchema } from "@apollo/federation";

const books = [
  {
    title: "Parable of the Sower",
    author: "Octavia E. Butler",
  },
  {
    title: "Jurassic Park",
    author: "Michael Crichton",
  },
];

const typeDefs = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.

  # This "Book" type can be used in other type declarations.
  type Book {
    title: String
    author: String
  }

  # The "Query" type is the root of all GraphQL queries.
  # (A "Mutation" type will be covered later on.)
  type Query {
    books: [Book]
  }
`;

const resolvers = {
  Query: {
    books: () => books,
  },
};

const serverOne = new ApolloServer({
  schema: buildFederatedSchema([
    { typeDefs: typeDefs, resolvers: resolvers },
  ]),});

const movies = [
  {
    title: "JAWS",
    director: " Steven Spielberg",
  },
  {
    title: "Jurassic Park",
    director: "Steven Spielberg",
  },
];

const typeDefs2 = gql`
  type Movie {
    title: String
    director: String
  }

  type Query {
    movies: [Movie]
  }
`;

const resolvers2 = {
  Query: {
    movies: () => movies,
  },
};

const serverTwo = new ApolloServer({
  schema: buildFederatedSchema([
    { typeDefs: typeDefs2, resolvers: resolvers2 },
  ]),
});

const app = express();
const app2 = express();

async function startApolloServerOne() {
  await serverOne.start();

  serverOne.applyMiddleware({
    app,
    path: "/",
  });

  app.listen({ port: 4001 });
}
async function startApolloServerTwo() {
  await serverTwo.start();

  serverTwo.applyMiddleware({
    app: app2,
    path: "/",
  });

  app2.listen({ port: 4002 });
}

startApolloServerOne()
  .then(() => {
    console.log(`🚀 Service one ready`);
  })
  .catch((err) => {
    console.error("An error occurred during `startApolloServer`:");
    console.error(err);
    process.exit(1);
  });

startApolloServerTwo()
  .then(() => {
    console.log(`🚀 Service two ready`);
  })
  .catch((err) => {
    console.error("An error occurred during `startApolloServer`:");
    console.error(err);
    process.exit(1);
  });
