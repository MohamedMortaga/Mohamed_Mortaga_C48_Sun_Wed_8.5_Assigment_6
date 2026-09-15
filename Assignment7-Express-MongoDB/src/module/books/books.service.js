import { getDB } from "../../DB/connection.db.js";

const books = () => getDB().collection("books");
const logs = () => getDB().collection("logs");

// Q5: insert one document into the books collection.
export const insertOneBook = async (book) => {
  const result = await books().insertOne(book);
  return { acknowledged: result.acknowledged, insertedId: result.insertedId };
};

// Q6: insert multiple documents (at least three records) into books.
export const insertManyBooks = async (bookList) => {
  if (!Array.isArray(bookList) || bookList.length < 3) {
    const error = new Error("Request body must be an array of at least three books.");
    error.statusCode = 400;
    throw error;
  }
  const result = await books().insertMany(bookList);
  return { acknowledged: result.acknowledged, insertedIds: result.insertedIds };
};

// Q8: update the book with the given title, changing its year.
export const updateBookYearByTitle = async (title, year) => {
  const result = await books().updateOne({ title }, { $set: { year } });
  return {
    acknowledged: result.acknowledged,
    matchedCount: result.matchedCount,
    modifiedCount: result.modifiedCount,
  };
};

// Q9: find a book by title.
export const findBookByTitle = async (title) => {
  return books().findOne({ title });
};

// Q10: find all books published between two years (inclusive).
export const findBooksBetweenYears = async (from, to) => {
  return books()
    .find({ year: { $gte: Number(from), $lte: Number(to) } }, { projection: { _id: 0 } })
    .toArray();
};

// Q11: find books where the genres array includes a given genre.
export const findBooksByGenre = async (genre) => {
  return books()
    .find({ genres: genre }, { projection: { _id: 0 } })
    .toArray();
};

// Q12: skip the first two books, limit to the next three, sorted by year desc.
export const skipLimitBooks = async () => {
  return books().find({}).sort({ year: -1 }).skip(2).limit(3).toArray();
};

// Q13: find books where the year field is stored as an integer (BSON int32).
export const findBooksWithIntegerYear = async () => {
  return books()
    .find({ year: { $type: "int" } })
    .toArray();
};

// Q14: find books whose genres do NOT include "Horror" or "Science Fiction".
export const findBooksExcludingGenres = async () => {
  return books()
    .find({ genres: { $nin: ["Horror", "Science Fiction"] } })
    .toArray();
};

// Q15: delete all books published before a given year.
export const deleteBooksBeforeYear = async (year) => {
  const result = await books().deleteMany({ year: { $lt: Number(year) } });
  return { acknowledged: result.acknowledged, deletedCount: result.deletedCount };
};

// Q16: aggregation - filter books published after 2000, sorted by year desc.
export const aggregateBooksAfter2000Sorted = async () => {
  return books()
    .aggregate([
      { $match: { year: { $gt: 2000 } } },
      { $sort: { year: -1 } },
      { $project: { _id: 0, title: 1, author: 1, year: 1, genres: 1 } },
    ])
    .toArray();
};

// Q17: aggregation - books published after 2000, only title/author/year.
export const aggregateBooksAfter2000Projected = async () => {
  return books()
    .aggregate([
      { $match: { year: { $gt: 2000 } } },
      { $project: { _id: 0, title: 1, author: 1, year: 1 } },
    ])
    .toArray();
};

// Q18: aggregation - break the genres array into separate documents.
export const aggregateUnwindGenres = async () => {
  return books()
    .aggregate([
      { $unwind: "$genres" },
      { $project: { _id: 0, title: 1, genres: 1 } },
    ])
    .toArray();
};

// Q19: aggregation - join books with logs (grouped by action).
export const aggregateJoinBooksWithLogs = async () => {
  return logs()
    .aggregate([
      {
        $lookup: {
          from: "books",
          localField: "book_id",
          foreignField: "_id",
          as: "book_details",
        },
      },
      { $unwind: { path: "$book_details", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: "$action",
          book_details: {
            $push: {
              title: "$book_details.title",
              author: "$book_details.author",
              year: "$book_details.year",
            },
          },
        },
      },
      { $project: { _id: 0, action: "$_id", book_details: 1 } },
    ])
    .toArray();
};
