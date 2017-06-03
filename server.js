
const express     = require("express");
const bodyParser 	= require("body-parser");
const exphbs 			= require("express-handlebars");

var app = express();

var PORT = process.env.PORT || 8080;

var db = require("./models/mongo.js");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type: "application/vnd.api+json"}));

app.use(express.static("./public"));

require("./controllers/routes.js")(app);

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.listen(PORT, function() {
	console.log("App.listening on PORT " + PORT);
});
