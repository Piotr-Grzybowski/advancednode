"use strict";
require('dotenv').config()
const express = require("express");
const myDB = require('./connection');
const fccTesting = require("./freeCodeCamp/fcctesting.js");
const session = require('express-session');
const passport = require('passport');
const ObjectID = require('mongodb').ObjectID;

const app = express();
app.set('view engine', 'pug');

fccTesting(app); //For FCC testing purposes
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}));
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  myDB.findOne({ _id: new ObjectID(id) }, (err, doc) => {
    done(null, null);
  });
});
app.use(passport.initialize());
app.use(passport.session());
app.use("/public", express.static(process.cwd() + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.route("/").get((req, res) => {
  //Change the response to render the Pug template
  res.render(process.cwd() + '/views/pug', {title: 'Hello', message: 'Please login'});
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Listening on port " + process.env.PORT);
});