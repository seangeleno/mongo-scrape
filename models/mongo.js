const MongoClient = require('mongodb').MongoClient;
const assert      = require('assert');

var url = 'mongodb://localhost:27017/scraper';
var db = null;
var collection = null;

MongoClient.connect(url, function(err, mongodb) {
  console.log("Connected successfully to mongodb");

  db = mongodb;
  collection = db.collection('data');

});

module.exports = collection;
