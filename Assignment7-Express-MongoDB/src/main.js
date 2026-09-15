import express from "express";
import { PORT } from "./config/config.js";
import { connectDB } from "./DB/connection.db.js";
import collectionController from "./module/collection/collection.controller.js";
import booksController from "./module/books/books.controller.js";
import logsController from "./module/logs/logs.controller.js";
import notFoundMiddleware from "./middleware/notfound.middleware.js";
import globalErrMiddleware from "./middleware/error.middleware.js";

async function bootstrap() {
  const app = express();

  app.use(express.json());

  await connectDB();

  app.use("/collection", collectionController); // Q1-Q4: collection management
  app.use("/books", booksController); // Q5,Q6,Q8-Q19: books CRUD + queries + aggregation
  app.use("/logs", logsController); // Q7: logs

  app.use((req, res, next) => notFoundMiddleware(req, res, next));

  app.use(globalErrMiddleware);

  app.listen(PORT, () => console.log(`Assignment 7 API listening on port ${PORT}!`));
}

bootstrap();
