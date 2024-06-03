/** Database config for database. */


const { Client } = require("pg");
const {DB_URI, DB_TYPE} = require("./config");

const db = new Client({
  user: 'darewood',
  password: process.env.DB_PASSWORD,
  host: 'localhost',
  port: 5432,
  database: DB_TYPE,
})

db.connect();


module.exports = db;
