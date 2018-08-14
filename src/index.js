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

    let carouselOutput = '', carouselTicker = '', dropdownOutput = `<option selected>Select a movie...</option>`;

    $('.carousel-inner').html(`<div class="carousel-item active">
                                <div style="background-color: black; width: 1100px; height: 500px"></div>
                                </div>`);
    $('.carousel-indicators').html(`<li data-target="#demo" data-slide-to="0" class="active"></li>`);
    $('.dropdown').html(`<option selected>Select a movie...</option>`);

    getMovies().then(res => {
        res.forEach(movie => {
            getMoviePoster(movie.title).then(res => {
                carouselTicker = '';
                carouselOutput = '';
                dropdownOutput = '';
                let posterURL = res.Search[0].Poster;
  //                     carouselOutput += `<li>"${movie.title}"
  // Rating: ${movie.rating}</li>`;
  //               carouselOutput += `<li><img class="d-block w-100" src="${posterURL}" alt="${movie.title}"></li>`;
                carouselOutput +=
                    `<div class="carousel-item">
                     <img class="d-block w-80" src="${posterURL}" alt="${movie.title}">
                     <div class="carousel-caption d-block">
                     <h5 class="movie-title">${movie.title}</h5>
                     ${countStars(movie.rating)}
                     </div></div>`;
                carouselTicker += `<li data-target="#demo" data-slide-to="${movie.id}"></li>`;
                dropdownOutput += `<option value="${movie.id}">${movie.title}</option>`;
                $('.carousel-inner').append(carouselOutput);
                $('.carousel-indicators').append(carouselTicker);
                $('.dropdown').append(dropdownOutput);
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

    $('.carousel-inner').text('Loading...');

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
