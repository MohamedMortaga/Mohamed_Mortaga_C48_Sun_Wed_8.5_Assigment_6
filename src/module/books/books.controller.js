import { Router } from "express";
import * as booksService from "./books.service.js";
import { toFriendlyError } from "../../utils/mongo-error.js";

const booksController = Router();

// Q5 - POST /books
booksController.post("/", async (req, res, next) => {
  try {
    const result = await booksService.insertOneBook(req.body);
    res.status(201).json(result);
  } catch (err) {
    const friendly = toFriendlyError(err);
    if (friendly) return res.status(friendly.statusCode).json({ message: friendly.message });
    next(err);
  }
});

// Q6 - POST /books/batch
booksController.post("/batch", async (req, res, next) => {
  try {
    const list = Array.isArray(req.body) ? req.body : req.body.books;
    const result = await booksService.insertManyBooks(list);
    res.status(201).json(result);
  } catch (err) {
    const friendly = toFriendlyError(err);
    if (friendly) return res.status(friendly.statusCode).json({ message: friendly.message });
    next(err);
  }
});

// Q8 - PATCH /books/:title  (dynamic route registered after every static one)
booksController.patch("/:title", async (req, res, next) => {
  try {
    const result = await booksService.updateBookYearByTitle(req.params.title, req.body.year);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

// Q9 - GET /books/title?title=Brave New World
booksController.get("/title", async (req, res, next) => {
  try {
    const book = await booksService.findBookByTitle(req.query.title);
    if (!book) return res.status(404).json({ message: "no book found" });
    res.status(200).json(book);
  } catch (err) {
    next(err);
  }
});

// Q10 - GET /books/year?from=1990&to=2010
booksController.get("/year", async (req, res, next) => {
  try {
    const { from, to } = req.query;
    const result = await booksService.findBooksBetweenYears(from, to);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

// Q11 - GET /books/genre?genre=Science Fiction
booksController.get("/genre", async (req, res, next) => {
  try {
    const result = await booksService.findBooksByGenre(req.query.genre);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

// Q12 - GET /books/skip-limit
booksController.get("/skip-limit", async (req, res, next) => {
  try {
    const result = await booksService.skipLimitBooks();
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

// Q13 - GET /books/year-integer
booksController.get("/year-integer", async (req, res, next) => {
  try {
    const result = await booksService.findBooksWithIntegerYear();
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

// Q14 - GET /books/exclude-genres
booksController.get("/exclude-genres", async (req, res, next) => {
  try {
    const result = await booksService.findBooksExcludingGenres();
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

// Q15 - DELETE /books/before-year?year=2000
booksController.delete("/before-year", async (req, res, next) => {
  try {
    const result = await booksService.deleteBooksBeforeYear(req.query.year);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

// Q16 - GET /books/aggregate1
booksController.get("/aggregate1", async (req, res, next) => {
  try {
    const result = await booksService.aggregateBooksAfter2000Sorted();
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

// Q17 - GET /books/aggregate2
booksController.get("/aggregate2", async (req, res, next) => {
  try {
    const result = await booksService.aggregateBooksAfter2000Projected();
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

// Q18 - GET /books/aggregate3
booksController.get("/aggregate3", async (req, res, next) => {
  try {
    const result = await booksService.aggregateUnwindGenres();
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

// Q19 - GET /books/aggregate4
booksController.get("/aggregate4", async (req, res, next) => {
  try {
    const result = await booksService.aggregateJoinBooksWithLogs();
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});


export default booksController;
