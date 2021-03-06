const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');
const app = express();

const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

// mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require('cors');
app.use(cors());

let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

app.use(morgan('common'));


// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to myFlix app!');
});

app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});

/**
 * Get all movies
 * @method GET
 * @param {string} endpoint - endpoint to fetch movies. "url/movies"
 * @returns {object} - returns a list of movie object
 * @requires authentication JWT
 */
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find()
    .then(function (movies) {
      res.status(201).json(movies);
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).send('Error:' + error);
    });
});

/**
 * Get movies by title
 * @method GET
 * @param {string} endpoint - endpoint - fetch movie by title
 * @param {string} title - is used to get specific movie "url/movies/:title"
 * @returns {object} - returns the movie with specific title
 * @requires authentication JWT
 */
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ Title: req.params['title'] }).then(movie => res.json(movie));
});

/**
 * Get user by username
 * @method GET
 * @param {string} endpoint - endpoint - fetch user by username
 * @param {string} username - is used to get specific user "url/users/:Username"
 * @returns {object} - returns a specific user
 * @requires authentication JWT
 */
app.get('/users/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({ Username: req.params['username'] }).then(user => res.json(user));
});

/**
 * Get genre by name
 * @method GET
 * @param {string} endpoint - endpoint - fetch genre by name
 * @param {string} name - is used to get specific genre "url/genres/:Name"
 * @returns {object} - returns a specific genre
 * @requires authentication JWT
 */
app.get('/genres/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ 'Genre.Name': req.params['name'] }).then(movie => res.json(movie['Genre']));
});

/**
 * Get director by name
 * @method GET
 * @param {string} endpoint - endpoint - fetch director by name
 * @param {string} name - is used to get specific director "url/directors/:Name"
 * @returns {object} - returns a specific director
 */
app.get('/directors/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ 'Director.Name': req.params['name'] }).then(movie => res.json(movie['Director']));
});


/**
 * Add user
 * @method POST
 * @param {string} endpoint - endpoint to add user. "url/users"
 * @param {string} Username - choosen by user
 * @param {string} Password - user's password
 * @param {string} Email - user's e-mail adress
 * @param {string} Birthday - user's birthday
 * @returns {object} - new user
 * @requires auth no authentication - public
 */
app.post('/users',
  [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);

    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + 'already exists');
        } else {
          Users
            .create({
              Username: req.body.Username,
              Password: hashedPassword,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then((user) => { res.status(201).json(user) })
            .catch((error) => {
              console.error(error);
              res.status(500).send('Error: ' + error);
            })
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  });

/**
* Get list of favorite movies
* @method GET
* @param {string} id - endpoint to fetch users favorite movies by id
* @returns {object} - returns a movie object list from favorite movies 
* @requires authentication JWT
*/
app.get('/users/:id/favorites', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findById(req.params['id']).then(user => res.json(user.FavoriteMovies));
});

/**
 * Add movie to favorites
 * @method PATCH
 * @param {string} endpoint - endpoint to add movies to favorites
 * @param {string} id - userId
 * @param {string} movieId - both are required
 * @returns {string} - returns success/error message
 * @requires authentication JWT
 */
app.patch('/users/:id/favorites/:movieId', passport.authenticate('jwt', { session: false }), (req, res) => {
  let id = req.params.id;
  Users.findByIdAndUpdate(id, {
    $push:
    {
      FavoriteMovies: req.params.movieId
    }
  },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
});

/**
  * Update user by username
  * @method PUT
  * @param {string} endpoint - endpoint to add user. "url/users/:id"
  * @param {string} Username - required
  * @param {string} Password - user's new password
  * @param {string} Email - user's new e-mail adress
  * @param {string} Birthday - user's new birthday
  * @returns {string} - returns success/error message
  * @requires authentication JWT
  */
app.put('/users/:id',
  passport.authenticate('jwt', { session: false }),
  [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let id = req.params.id;
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findByIdAndUpdate(id, {
      $set:
      {
        Username: req.body.Username,
        Password: hashedPassword,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }
    },
      { new: true },
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error: ' + err);
        } else {
          res.json(updatedUser);
        }
      });
  });

/**
* Delete movie from favorites
* @method DELETE
* @param {string} endpoint - endpoint to remove movies from favorites
* @param {string} id - userId
* @param {string} movieId - both are required
* @returns {string} - returns success/error message
* @requires authentication JWT
*/
app.delete('/users/:id/favorites/:movieId', passport.authenticate('jwt', { session: false }), (req, res) => {
  let id = req.params.id;
  Users.findByIdAndUpdate(id, {
    $pull:
    {
      FavoriteMovies: req.params.movieId
    }
  },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
});

/**
  * Delete user by id
  * @method DELETE
  * @param {string} endpoint - endpoint - delete user by id
  * @param {string} id - is used to delete specific user "url/users/:id"
  * @returns {string} success/error message
  * @requires authentication JWT
  */
app.delete('/users/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  let id = req.params.id;
  Users.findByIdAndRemove(id)
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.id + ' was not found');
      } else {
        res.status(200).send(req.params.id + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Houston, we have a problem!');
});

app.use(express.static('public'));

// listen for requests

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});
