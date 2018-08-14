module.exports = {
  getMovies: () => {
    return fetch('/api/movies')
      .then(response => response.json());
  },
  getMoviePoster: (a) => {
      let title = a.split(" ").join("+");
      return fetch('http://www.omdbapi.com/?s=' + title + "&apikey=fc8b1f13&")
          .then(response => response.json());
  }
};
