import { ApolloGateway, RemoteGraphQLDataSource } from "@apollo/gateway";
import { ApolloServer } from "apollo-server-express";
import express from "express";

async function startApolloServer() {
  let gateway = new ApolloGateway({
    serviceList: [
      { name: "book", url: "http://localhost:4001" },
      { name: "movie", url: "http://localhost:4002" },
    ],
    buildService({ url }) {
      return new RemoteGraphQLDataSource({ url });
    },
  });
  const app = express();
  const server = new ApolloServer({
    gateway,
    subscriptions: false,
  });
  await server.start();

  app.post("/refreshSchema", async (request, response) => {
    try{
      await gateway.load();
    }catch(err){
      console.log(err);
    }
    response.sendStatus(200);
  });

  server.applyMiddleware({
    app,
    path: "/",
  });

  app.listen(4000);
}

startApolloServer()
  .then(() => {
    console.log(`🚀 Server ready`);
  })
  .catch((err) => {
    console.error("An error occurred during `startApolloServer`:");
    console.error(err);
    process.exit(1);
  });
