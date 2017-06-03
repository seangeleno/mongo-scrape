const request     = require("request");
const cheerio     = require("cheerio");
const path        = require('path');

const db = require('../models/mongo.js');


var router = function(app) {

  app.get("/scrape", function(req, res) {

    console.log('scrape hit.');

    request("https://losangeles.craigslist.org/search/mca?query=honda+xr", function(error, response, html) {

      var $ = cheerio.load(html);

      var result = [];

      $("ul.rows li a span.result-price").each(function(i, element) {

        var price = $(this).text().replace(/\$/g, '');


        result.push( parseFloat(price) );

      });

          res.send(result);

    });


  });

}

module.exports = router;
