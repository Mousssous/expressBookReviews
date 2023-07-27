const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
let prompt = require("prompt-sync")();
let fs = require("fs");

//to convert book json dictionnary to an array

const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename > 0) {
    return true;
  } else {
    return false;
  }
};

//filter function
function filterBooks(dict = books, key, value) {
  var filtered = {};
  for (let i = 1; i < Object.keys(books).length; i++) {
    if (books[i][key] == value) {
      filtered[Object.keys(books[i])] = Object.values(books[i]);
    }
  }
  return filtered;
}

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  //checking is username already exists in the list of registered users

  if (username && password) {
    if (!doesExist(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.send(JSON.stringify({ books }, null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  let isbn = req.params.isbn;
  res.send(books[isbn]);
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  res.send(filterBooks(books, "author", author));
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  res.send(filterBooks(books, "title", title));
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  let isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

//Promise (all books)
const getAllBooks = new Promise((resolve, reject) => {
  try {
    resolve((data = books));
  } catch (err) {
    reject(err);
  }
});

getAllBooks.then(
  (data) => console.log(data),
  (err) => console.log("Error on getAllBooks")
);

//Promise (by ISBN)
const getBooksByISBN = new Promise((resolve, reject) => {
  let isbn = 3;
  try {
    resolve((data = books[isbn]));
  } catch (err) {
    reject(err);
  }
});

getBooksByISBN.then(
  (data) => console.log(data),
  (err) => console.log("Error on getBooksByISBN")
);

//Promise (by ISBN)
const getBooksByTitle = new Promise((resolve, reject) => {
  let title = "One Thousand and One Nights";
  try {
    resolve((data = filterBooks(books, "title", title)));
  } catch (err) {
    reject(err);
  }
});

getBooksByTitle.then(
  (data) => console.log(data),
  (err) => console.log("Error on getBooksByTitle")
);

module.exports.general = public_users;
