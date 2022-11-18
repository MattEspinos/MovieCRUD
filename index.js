const express = require('express')
app = express()

var url = require('url');
var dt = require('./date-time');

const port = process.env.PORT || 3000
const majorVersion = 1
const minorVersion = 2

// Use Express to publish static HTML, CSS, and JavaScript files that run in the browser. 
app.use(express.static(__dirname + '/static'))

// The app.get functions below are being processed in Node.js running on the server.
// Implement a custom About page.
app.get('/about', (request, response) => {
	console.log('Calling "/about" on the Node.js server.')
	response.type('text/plain')
	response.send('About Node.js on Azure Template.')
})

app.get('/version', (request, response) => {
	console.log('Calling "/version" on the Node.js server.')
	response.type('text/plain')
	response.send('Version: '+majorVersion+'.'+minorVersion)
})

//-------------------- START MOVIECRUD Atlas ---------------------
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const mongoose = require("mongoose");

const mongooseUri = "mongodb+srv://MovieCRUDUser:qT4K51qL4qU2Zyow@cluster0.ytl8cvm.mongodb.net/movieDatabase"
mongoose.connect(mongooseUri, {useNewUrlParser: true}, {useUnifiedTopology: true})
const movieSchema = {
	title: String,
	comments: String
}
const Movie = mongoose.model("movie", movieSchema);

//-------------------- CREATE MOVIECRUD from create.html ---------------------
app.post("/create", function(req, res){
	let newMovie = new Movie({
		title: req.body.title,
		comments: req.body.comments
	})

	newMovie.save();
	res.redirect("/");
})

const renderMovie = (movieArray) => {
	let text = "Movie Collection:\n\n";
	movieArray.forEach((movie) => {
		text += "Title: " + movie.title + "\n";
		text += "Comments: " + movie.comments + "\n";
		text += "ID: " + movie._id + "\n\n";
	})
	text += "Total Count: " + movieArray.length;
	return text
}

//-------------------- READ MOVIECRUD ---------------------
app.get("/read", function(request, response){
	Movie.find({}).then(movie => {
		response.type('text/plain');
		response.send(renderMovie(movie));
	})
})

// Custom 404 page.
app.use((request, response) => {
  response.type('text/plain')
  response.status(404)
  response.send('404 - Not Found')
})

// Custom 500 page.
app.use((err, request, response, next) => {
  console.error(err.message)
  response.type('text/plain')
  response.status(500)
  response.send('500 - Server Error')
})

app.listen(port, () => console.log(
  `Express started at \"http://localhost:${port}\"\n` +
  `press Ctrl-C to terminate.`)
)
