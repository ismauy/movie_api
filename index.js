const express = require('express'),
      morgan = require('morgan');
const app = express();

app.use(morgan('common'));


let topMovies = [
  {
    title: 'Harry Potter and the Sorcerer\'s Stone',
  },
  {
    title: 'Lord of the Rings',
  },
  {
    title: 'Twilight',
  },
  {
    title: 'The Godfather',
  },
  {
    title: 'Back to the future',
  },
  {
    title: 'Titanic',
  },
  {
    title: 'Manyas',
  },
  {
    title: '25 Watts',
  },
  {
    title: 'Pulp Fiction',
  },
  {
    title: 'The Wall',
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

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Houston, we have a problem!');
});


// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
