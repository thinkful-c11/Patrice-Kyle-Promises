var getFromApi = function(endpoint, query={}) {
  const url = new URL(`https://api.spotify.com/v1/${endpoint}`);
  Object.keys(query).forEach(key => url.searchParams.append(key, query[key]));
  return fetch(url).then(function(response) {
    if (!response.ok) {
      return Promise.reject(response.statusText);
    }
    return response.json();
  });
};


var artist;
var getArtist = function(name) {
    // Edit me!
  const query = {
    q: name,
    limit: 1,
    type: 'artist'
  };
  return getFromApi('search',query).then(response=>{
    artist = response.artists.items[0];
    console.log(artist);
    return artist;
  }).catch(err=>{
    console.error(err);
  });
};
