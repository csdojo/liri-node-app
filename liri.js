require("dotenv").config();

const request = require("request");


const moment = require("moment");


const action = process.argv[2];

const userTypein = process.argv[3];



//start concertThis 
const concertThis = userTypein => {
    if (!userTypein) {
        return console.log("Tell me your favorite band or artist!");
    }

    let queryUrl = "https://rest.bandsintown.com/artists/" + userTypein + "/events?app_id=0328bbef3952aeed7b59ec6b837dfc4a";


    request(queryUrl, function (error, response, body) {

        // If the request is successful (i.e. if the response status code is 200)
        if (!error && response.statusCode === 200) {

            // Parse the body of the site and recover just the imdbRating
            // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
            // const myArrStr = JSON.stringify(body);
            var content = JSON.parse(body);



            for (i = 0; i < content.length; i++) {

                var date = content[i].datetime;

                var formateDate = moment(date).format('MM/DD/YYYY');

                var formateTime = moment(date).format('LT');

                console.log(`
${content[i].lineup[0]}'s Concert Information:
Venue Name: ${content[i].venue.name}
Venue Location: ${content[i].venue.city}, ${content[i].venue.region}, ${content[i].venue.country}
Date of the Event: ${formateTime} ${formateDate}

`);
            }


        } else {
            console.log("error")
        }
    });
}
//end concertThis


//start spotify
const spotifyThisSong = (userTypein) => {
    // if (!userTypein) {
    //     return console.log("Tell me your favorite band or artist!");
    // }

    let Spotify = require('node-spotify-api');

    let spotify = new Spotify({
        id: "1ab83b2e45cf4cadad2bb1a31ffbe2ea",

        secret: "80606163554f4309b7d7308d6d33219a"
    });



    spotify.search({
        type: 'track',
        query: userTypein,
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred:' + err);
        }

        console.log(`
==================${data.tracks.items[0].name}==================

Artist(s): ${data.tracks.items[0].artists[0].name}
The song's name: ${data.tracks.items[0].name}
A preview link of the song from Spotify: ${data.tracks.items[0].href}
The album that the song is from: ${data.tracks.items[0].album.name}`);

    });
}

//end spotify




//start movieThis
const movieThis = userTypein => {
    if (!userTypein) {
        return console.log(
            `If you haven't watched "Mr. Nobody," then you should check: http://www.imdb.com/title/tt0485947/
It's on Netflix!`
        );
    }

    let queryUrl = "http://www.omdbapi.com/?t=" + userTypein + "&apikey=d78a4080";

    // Then run a request to the OMDB API with the movie specified
    request(queryUrl, function (error, response, body) {

        // If the request is successful (i.e. if the response status code is 200)
        if (!error && response.statusCode === 200) {

            // Parse the body of the site and recover just the imdbRating
            // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).

            console.log(`   
Title: ${JSON.parse(body).Title}
Year: ${JSON.parse(body).Year}
Rated: ${JSON.parse(body).Rated}
IMDB Rating: ${JSON.parse(body).imdbRating}
Country: ${JSON.parse(body).Country}
Language: ${JSON.parse(body).Language}
Plot: ${JSON.parse(body).Plot}
Actors: ${JSON.parse(body).Actors}
`);
        }
    });
}
//end movieThis

//begin do what it says
const doWhatItSays = () => {
    // Includes the FS package for reading and writing packages
    var fs = require("fs");

    // Running the readFile module that's inside of fs.
    // Stores the read information into the variable "data"
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            return console.log(err);
        }

        // Break the string down by comma separation and store the contents into the output array.
        var output = data.split(",");

        // Loop Through the newly created output array
        for (var i = 0; i < output.length; i++) {

            // Print each element (item) of the array/
            var str = output[i];

            var song = output[i + 1];

            var movie = output[i + 1];

            var artist = output[i + 1];


            if (str.includes("spotify")) {
                spotifyThisSong(song);
            } if (str.includes("concert")) {
                concertThis(artist);
            } if (str.includes("movie")){
                movieThis(movie);
            }

        }
    });
}

//end do what it says


switch (action) {
    case "concert-this":
        concertThis(userTypein);
        break;
    case "spotify-this-song":
        spotifyThisSong(userTypein);
        break;
    case "movie-this":
        movieThis(userTypein);
        break;
    case "do-what-it-says":
        doWhatItSays(userTypein);
        break;
    default:
        return console.log("Please type in concert-this or spotify-this-song or movie-this or do-what-it-says!")
}