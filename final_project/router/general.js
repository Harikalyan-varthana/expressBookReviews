const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    const exists = users.filter((user) => user.username === username);
    if (exists.length === 0) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    const getBooks = new Promise((resolve, reject) => {
        resolve(books);
      });
      getBooks.then((bookList) => {
        res.status(200).send(JSON.stringify(bookList, null, 4));
      });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const getBook = new Promise((resolve, reject) => {
    let book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject({ status: 404, message: "Book not found" });
    }
  });
  getBook.then((book) => {
    res.status(200).send(book);
  })
  .catch((err) => {
    res.status(err.status || 500).json({message: err.message});
  });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const getBooksByAuthor = new Promise((resolve, reject) => {
      let booksByAuthor = Object.values(books).filter((book) => book.author === author);
      if (booksByAuthor.length > 0) {
        resolve(booksByAuthor);
      } else {
        reject({ status: 404, message: "Books not found for the author" });
      }
    });
    getBooksByAuthor.then((booksByAuthor) => {
      res.status(200).send(booksByAuthor);
    })
    .catch((err) => {
      res.status(err.status || 500).json({message: err.message});
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const getBooksByTitle = new Promise((resolve, reject) => {
      let booksByTitle = Object.values(books).filter((book) => book.title === title);
      if (booksByTitle.length > 0) {
        resolve(booksByTitle);
      } else {
        reject({ status: 404, message: "Books not found for the title" });
      }
    });
    getBooksByTitle.then((booksByTitle) => {
      res.status(200).send(booksByTitle);
    })
    .catch((err) => {
      res.status(err.status || 500).json({message: err.message});
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const getBookReview = new Promise((resolve, reject) => {
      let book = books[isbn];
      if (book) {
        resolve(book.reviews);
      } else {
        reject({ status: 404, message: "Book not found" });
      }
    });
    getBookReview.then((bookReview) => {
      res.status(200).send(bookReview);
    })
    .catch((err) => {
      res.status(err.status || 500).json({message: err.message});
    });
});

module.exports.general = public_users;
