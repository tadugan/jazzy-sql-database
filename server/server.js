const express = require('express');
const pg = require('pg'); //
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('server/public'));

// setup pg
const Pool = pg.Pool;
const pool = new Pool({
    database: 'jazzy_sql',
    host: 'localhost',
    port: 5432,
    max: 10,
    idleTimeoutMillis: 30000
});

// debug/trouble shoot connections
pool.on('connect', () => {
    console.log('Postgresql connected.'); // logging that the Node Server is connected to the Postgresql Server
});

pool.on('error', () => {
    console.log('Error with Postgres pool.', error);
});

// start the server
app.listen(PORT, () => {
    console.log('listening on port', PORT)
});

// TODO - Replace static content with a database tables
// const artistList = [ 
//     {
//         name: 'Ella Fitzgerald',
//         birthdate: '04-25-1917'
//     },
//     {
//         name: 'Dave Brubeck',
//         birthdate: '12-06-1920'
//     },       
//     {
//         name: 'Miles Davis',
//         birthdate: '05-26-1926'
//     },
//     {
//         name: 'Esperanza Spalding',
//         birthdate: '10-18-1984'
//     },
// ]
// const songList = [
//     {
//         title: 'Take Five',
//         length: '5:24',
//         released: '1959-09-29'
//     },
//     {
//         title: 'So What',
//         length: '9:22',
//         released: '1959-08-17'
//     },
//     {
//         title: 'Black Gold',
//         length: '5:17',
//         released: '2012-02-01'
//     }
// ];

app.get('/artist', (req, res) => {
    console.log(`In /artist GET`);
    // connecting GET /artist to database
    let queryText = 'SELECT * FROM artist ORDER BY birthdate DESC;';

    pool.query(queryText)
    .then(result => {
        res.send(result.rows);
    })
    .catch(error => {
        console.log('Error:', error);
        res.sendStatus(500);
    });
});

app.post('/artist', (req, res) => {
    const newArtist = req.body;

    // create a SQL query to post new artist
    const queryText = `
    INSERT INTO artist (name, birthdate)
    VALUES ($1, $2)
    `;

    pool.query(queryText, [newArtist.name, newArtist.birthdate])
    .then(dbResponse => {
        res.sendStatus(201);
    }).catch(error => {
    console.log(error);
    res.sendStatus(500);
    });
});

app.get('/song', (req, res) => {
    console.log(`In /songs GET`);
    let queryText = 'SELECT * FROM song ORDER BY title;';

    pool.query(queryText)
    .then(result => {
        res.send(result.rows);
    })
    .catch(error => {
        console.log('Error:', error);
        res.sendStatus(500);
    });
});

app.post('/song', (req, res) => {
    const newSong = req.body;

    // create a SQL query to post new artist
    const queryText = `
    INSERT INTO song (title, length, released)
    VALUES ($1, $2, $3)
    `;

    pool.query(queryText, [newSong.title, newSong.length, newSong.released])
    .then(dbResponse => {
        res.sendStatus(201);
    }).catch(error => {
    console.log(error);
    res.sendStatus(500);
    });
});


