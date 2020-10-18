'use strict';
require('dotenv').config();
const express = require('express');
const myDB = require('./connection');
const fccTesting = require('./freeCodeCamp/fcctesting.js');
const session = require('express-session');
const passport = require('passport');
const routes = require('./routes');
const auth = require('./auth');

const app = express();
app.set('view engine', 'pug');

fccTesting(app); //For FCC testing purposes
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: true,
		saveUninitialized: true,
		cookie: { secure: false }
	})
);
app.use(passport.initialize());
app.use(passport.session());
app.use('/public', express.static(process.cwd() + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

myDB(async (client) => {
  const myDataBase = await client.db('database').collection('users');

  routes(app, myDataBase);
  auth(app, myDataBase);

}).catch((e) => {
	app.route('/').get((req, res) => {
		res.render(process.cwd() + '/views/pug', { title: e, message: 'Unable to login' });
	});
});

app.listen(process.env.PORT || 3000, () => {
	console.log('Listening on port ' + process.env.PORT || 3000);
});
