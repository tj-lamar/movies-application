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

    let output = '';
    getMovies().then(res => {
        res.forEach(movie => {
            output += `<li>"${movie.title}"
  Rating: ${movie.rating}</li>`;
        });
        $('.movie-list').html(output);
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



    $('#submit').click(e => {
        const newMovie = { title: $('#moviesInput').val(), rating: $('#ratingsInput').val() };
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


    showMovies();

});
