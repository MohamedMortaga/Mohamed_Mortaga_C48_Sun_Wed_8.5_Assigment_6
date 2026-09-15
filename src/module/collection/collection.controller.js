import { Router } from "express";
import * as collectionService from "./collection.service.js";
import { toFriendlyError } from "../../utils/mongo-error.js";

const collectionController = Router();

// Q1 - POST /collection/books
collectionController.post("/books", async (req, res, next) => {
  try {
    const result = await collectionService.createBooksCollectionExplicit();
    res.status(201).json(result);
  } catch (err) {
    const friendly = toFriendlyError(err);
    if (friendly) return res.status(friendly.statusCode).json({ message: friendly.message });
    next(err);
  }
});

// Q2 - POST /collection/authors
collectionController.post("/authors", async (req, res, next) => {
  try {
    const result = await collectionService.createAuthorImplicit(req.body);
    res.status(201).json(result);
  } catch (err) {
    const friendly = toFriendlyError(err);
    if (friendly) return res.status(friendly.statusCode).json({ message: friendly.message });
    next(err);
  }
});

// Q3 - POST /collection/logs/capped
collectionController.post("/logs/capped", async (req, res, next) => {
  try {
    const result = await collectionService.createLogsCollectionCapped();
    res.status(201).json(result);
  } catch (err) {
    const friendly = toFriendlyError(err);
    if (friendly) return res.status(friendly.statusCode).json({ message: friendly.message });
    next(err);
  }
});

// Q4 - POST /collection/books/index
collectionController.post("/books/index", async (req, res, next) => {
  try {
    const indexName = await collectionService.createBooksTitleIndex();
    res.status(201).json(indexName);
  } catch (err) {
    next(err);
  }
});

export default collectionController;
