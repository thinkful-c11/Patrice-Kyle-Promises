'use strict';
var getFromApi = function(endpoint, query={}) {
  const url = new URL(`https://api.spotify.com/v1/${endpoint}`);
  //appends the query keys and value to the end of the endpoint  (https://github.com/github/fetch/issues/256) website for how to do queries in fetch
  Object.keys(query).forEach(key => url.searchParams.append(key, query[key]));
  //return the response header grabbed from the spotify api
  return fetch(url).then(function(response) {
    //checks if the request header status was sent successfully
    //if it didn't, then return an error
    if (!response.ok) {
      return Promise.reject(response.statusText);
    }
    //if it was, then return the json from the api
    return response.json();
  });
};

//sort of a state variable (keep tracks of the current artist and related artists to current artist)
var artist;
var getArtist = function(name) {
    // Edit me!
  const query = {
    q: name,
    limit: 1,
    type: 'artist'
  };


//calling the getFromApi in order to get the json element returned from spotify api
  return getFromApi('search',query).then(response=>{
    //sets the global artist to the first item in the json element
    artist = response.artists.items[0];
    //console.log(artist);
    //returns the first item in the json element
    return artist;
  }).then(artist => {
      // use the artist object from the prev return to get the artist.id
      //fetch for related artist to our current artist
      // returns a response header
    return fetch(`https://api.spotify.com/v1/artists/${artist.id}/related-artists`);
  })
  .then(response => {
    //testing purposes
    //checks if the request header status was sent successfully
    //if it didn't, then return an error
    if (!response.ok) {
      return Promise.reject(response.statusText);
    }
    //So we don't get header response
    //if it was, then return the json from the api
    return response.json();
  }).then(response => {
    //setting the artist.related to the array of related artist
    artist.related = response.artists;
    //mapping each el to the related artist id and inputting it in the fetch url
    const relatedArtistsTopTracks = artist.related.map(el => {

      return fetch(`https://api.spotify.com/v1/artists/${el.id}/top-tracks?country=US`);
    });
    //runs the promise once all fetch requests are done
    //returns array of promises  
    return Promise.all(relatedArtistsTopTracks);
  }).then(arrStream=>{
  //converting each stream in the array to json (Promise)
  //streamToJson is an array of promises
    const streamToJson = arrStream.map(el=>{
      //console.log(el);
      return el.json();
    });
    //returns array of json objects
    return Promise.all(streamToJson);

  }).then(jsonResultsArr=>{
    //map the top tracks to its related artist
    jsonResultsArr.map((el,index) =>{
      return artist.related[index].tracks = el.tracks;
    });
    return artist;
  })
  .catch(err=> {
    console.error('hi',err);
  });
};
