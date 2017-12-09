//Liri takes the following arguments
// * my-tweets
// * spotify-this-song
// * movie-this
// * do-what-it-says

var dataKeys = require("./keys.js");
var fs = require('fs'); //file system
var twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');


var writeToLog = function(data) {
  fs.appendFile("log.txt", '\r\n\r\n');

  fs.appendFile("log.txt", JSON.stringify(data), function(err) {
    if (err) {
      return console.log(err);
    }

    console.log("log.txt was updated!");
  });
}

//-----------------------------------------Spotify------------------------------------//

// Could not get code to work for Spotify, and subsequently Do What It Says. Previously
// returned a 404 error.

function spotifyThisSong(songName) {
  var songName = process.argv[3];
  if (!songName) {
    songName = "Sign";
  }
  params = songName;
  spotify.search({ type: "track", query: params }, function (err, data) {
    if (!err) {
      var songInfo = data.tracks.items;
      for (var i = 0; i < 5; i++) {
        if (songInfo[i] != undefined) {
          var spotifyResults =
            "Artist: " + songInfo[i].artists[0].name + "\r\n" +
            "Song: " + songInfo[i].name + "\r\n" +
            "Album: " + songInfo[i].album.name + "\r\n" +
            "Preview Url: " + songInfo[i].preview_url + "\r\n" +
            "------------------------------ " + i + " ------------------------------" + "\r\n";
          console.log(spotifyResults);
          log(spotifyResults); 
        }
      }
    } else {
      console.log("Error : " + err);
      return;
    }
  });
};

//-----------------------------------------Twitter------------------------------------//

var getTweets = function() {
  var client = new twitter(dataKeys.twitterKeys);

  var params = { screen_name: 'Nybor_A', count: 20 };

  client.get('statuses/user_timeline', params, function(error, tweets, response) {

    if (!error) {
      var data = []; //empty array to hold data
      for (var i = 0; i < tweets.length; i++) {
        data.push({
            'created at: ' : tweets[i].created_at,
            'Tweets: ' : tweets[i].text,
        });
      }
      console.log(data);
      writeToLog(data);
    }
  });
};

//-----------------------------------------MOVIE------------------------------------//
var getMeMovie = function(movieName) {

  if (movieName === undefined) {
    movieName = 'Mr Nobody';
  }

  var queryURL = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

  request(queryURL, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var data = [];
      var jsonData = JSON.parse(body);

      data.push({
      'Title: ' : jsonData.Title,
      'Year: ' : jsonData.Year,
      'Rated: ' : jsonData.Rated,
      'IMDB Rating: ' : jsonData.imdbRating,
      'Country: ' : jsonData.Country,
      'Language: ' : jsonData.Language,
      'Plot: ' : jsonData.Plot,
      'Actors: ' : jsonData.Actors,
      'Rotten Tomatoes Rating: ' : jsonData.tomatoRating,
      'Rotton Tomatoes URL: ' : jsonData.tomatoURL,
  });
      console.log(data);
      writeToLog(data);
}
  });

}

//-----------------------------------DO WHAT IT SAYS------------------------------------//


var doWhatItSays = function() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    console.log(data);
    writeToLog(data);
    var dataArr = data.split(',')

    if (dataArr.length == 2) {
      pick(dataArr[0], dataArr[1]);
    } else if (dataArr.length == 1) {
      pick(dataArr[0]);
    }

  });
}

var pick = function(caseData, functionData) {
  switch (caseData) {
    case 'my-tweets':
      getTweets();
      break;
    case 'spotify-this-song':
      spotifyThisSong(functionData);
      break;
    case 'movie-this':
      getMeMovie(functionData);
      break;
    case 'do-what-it-says':
      doWhatItSays();
      break;
    default:
      console.log('LIRI doesn\'t know that');
  }
}

var runThis = function(argOne, argTwo) {
  pick(argOne, argTwo);
};

runThis(process.argv[2], process.argv[3]);


