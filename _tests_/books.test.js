process.env.NODE_ENV = "test"

const request = require("supertest");


const app = require("../app");
const db = require("../db");

let bookIsbn;

beforeEach(async () => {
    let result = await db.query(
        `INSERT INTO
        books (isbn, amazon_url,author,language,pages,publisher,title,year)
        VALUES(
            '123123123',
            'https://amazon.com/test',
            'Test Author',
            'English',
            100,
            'Test Press',
            'Test Book',
            1997)
        RETURNING isbn`);

    bookIsbn = result.rows[0].isbn
});

afterEach(async()=>{
    await db.query(`DELETE from books`)
})

afterAll(async function() {
    await db.end();
});

describe("GET /books", function () {
    test("Gets a list books", async () => {
      const response = await request(app).get(`/books`);

      expect(response.body.books[0]).toHaveProperty("isbn");
      expect(response.body.books[0]).toHaveProperty("amazon_url");
    });
  });

describe("GET /books/:isbn", function () {
    test("Get a book", async () => {
        const response = await request(app).get(`/books/${bookIsbn}`)

        expect(response.body.book).toHaveProperty("isbn");
        expect(response.body.book.isbn).toBe(bookIsbn);
    });

    test("Responds with 404 if book cannot be found", async () => {
        const response = await request(app).get(`/books/12323`)

        expect(response.statusCode).toBe(404);
    });
});

describe("POST /books", function () {
    test("Create new book", async () => {
        const response = await request(app).post(`/books`).send({
            isbn: '321321321',
            amazon_url: "https://amazon.com/test2",
            author: "Test2 Author",
            language: "english",
            pages: 100,
            publisher: "Test2 Publisher",
            title: "Test2 Book",
            year: 2015
            });
        expect(response.statusCode).toBe(201);
        expect(response.body.book).toHaveProperty("isbn");
    });

    test("Cannot create book without Author", async () => {
        const response = await request(app).post(`/books`).send({
            isbn: '231231231',
            amazon_url: "https://amazon.com/test3",
            language: "english",
            pages: 100,
            publisher: "Test3 Publisher",
            title: "Test3 Book",
            year: 2015
        });
        expect(response.statusCode).toBe(400);
    });
});

describe("PUT /books/:id", function () {
    test("Update a book", async () => {
        const response = await request(app).put(`/books/${bookIsbn}`).send({
            amazon_url: "https://google.com",
            author: "New Author",
            language: "japanese",
            pages: 10,
            publisher: "New Publisher",
            title: "New Book",
            year: 2001
            });
        expect(response.body.book).toHaveProperty("isbn");
        expect(response.body.book.author).toBe("New Author");
    });

    test("Responds with 404 if book cannot be found", async () => {
        const response = await request(app).get(`/books/2131`)

        expect(response.statusCode).toBe(404);
    });
});