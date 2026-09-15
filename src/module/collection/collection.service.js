import { getDB } from "../../DB/connection.db.js";

const collectionExists = async (name) => {
  const db = getDB();
  const list = await db.listCollections({ name }).toArray();
  return list.length > 0;
};

// Q1: explicit collection "books" with a validation rule requiring a
// non-empty "title" field on every document.
export const createBooksCollectionExplicit = async () => {
  const db = getDB();

  if (await collectionExists("books")) {
    return { ok: 1, message: "Collection 'books' already exists." };
  }

  await db.createCollection("books", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["title"],
        properties: {
          title: {
            bsonType: "string",
            minLength: 1,
            description: "'title' must be a non-empty string and is required",
          },
        },
      },
    },
    validationLevel: "strict",
    validationAction: "error",
  });

  return { ok: 1 };
};

// Q2: implicit collection "authors" - created automatically by inserting a document directly.
export const createAuthorImplicit = async (authorData) => {
  const db = getDB();
  const result = await db.collection("authors").insertOne(authorData);
  return { acknowledged: result.acknowledged, insertedId: result.insertedId };
};

// Q3: capped collection "logs" limited to 1MB.
export const createLogsCollectionCapped = async () => {
  const db = getDB();

  if (await collectionExists("logs")) {
    return { ok: 1, message: "Collection 'logs' already exists." };
  }

  await db.createCollection("logs", {
    capped: true,
    size: 1024 * 1024,
  });

  return { ok: 1 };
};

// Q4: index on books.title
export const createBooksTitleIndex = async () => {
  const db = getDB();
  const indexName = await db.collection("books").createIndex({ title: 1 });
  return indexName;
};
