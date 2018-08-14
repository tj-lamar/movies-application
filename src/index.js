// /**
//  * es6 modules and imports
//  */
// import sayHello from './hello';
// sayHello('World');

/**
 * require style imports
 */
const {getMovies, getMoviePoster} = require('./api.js');

const showMovies = () => {

    $('.loading-modal').show();

    let carouselOutput = '', carouselTicker = '', dropdownOutput = `<option selected>Select a movie...</option>`;

    $('.carousel-indicators').html(`<li data-target="#demo" data-slide-to="0" class="active"></li>`);
    $('.dropdown').html(`<option selected>Select a movie...</option>`);

    getMovies().then(res => {
        $('.carousel-inner').html(`<div class="carousel-item active"><img class="d-block w-80" id="movies-title" src="./movie-title-poster.png" alt=""></div>`);
        $('.loading-modal').hide();
        res.forEach(movie => {
            getMoviePoster(movie.title).then(res => {
                carouselTicker = '';
                carouselOutput = '';
                dropdownOutput = '';
                let posterURL = res.Search[0].Poster;

                // HTML containing info for each movie
                carouselOutput +=
                    `<div class="carousel-item">
                     <img class="d-block w-80" src="${posterURL}" alt="${movie.title}">
                     <div class="carousel-caption d-block" id="${movie.id}">
                     <button id="delete-btn-${movie.id}" type="button" class="btn delete-movie-btn d-flex justify-content-center">
                     <i class="fas fa-times fa-xs"></i></button>
                     <h5 class="movie-title">${movie.title}</h5>
                     ${countStars(movie.rating)}
                     </div></div>`;
                carouselTicker += `<li data-target="#demo" data-slide-to="${movie.id}"></li>`;

                // HTML for Edit Movie dropdown menu
                dropdownOutput += `<option value="${movie.id}">${movie.title}</option>`;
                $('.carousel-inner').append(carouselOutput);
                $('.carousel-indicators').append(carouselTicker);
                $('.dropdown').append(dropdownOutput);

                // Deletes movie
                $(`#delete-btn-${movie.id}`).click( () => {
                    let url = `/api/movies/${movie.id}`;
                    let options = {
                        method: 'DELETE'
                    };
                    let userConfirm = confirm(`Are you sure you wish to delete "${movie.title}"?`);
                        if (userConfirm) {
                            fetch(url, options)
                                .then(showMovies);
                        }
                });
            }).catch(e => console.log(e));
        });
    });
};


const countStars = rating => {
    let output = `<p class="stars">`;
    for (let i = 0; i < rating; i++) {
        output += `<i class="fas fa-star fa-md"></i>`;
    }
    output += `</p>`;
    return output;
};


$(document).ready(() => {

    // $('.carousel-inner').addClass('loading-modal');

    getMovies().then((movies) => {
        console.log('Here are all the movies:');
        movies.forEach(({title, rating, id}) => {
            console.log(`${id} - ${title} - rating: ${rating}`);
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
      let id = $('select > option:selected').val();
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
