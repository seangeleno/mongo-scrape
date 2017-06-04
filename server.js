
const express = require("express");
const bodyParser = require("body-parser");
const handlebars = require('handlebars');
const exphbs = require("express-handlebars");
const mongo = require("./models/mongo.js");

var app = express();

var PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type: "application/vnd.api+json"}));

app.use(express.static("./public"));

require("./controllers/routes.js")(app);

app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  helpers: {
    safeString : function(arr) {
      return JSON.stringify(arr);
    }
  }
}));

app.set("view engine", "handlebars");

mongo.connect(function () {

	app.listen(PORT, function() {
		console.log("App.listening on PORT " + PORT);
	});

});
