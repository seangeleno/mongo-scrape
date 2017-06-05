const request = require("request");
const cheerio = require("cheerio");
const path = require('path');
const db = require('../models/mongo.js');
const ObjectID = require('mongodb').ObjectID;
const exphbs = require("express-handlebars");
const moment = require("moment");

var router = function(app) {

  app.get("/scrape/:target", function(req, res) {

    var insertedId = null;

    console.log('scrape hit.');

    var search = {
      target: req.params.target,
      titles: [],
      prices: [],
      favorite: false,
      createdAt: moment().calendar(),
      updatedAt: moment().calendar()
    }

    db.collection.insertOne(search, function(err, res) {
      if(err) console.log(err);
      insertedId = res.insertedId;
    });

    var url = "https://losangeles.craigslist.org/search/sss?query=" + search.target;

    request(url, function(error, response, html) {

      var $ = cheerio.load(html);

      $("ul.rows li.result-row p.result-info").each(function(i, element) {

        var title = $(this).children(".result-title").text();
        var price = $(this).children(".result-meta").children(".result-price").text().replace(/\$/g, '');

        db.collection.updateOne( { _id: ObjectID(insertedId) }, { $push: { titles: title } } );
        db.collection.updateOne( { _id: ObjectID(insertedId) }, { $push: { prices: parseFloat(price) } } );

      });
        res.redirect('/all');
    });
  }),

  app.get('/all', function(req, res) {

    db.collection.find({}).toArray(function( err, docs) {

      res.render('all', { records: docs });

    })
  }),

  app.post('/delete/:id', function(req, res) {

    db.collection.deleteOne( { _id: ObjectID(req.params.id) }, function(err, result) {

      if(result.result.ok === 1) {

        res.send(true);

      } else {
        res.send(false);
      };
    })
  }),

  app.post('/favorite/:id/:toggle', function(req, res) {

    var isFav = parseInt(req.params.toggle);

    db.collection.updateOne( { _id: ObjectID(req.params.id) }, { $set: { favorite: isFav } }, function(err, result) {

      if(result.result.ok === 1) {
        res.send(true);

      } else {
        res.send(false);
      };

    });
  })


}

module.exports = router;
