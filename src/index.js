// /**
//  * es6 modules and imports
//  */
// import sayHello from './hello';
// sayHello('World');

/**
 * require style imports
 */
const {getMovies} = require('./api.js');

const showMovies = () => {

    let bodyOutput = '', dropdownOutput = `<option selected>Select a movie...</option>`;
    getMovies().then(res => {
        res.forEach(movie => {
            bodyOutput += `<li>"${movie.title}"
  Rating: ${movie.rating}</li>`;
            dropdownOutput += `<option value="${movie.id}">${movie.title}</option>`
        });
        $('.movie-list').html(bodyOutput);
        $('.dropdown').html(dropdownOutput);
    });
};

$(document).ready(() => {

    $('.movie-list').html('Loading...');

    getMovies().then((movies) => {
        console.log('Here are all the movies:');
        movies.forEach(({title, rating, id}) => {
            console.log(`id#${id} - ${title} - rating: ${rating}`);
        });
    }).catch((error) => {
        alert('Oh no! Something went wrong.\nCheck the console for details.');
        console.log(error);
    });



    // Adds new movie
    $('#submit').click( () => {
        const newMovie = { title: $('#moviesInput').val(), rating: $('input:radio[name=ratingInput]:checked').val() };
        const url = '/api/movies';
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newMovie),
        };

        fetch(url, options)
            .then(showMovies)
            .then(() => console.log('SUCCESS'));
    });



    // Edits existing movie
    $('#editSubmit').click( () => {
      const id = $('select > option:selected').val();
        console.log(id);
        const editMovie = { title: $('#editMoviesInput').val(), rating: $('input:radio[name=editRatingInput]:checked').val() };
      let url = `/api/movies/${id}`;
        console.log(url);
        const options = {
          method: 'PATCH',
          headers: {
          'Content-Type': 'application/json',
          },
          body: JSON.stringify(editMovie)
      };

      fetch(url, options)
          .then(showMovies);

    });


    showMovies();

});
