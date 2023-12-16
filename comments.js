// Create web server
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const errorhandler = require('errorhandler');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost:27017';
const dbName = 'edx-course-db';
const app = express();
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(errorhandler());
app.use(cors());
let db;
MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
  if (err) return process.exit(1);
  db = client.db(dbName);
  console.log(`Connected MongoDB: ${url}`);
  console.log(`Database: ${dbName}`);
});
app.get('/accounts', (req, res, next) => {
  db.collection('accounts')
    .find({}, { sort: { _id: -1 } })
    .toArray((err, accounts) => {
      if (err) return next(err);
      res.send(accounts);
    });
});
app.post('/accounts', (req, res, next) => {
  let newAccount = req.body;
  db.collection('accounts').insertOne(newAccount, (err, results) => {
    if (err) return next(err);
    res.send(results);
  });
});
app.put('/accounts/:id', (req, res, next) => {
  db.collection('accounts').updateOne(
    { _id: mongodb.ObjectID(req.params.id) },
    { $set: req.body },
    (err, results) => {
      if (err) return next(err);
      res.send(results);
    }
  );
});
app.delete('/accounts/:id', (req, res, next) => {
  db.collection('accounts').deleteOne(
    { _id: mongodb.ObjectID(req.params.id) },
    (err, results) => {
      if (err) return next(err);
      res.send(results);
    }
  );
});
app.listen(3000);