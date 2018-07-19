// /**
//  * es6 modules and imports
//  */
// import sayHello from './hello';
// sayHello('World');

/**
 * require style imports
 */
const {getMovies} = require('./api.js');
const $ = require('jquery');

getMovies().then((movies) => {
  console.log('Here are all the movies:');
  movies.forEach(({title, rating, id}) => {
    console.log(`id#${id} - ${title} - rating: ${rating}`);
  });
}).catch((error) => {
  alert('Oh no! Something went wrong.\nCheck the console for details.');
  console.log(error);
});

$(document).ready(() => {

  $('.movie-list').html('Loading...');

  let output = '';
  getMovies().then(res => {
    res.forEach(movie => {
      output += `<li>"${movie.title}"
      Rating: ${movie.rating}</li>`
    });
     $('.movie-list').html(output);
  });

});