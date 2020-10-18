module.exports = (app, myDatabase) => {

  const bcrypt = require('bcrypt');
  const passport = require('passport');

  app.route('/').get((req, res) => {
		//Change the response to render the Pug template
		res.render(process.cwd() + '/views/pug', {
			title: 'Connected to Database',
			message: 'Please login',
			showLogin: true,
			showRegistration: true
		});
	});

	app.route('/login').post(passport.authenticate('local', { failureRedirect: '/' }), (req, res) => {
		res.redirect('/profile');
	});

	app.route('/profile').get(ensureAuthenticated, (req, res) => {
		res.render(process.cwd() + '/views/pug/profile', { username: req.user.username });
	});

	app.route('/logout').get((req, res) => {
		req.logout();
		res.redirect('/');
	});

	app.route('/register').post((req, res, next) => {
		myDataBase.findOne({ username: req.body.username }, (err, user) => {
      if (err) next(err);
			if (user) res.redirect('/');
			myDataBase.insertOne(
				{
					username: req.body.username,
					password: bcrypt.hashSync(req.body.password, 12)
				},
				(err, doc) => {
          if (err) res.redirect('/');
					next(null, doc.ops[0]);
				}
			);
		});
	}, passport.authenticate('local', { failureRedirect: '/' }),
		(req, res) => {
			res.redirect('/profile');
    }
  );

	app.use((req, res, next) => {
		res.status(404).type('text').send('Not Found');
  });
  
  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/');
  }

}