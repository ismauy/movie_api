const express = require('express'),
morgan = require('morgan');
const app = express();

app.use(morgan('common'));


let genres = [
  {
    name: 'Fantasy',
    description: 'Fantasy is a genre of speculative fiction set in a fictional universe, often inspired by real-world myth and folklore. Its roots are in oral traditions, which then became fantasy literature and drama',
  },
  {
    name: 'Adventure',
    description: 'Adventure is a type of romance that usually presents danger, or gives the reader a sense of excitemen',
  },
  {
    name: 'Narrative',
    description: 'Narrative that tells a story, from the point of view of the narrator. There is generally a single event, or a sequence of connected events, with characters, setting, and plot.',
  },
  {
    name: 'Novel',
    description: 'Novel fiction, is a term used in the book-trade for fictional works written with the intent of fitting into a specific literary genre, in order to appeal to readers and fans already familiar with that genre',
  },
  {
    name: 'Terror',
    description: 'Terror is a genre of literature, film, and television that is meant to scare, startle, shock, and even repulse audiences',
  },
  {
    name: 'Drama',
    description: 'The drama genre features stories with high stakes and a lot of conflicts. They are plot-driven and demand that every character and scene move the story forward',
  },
  {
    name: 'Romance',
    description: 'Romance films are love stories, or affairs of the heart that center on passion, emotion, and the romantic, affectionate involvement of the main characters (usually a leading man and lady), and the journey that their love takes through courtship or marriage.',
  },
  {
    name: 'Mafia',
    description: 'Mafia films version of gangster films—are a subgenre of crime films dealing with organized crime, often specifically with Mafia organizations.',
  },
  {
    name: 'Crime',
    description: 'Crime fiction is the genre that fictionalises crimes, their detection, criminals and their motives.',
  },
  {
    name: 'Comedy',
    description: 'Comedy may be divided into multiple genres based on the source of humor, the method of delivery, and the context in which it is delivered.',
  },
  {
    name: 'Disaster',
    description: 'A disaster film or disaster movie is a film genre that has an impending or ongoing disaster as its subject and primary plot device.',
  },
  {
    name: 'Sport',
    description: 'A sports film is a film genre that uses sport as the theme of the film. It is a production in which a sport, sporting event, athlete, or follower of sport are prominently featured, and which depend on sport to a significant degree for their plot motivation or resolution.',
  },
  {
    name: 'Documentary',
    description: 'Documentary is a genre of movie making that uses video & film scenes, photographs and/or sound of real people and real events which when edited together creates a particular story, viewpoint, message or experience.',
  },
  {
    name: 'Thriller',
    description: 'Thriller is a genre of fiction, having numerous, often overlapping subgenres. Thrillers are characterized and defined by the moods they elicit, giving viewers heightened feelings of suspense, excitement, surprise, anticipation and anxiety.',
  }
];

let directors = [
  {
    name: 'Chris Columbus',
    bio: 'https://en.wikipedia.org/wiki/Chris_Columbus_(filmmaker)',
    birth: 1958,
    death: ,
  },
  {
    name: 'Peter Jackson',
    bio: 'https://en.wikipedia.org/wiki/Peter_Jackson',
    birth: 1961,
    death: ,
  },
  {
    name: 'Catherine Hardwicke',
    bio: 'https://en.wikipedia.org/wiki/Catherine_Hardwicke',
    birth: 1955,
    death: ,
  },
  {
    name: 'Francis Ford Coppola',
    bio: 'https://en.wikipedia.org/wiki/Francis_Ford_Coppola',
    birth: 1939,
    death: ,
  },
  {
    name: 'Robert Zemeckis',
    bio: 'https://en.wikipedia.org/wiki/Robert_Zemeckis',
    birth: 1951,
    death: ,
  },
  {
    name: 'James Cameron',
    bio: 'https://en.wikipedia.org/wiki/James_Cameron',
    birth: 1954,
    death: ,
  },
  {
    name: 'Juan Pablo Rebella',
    bio: 'https://en.wikipedia.org/wiki/Juan_Pablo_Rebella',
    birth: 1974,
    death: 2006,
  },
  {
    name: 'Andres Benvenutto',
    bio: 'https://www.imdb.com/name/nm10978880/?ref_=tt_ov_dr',
    birth: 1978,
    death: ,
  },
  {
    name: 'Quentin Tarantino',
    bio: 'https://en.wikipedia.org/wiki/Quentin_Tarantino',
    birth: 1963,
    death: ,
  },
  {
    name: 'Alan Parker',
    bio: 'https://en.wikipedia.org/wiki/Alan_Parker',
    birth: 1944,
    death: 2020,
  }
];

let movies = [
  {
    id: 1,
    title: 'Harry Potter and the Sorcerer\'s Stone',
    genre: ['Fantasy', 'Adventure', 'Narrative'],
    director: 'Chris Columbus',
  },
  {
    id: 2,
    title: 'Lord of the Rings',
    genre: ['Novel', 'Fiction', 'Adventure'],
    director: 'Peter Jackson',
  },
  {
    id: 3,
    title: 'Twilight',
    genre: ['Romance', 'Terror', 'Drama'],
    director: 'Catherine Hardwicke',
  },
  {
    id: 4,
    title: 'The Godfather',
    genre: ['Mafia', 'Drama', 'Crime'],
    director: { name: 'Francis Ford Coppola' },
  },
  {
    id: 5,
    title: 'Back to the future',
    genre: ['Comedy', 'Fantasy', 'Adventure'],
    director: { name: 'Robert Zemeckis' },
  },
  {
    id: 6,
    title: 'Titanic',
    genre: ['Romance', 'Disaster', 'Drama'],
    director: { name: 'James Cameron' },
  },
  {
    id: 7,
    title: 'Manyas',
    genre: ['Sport', 'Documentary', 'Narrative'],
    director: { name: 'Andres Benvenutto' },
  },
  {
    id: 8,
    title: '25 Watts',
    genre: ['Comedy', 'Drama', 'Narrative'],
    director: { name: 'Pablo Stoll' },
  },
  {
    id: 9,
    title: 'Pulp Fiction',
    genre: ['Mafia', 'Drama', 'Thriller'],
    director: { name: 'Quentin Tarantino' },
  },
  {
    id: 10,
    title: 'The Wall',
    genre: ['Narrative', 'Drama', 'Fantasy'],
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
  res.json(movies);
});

app.get('/movies/:title', (req, res) => {
  res.send('Successful GET movies by title');
});

app.get('/genres/:name', (req, res) => {
  res.send('Successful GET genre');
});

app.get('/directors/:name', (req, res) => {
  res.send('Successful GET director');
});

app.post('/users', (req, res) => {
  res.send('Successful POST user');
});

app.patch('/users/:id/favorites/:movieId', (req, res) => {
  res.send('Successful PATCH user favorite');
});

app.put('/users/:id', (req, res) => {
  res.send('Successful PUT user');
});

app.delete('/users/:id/favorites/:movieId', (req, res) => {
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
