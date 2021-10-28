const express = require('express'),
      morgan = require('morgan');
const app = express();

app.use(morgan('common'));


let topMovies = [
  {
    title: 'Harry Potter and the Sorcerer\'s Stone',
    genre: ['Fantasy', 'Adventure', 'Narrative'],
    director: { name: 'Chris Columbus' },
  },
  {
    title: 'Lord of the Rings',
    genre: ['Novel', 'Fiction', 'Adventure'],
    director: { name: 'Peter Jackson' },
  },
  {
    title: 'Twilight',
    genre: ['Romance', 'Terror', 'Drama'],
    director: { name: 'Catherine Hardwicke' },
  },
  {
    title: 'The Godfather',
    genre: ['Mafia', 'Drama', 'Crime'],
    director: { name: 'Francis Ford Coppola' },
  },
  {
    title: 'Back to the future',
    genre: ['Comedy', 'Science Fiction', 'Adventure'],
    director: { name: 'Robert Zeneckis' },
  },
  {
    title: 'Titanic',
    genre: ['Romance', 'Disaster', 'Drama'],
    director: { name: 'James Cameron' },
  },
  {
    title: 'Manyas',
    genre: ['Sport', 'Documental', 'Narrative'],
    director: { name: 'Andres Benvenutto' },
  },
  {
    title: '25 Watts',
    genre: ['Comedy', 'Drama', 'Narrative'],
    director: { name: 'Pablo Stoll' },
  },
  {
    title: 'Pulp Fiction',
    genre: ['Mafia', 'Drama', 'Thriller'],
    director: { name: 'Quentin Tarantino' },
  },
  {
    title: 'The Wall',
    genre: ['Musical', 'Drama', 'Animation'],
    director: { name: 'Alan Parker' },
  }
];


// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to myFlix app!');
});

app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

app.get('/movies/:title', (req, res) => {
  res.send('Successful GET movies by title');
});

app.get('/movies/:title/genre', (req, res) => {
  res.send('Successful GET movies by genre');
});

app.get('/movies/director/:name', (req, res) => {
  res.send('Successful GET movies by director');
});

app.post('/users', (req, res) => {
  res.send('Successful POST user');
});

app.post('/users/:id/favorites', (req, res) => {
  res.send('Successful POST user favorite');
});

app.put('/users/:id', (req, res) => {
  res.send('Successful PUT user');
});

app.delete('/users/:id/favorites/:title', (req, res) => {
  res.send('Successful DELETE user favorite movie');
});

app.delete('/users/:id', (req, res) => {
  res.send('Successful DELETE user');
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
