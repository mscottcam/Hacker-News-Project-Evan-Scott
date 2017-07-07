'use strict';

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const { DATABASE, PORT } = require('./config');

let knex = require('knex')(DATABASE);

const app = express();

app.use(morgan(':method :url :res[location] :status'));

app.use(bodyParser.json());

// ADD ENDPOINTS HERE

let server;

app.get('/api/stories', (req, res) => {
  knex('news')
    .select('title', 'url', 'votes')
    .limit(20)
    .orderBy('votes', 'desc')
    .then(results => {
      res.status(200).json(results);
    });
});

// In postman: make sure to have appropriate body JSON being passed in -
//also set body type to raw - JSON (application(json))
app.post('/api/stories', jsonParser, (req, res) => {
  let story = req.body;
  knex('news')
    .insert({
      title: story.title,
      url: story.url,
      votes: story.votes
    })
    .then(() => res.status(201).json(story));
  // results => console.log(results)
});

app.put('/api/stories/:id', jsonParser, (req, res) => {
  knex('news')
    .where('id', req.params.id)
    .increment('votes', 1)
    .then(() => res.sendStatus(200));
});

function runServer(database = DATABASE, port = PORT) {
  return new Promise((resolve, reject) => {
    try {
      knex = require('knex')(database);
      server = app.listen(port, () => {
        console.info(`App listening on port ${server.address().port}`);
        resolve();
      });
    }
    catch (err) {
      console.error(`Can't start server: ${err}`);
      reject(err);
    }
  });
}

function closeServer() {
  return knex.destroy().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing servers');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer().catch(err => {
    console.error(`Can't start server: ${err}`);
    throw err;
  });
}

module.exports = { app, runServer, closeServer };
