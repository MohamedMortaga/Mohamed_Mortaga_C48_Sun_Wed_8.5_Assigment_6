// Translates thrown errors into a clear, human-readable { statusCode, message }.
// Returns null when the error isn't one we recognize, so the caller can fall
// through to the global error handler instead of masking a real bug.
export function toFriendlyError(err) {
  // Errors we threw ourselves already carry the right statusCode/message.
  if (err.statusCode) {
    return { statusCode: err.statusCode, message: err.message };
  }

  // Native MongoDB driver errors carry a numeric `code`.
  if (err.name === "MongoServerError") {
    switch (err.code) {
      case 11000: // duplicate key
        return { statusCode: 409, message: "Duplicate value violates a unique constraint." };
      case 121: // document failed validation ($jsonSchema)
        return {
          statusCode: 400,
          message: "Document failed schema validation (e.g. missing/empty required field).",
        };
      case 48: // NamespaceExists
        return { statusCode: 409, message: "Collection already exists." };
      case 26: // NamespaceNotFound
        return { statusCode: 404, message: "Collection not found." };
      default:
        return { statusCode: 400, message: err.message };
    }
  }

  if (err.name === "BSONError" || /ObjectId/i.test(err.message || "")) {
    return { statusCode: 400, message: "Invalid id format." };
  }

  return null;
}
