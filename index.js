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

app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find().then(movies => res.json(movies));
});

app.get('/movies/:title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne( { Title: req.params['title']}).then(movie => res.json(movie));
});

app.get('/genres/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne( { 'Genre.Name': req.params['name']}).then(movie => res.json(movie['Genre']));
});

app.get('/directors/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne( { 'Director.Name': req.params['name']}).then(movie => res.json(movie['Director']));
});

app.post('/users',
[
  check('Username', 'Username is required').isLength({min: 5}),
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
      .then((user) =>{res.status(201).json(user) })
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

app.patch('/users/:id/favorites/:movieId', passport.authenticate('jwt', { session: false }), (req, res) => {
  let id = req.params.id;
  Users.findByIdAndUpdate( id , { $push:
    {
      FavoriteMovies: req.params.movieId
    }
  },
  { new: true },
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

app.put('/users/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  let id = req.params.id;
  Users.findByIdAndUpdate( id , { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true },
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

app.delete('/users/:id/favorites/:movieId', passport.authenticate('jwt', { session: false }), (req, res) => {
  let id = req.params.id;
  Users.findByIdAndUpdate( id , { $pull:
    {
      FavoriteMovies: req.params.movieId
    }
  },
  { new: true },
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

app.delete('/users/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  let id = req.params.id;
  Users.findByIdAndRemove( id )
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
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});
