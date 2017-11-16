var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var keys = require("./keys.js");
var fs = require("fs");

var choice = process.argv[2];
var usrInput = "";
var client = new Twitter (keys.twitterKeys);
var spotify = new Spotify (keys.spotifyKeys);

if(process.argv[3]){
	for(var i = 3; i < process.argv.length; i++){
		usrInput += process.argv[i] + " ";
	}
}

function getTweets() {
	client.get("search/tweets", {q: "clarkage94", count: "20"}, function(error, tweets, response){
		if(error){
			console.log(error);
		}
		else {
			console.log("Here are my 20 most recent tweets:");
			console.log("------------------------------------");
			tweets.statuses.forEach(function (element){
				console.log(element.text);
				console.log(element.created_at);
				console.log("-----------------");
			});
		}
	});
}

function getSong(song) {
	if(!song){
		song = "The Sign";
	}
	spotify
		.search({ type: "track", query: song, limit: "1" })
		.then(function(response){
			response.tracks.items.forEach(function(element){
				console.log("Song Title: " + element.name);
				console.log("Album Title: " + element.album.name);
				console.log("Artist: " + element.album.artists[0].name);
				console.log("Preview URL: " + element.preview_url);
			});
		}) 
		.catch(function(error){
			console.log(error);
		});
}

function getMovie(movie) {
	if(!movie){
		movie = "Mr. Nobody"
	}
	var queryURL = "http://www.omdbapi.com/?t="+movie+"&apikey=40e9cece";
	request(queryURL, function(error, response, body){
		var mov = JSON.parse(body);
		console.log("Movie Title: "+mov.Title);
		console.log("Year Released: "+mov.Year);
		console.log("IMDB Rating: "+mov.imdbRating+"/10");
		console.log("Metacritic Rating: "+mov.Metascore+"/100");
		console.log("Produced in: "+mov.Country);
		console.log("Language: "+mov.Language);
		console.log("Plot: "+mov.Plot);
		console.log("Actors: "+mov.Actors);
	});
}

function doTheThing(choice, usrInput) {
	fs.readFile("./random.txt", "utf8", function (err, data){
		var arr = data.split(" ");
		choice = arr[0];
		for(var j = 1; j < arr.length; j++){
			usrInput += arr[j] + " ";
		}
		makeChoice(choice, usrInput);
	});

}

function makeChoice(choice, usrInput){
	switch (choice) {
		case "my-tweets":
			getTweets();
			break;
		case "spotify-this-song":
			getSong(usrInput);
			break;
		case "movie-this":
			getMovie(usrInput);
			break;
		case "do-what-it-says":
			doTheThing(choice, usrInput);
			break;
		default:
			console.log("Try entering one of the proper commands: my-tweets, spotify-this-song, movie-this, do-what-it-says");
			break;
	}
}

makeChoice(choice, usrInput);