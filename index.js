const mongoose = require('mongoose');
const Models = require('./models.js');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(morgan('common'));


// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to myFlix app!');
});

app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});

app.get('/movies', (req, res) => {
  Movies.find().then(movies => res.json(movies));
});

app.get('/movies/:title', (req, res) => {
  Movies.findOne( { Title: req.params['title']}).then(movie => res.json(movie));
});

app.get('/genres/:name', (req, res) => {
  Movies.findOne( { 'Genre.Name': req.params['name']}).then(movie => res.json(movie['Genre']));
});

app.get('/directors/:name', (req, res) => {
  Movies.findOne( { 'Director.Name': req.params['name']}).then(movie => res.json(movie['Director']));
});

app.post('/users', (req, res) => {
  Users.findOne({ User: req.body.User })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.User + 'already exists');
      } else {
        Users
          .create({
            User: req.body.User,
            Password: req.body.Password,
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

app.patch('/users/:id/favorites/:movieId', (req, res) => {
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

app.put('/users/:id', (req, res) => {
  let id = req.params.id;
  Users.findByIdAndUpdate( id , { $set:
      {
        User: req.body.User,
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

app.delete('/users/:id/favorites/:movieId', (req, res) => {
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

app.delete('/users/:id', (req, res) => {
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
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
