const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();




public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  try{
    const booksList = await JSON.stringify(books,null,4);
    res.send(booksList);
  }
  catch(err){
    res.send(err)
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  try{
    const book = await JSON.stringify(books[req.params.isbn],null,4);
    res.send(book);
  }
  catch(err){
    res.send(err)
  }
 });

// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  try{
    const author = req.params.author;
    const authorBooks = [],currentBooks = await books;
    for(isbn in currentBooks){
      const currentBook =  currentBooks[isbn];
      if(currentBook["author"]===author)authorBooks.push(currentBook)
    };
    res.send(authorBooks);
  }
  catch(err){
    res.send(err)
  }
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  try{
    const title = req.params.title;
    const titleBooks = [],currentBooks = await books;
    for(isbn in currentBooks){
      const currentBook =  currentBooks[isbn];
      if(currentBook["title"]===title)titleBooks.push(currentBook)
    };
    res.send(titleBooks);
  }
  catch(err){
    res.send(err)
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  res.send(books[req.params.isbn]["reviews"])
});

module.exports.general = public_users;
