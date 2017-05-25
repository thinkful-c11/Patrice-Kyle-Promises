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
    //So we don't get header reponse
    //if it was, then return the json from the api
    return response.json();
  }).then(response => {
    artist.related = response.artists;
    return artist;
  })
  .catch(err=>{
    console.error('hi',err);
  });
};
