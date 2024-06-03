/** Common config for bookstore. */


let DB_URI = `postgresql://`;
let DB_TYPE;

if (process.env.NODE_ENV === "test") {
  DB_URI = `${DB_URI}/books_test`;
  DB_TYPE = "books_test"
} else {
  DB_URI = process.env.DATABASE_URL || `${DB_URI}/books`;
  DB_TYPE = "books"
}


module.exports = { DB_URI, DB_TYPE };