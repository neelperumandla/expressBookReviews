const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if(username && password){
    if(!users[username]){
        users.push({"username": username, "password": password});
        return res.status(200).json({message: "User egistered"});
    } else{
        return res.status(404).json({message: "User exists already"})
    }
  } else {
    return res.status(404).json({message: "Unable to register user"});
  }
});

const getBooks = () => {
    return new Promise((resolve, reject) =>{
        return books;
    })
}
// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  //Write your code here
  try{
    const booklist = await getBooks();
    return res.status(200).json({booklist});
  } catch(error){
    console.error(error);
    return res.status(401).json({message: "Error in retrieving books"});
  }
});

const getISBN = (isbn) =>{
    return new Promise((resolve, reject) => {
        if(books[isbn]){
            resolve(bookss[isbn]);
        } else {
            reject({status: 404, message: "ISBN not found"});
        }
    })
}
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  getISBN(isbn)
  .then(result => res.status(200).json({result}),
        error => res.status(error.status).json({message: error.message}));
  
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;

  getBooks()
    .then((bookEntries) => Object.values(bookEntries))
    .then((books) => books.filter((book) => book.title === title))
    .then((filteredBooks) => res.send(filteredBooks));  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;

    getBooks()
    .then((bookEntries) => Object.values(bookEntries))
    .then((books) => books.filter((book) => book.title === title))
    .then((filteredBooks) => res.send(filteredBooks));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  let retBook = books[isbn];

  if(retBook){
    let reviews = retBook.reviews;
    return res.status(200).json({reviews});
  } else {
    return res.status(400).json({message: "No book found"});
  }
  
});

module.exports.general = public_users;
