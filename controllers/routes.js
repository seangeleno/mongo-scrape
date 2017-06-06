const request = require("request");
const cheerio = require("cheerio");
const path = require('path');
const db = require('../models/mongo.js');
const ObjectID = require('mongodb').ObjectID;
const exphbs = require("express-handlebars");
const moment = require("moment");

var router = function(app) {

  app.get('/', function(req, res) {

    db.collection.find({}).toArray(function( err, docs) {
      res.render('all', { records: docs });
    })
  }),

  app.get('/favs', function(req, res) {

    db.collection.find({favorite: 1}).toArray(function( err, docs) {
      res.render('favs', { records: docs });
    })
  }),

  app.get("/link/:id/:index", function(req, res) {

    console.log(req.params.id);

    db.collection.find( { _id: ObjectID(req.params.id) }, { _id: 0, links: 1 } ).toArray( function(err, doc) {

      console.log(doc[0].links[req.params.index]);
      res.send(doc[0].links[req.params.index]);

    })

  }),


  app.post("/search", function(req, res) {

    var insertedId = null;
    var re = new RegExp("https:");

    console.log('scrape hit.');

    var search = {
      target: req.body.search,
      titles: [],
      prices: [],
      links: [],
      favorite: 0,
      createdAt: moment().calendar(),
      updatedAt: moment().calendar()
    }

    db.collection.insertOne(search, function(err, res) {
      if(err) console.log(err);
      insertedId = res.insertedId;
    });

    var baseUrl = "https://losangeles.craigslist.org";
    var searchUrl = "/search/sss?query=";

    request(baseUrl + searchUrl + search.target, function(error, response, html) {

      var $ = cheerio.load(html);

      $("ul.rows li.result-row p.result-info").each(function(i, element) {

        var title = $(this).children(".result-title").text();
        var price = $(this).children(".result-meta").children(".result-price").text().replace(/\$/g, '');
        var link = $(this).children("a").attr("href");

        if( re.test(link) === false ) link = baseUrl + link;

        db.collection.updateOne( { _id: ObjectID(insertedId) }, { $push: { titles: title } } );
        db.collection.updateOne( { _id: ObjectID(insertedId) }, { $push: { prices: parseFloat(price) } } );
        db.collection.updateOne( { _id: ObjectID(insertedId) }, { $push: { links: link } } );

      });

        res.redirect('/');

    });
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
