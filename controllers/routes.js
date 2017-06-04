const request     = require("request");
const cheerio     = require("cheerio");
const path        = require('path');
const db          = require('../models/mongo.js');
const ObjectID    = require('mongodb').ObjectID;

var router = function(app) {

  app.get("/scrape/:target", function(req, res) {

    var insertedId = null;

    console.log('scrape hit.');

    var search = {
      target: req.params.target,
      title: [],
      price: [],
      createdAt: Date.now()
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

        db.collection.updateOne( { _id: ObjectID(insertedId) }, { $push: { title: title } } );
        db.collection.updateOne( { _id: ObjectID(insertedId) }, { $push: { price: parseFloat(price) } } );

      });




          res.send('ok');

    });


  });

}

module.exports = router;
