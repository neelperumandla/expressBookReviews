const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password){
    return res.status(404).json({messsage: "Invalid username or password"});
  }

  if(!isValid(username)){
    return res.status(404).json({messsage: "Invalid username"});
  }

  if(authenticatedUser(username, password)){
    let accessToken = jwt.sign({data: password}, 'access', {expiresIn: 60*60});

    req.session.authorization = {
        accessToken, username
    }
    return res.status(200).json({message: "User logged in"});
  } else{
    return res.status(404).json({users});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.body.review;
  const user = req.session.authorization["username"];

  if(!books[isbn]){
    return res.status(404).json({message: "Book not found"});
  }

  if(!review){
    res.status(404).json({message: "Review needed"});
  }

  books[isbn].reviews[user] = review;

  return res.status(200).json({message: "Review succesfully added/modified"});
});

regd_users.delete("/auth/review/:isbn", (req, res) =>{
    const isbn = req.params.isbn;
  
  const user = req.session.authorization["username"];

  if(!books[isbn]){
    return res.status(404).json({message: "Book not found"});
  }

  

  delete books[isbn].reviews[user];

  return res.status(200).json({message: "Review succesfully deleted"});
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
