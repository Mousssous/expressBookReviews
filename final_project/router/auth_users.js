const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let validUserName = body.req.username;
  if(validUserName.length > 0){
    res.status('Valide username');
  }else{
    res.status('Invalide username');
  }
}

const authenticatedUser = (username,password)=>{
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}


//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }
 if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;

  const review = req.query.review;

  const username = req.session.authorization.username;

  if (!isbn) {

    return res.status(400).json({ message: "ISBN is required" });

  }

   if (!review) {

    return res.status(400).json({ message: "Review is required" });

  }

   if (!username) {

    console.log(req.session);
    return res.status(401).json({ message: "User is not logged in" });

  }

  const book = books[isbn];

  if (!book) {

    return res.status(404).json({ message: "Book not found" });

  }

  const userReview = book.reviews[username];

  if (userReview) {

    book.reviews[username] = review;

    return res.status(202).json({ message: "Review modified successfully" });

  } else {

    book.reviews[username] = review;

    return res.status(201).json({ message: "Review added successfully" });

  }

});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;

    const username = req.session.authorization.username;


    if (!isbn) {

        return res.status(400).json({ message: "ISBN is required" });

    }


    if (!username) {

        return res.status(401).json({ message: "User is not logged in" });

    }


    const book = books[isbn];


    if (!book) {

        return res.status(404).json({ message: "Book not found" });

    }


    const userReview = book.reviews[username];

    if (!userReview) {

        return res.status(404).json({ message: "Review not found" });

    }


    delete book.reviews[username];

    return res.status(200).json({ message: "Review deleted successfully" });

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
