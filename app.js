const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongo = require('mongodb');
const mongoClient = mongo.MongoClient;
const mongoURL = "mongodb://127.0.0.1:27017/Tutorial";
const port = 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/heartbeat', (req, res) => res.status(200).send('success'));

app.get('/', (req, res) => {
  mongoClient.connect(mongoURL, async (error, db) => {
    if (!error) {
      const results = await db.collection('tasks').find({}).toArray();
      res.status(200).send(JSON.stringify(results));
    } else res.status(500).send(`<h1>${error}</h1>`);
  });
});

app.get('/:url', (req, res) => {
  mongoClient.connect(mongoURL, async (error, db) => {
    if (!error) {
      const results = await db.collection('tasks').find({ url: req.params.url }).toArray();
      res.status(200).send(JSON.stringify(results));
    } else res.status(500).send(`<h1>${error}</h1>`);
  });
});

app.post('/:url', (req, res) => {
  const { url } = req.params;
  const { description } = req.body;
  mongoClient.connect(mongoURL, (error, db) => {
    if (!error) {
      db.createCollection('tasks', async (error, data) => {
        if (error) res.status(500).send(`<h1>${error}</h1>`)
        else {
          const resultArray = await db.collection('tasks')
            .find({ url })
            .toArray();
          if (resultArray.length) {
            db.collection('tasks').replaceOne({ url }, { url, description });
            return res.status(200).send('success');
          }
          data.insert({ description, url });
          return res.status(200).send('success');
        }
      });
    } else res.status(500).send(`<h1>${error}</h1>`);
  });
});

app.delete('/:url', (req, res) => {
  mongoClient.connect(mongoURL, (error, db) => {
    if (!error) {
      db.collection('tasks').remove({ url: req.params.url });
      res.status(200).send('removed');
    } else res.status(500).send(`<h1>${error}</h1>`);
  });
});

app.listen(port, (err) => {
  if (err) return console.error(`Server is not getting up :`, err);
  return console.log(
    `Server up and running on http://localhost:${port} 😎`,
  );
});
