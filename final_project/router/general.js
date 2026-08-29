const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "Customer successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user. Username and password are required." });
});

// Task 10: Get the book list available in the shop using async/await and Promises
public_users.get('/', async function (req, res) {
  try {
    const getBooks = () => new Promise((resolve) => resolve(books));
    const bookList = await getBooks();
    return res.status(200).send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

// Task 11: Get book details based on ISBN using async/await and Promises
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const getBook = (isbn) => new Promise((resolve, reject) => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject(new Error("Book not found"));
      }
    });
    const book = await getBook(isbn);
    return res.status(200).send(JSON.stringify(book, null, 4));
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Task 12: Get book details based on author using async/await and Promises
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const getBooksByAuthor = (author) => new Promise((resolve, reject) => {
      const matchingBooks = [];
      const bookKeys = Object.keys(books);
      bookKeys.forEach(key => {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
          matchingBooks.push(books[key]);
        }
      });
      if (matchingBooks.length > 0) {
        resolve(matchingBooks);
      } else {
        reject(new Error("No books found by this author"));
      }
    });
    const matchingBooks = await getBooksByAuthor(author);
    return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Task 13: Get all books based on title using async/await and Promises
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const getBooksByTitle = (title) => new Promise((resolve, reject) => {
      const matchingBooks = [];
      const bookKeys = Object.keys(books);
      bookKeys.forEach(key => {
        if (books[key].title.toLowerCase() === title.toLowerCase()) {
          matchingBooks.push(books[key]);
        }
      });
      if (matchingBooks.length > 0) {
        resolve(matchingBooks);
      } else {
        reject(new Error("No books found with this title"));
      }
    });
    const matchingBooks = await getBooksByTitle(title);
    return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
