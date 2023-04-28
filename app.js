const movies = [];
let tempMovies = []
const getDataFromDatabase = async () => { 
    console.log('FETCHING MOVIES');
    try {
        const data = await fetch('https://movie-app-b6821-default-rtdb.asia-southeast1.firebasedatabase.app/movies.json')
        // console.log(data.body);
        const dmovies = await data.json();
       tempMovies = [];
        for (const movie in dmovies) {
            // console.log(movie);
            tempMovies.push({ id: movie, title: dmovies[movie].title, image: dmovies[movie].image, rating: dmovies[movie].rating })

            renderNewMovieElement(movie, dmovies[movie].title, dmovies[movie].image, dmovies[movie].rating);

            if (tempMovies.length === 0) {
                entryTextSection.style.display = 'block';
            } else {
                entryTextSection.style.display = 'none';
            }
        }
        movies = tempMovies;
        console.log(movies);
        // console.log(dmovies);
    } catch (error) {
        console.log(error);
    }
}


const addMovieModal = document.getElementById('add-modal');
// const addMovieModal = document.querySelector('#add-modal');
// const addMovieModal = document.body.children[1];


const storeMovietoDatabase = async (movie) => {
    try {
        await fetch('https://movie-app-b6821-default-rtdb.asia-southeast1.firebasedatabase.app/movies.json', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(movie)
        });
    } catch (error) {
        console.log(error);
    }
}
const clearMovietoDatabase = async (id) => {
console.log(id);
    try {
        await fetch(`https://movie-app-b6821-default-rtdb.asia-southeast1.firebasedatabase.app/movies/${id}.json`, {
            
            method: 'DELETE',
            // body: JSON.stringify(id)

        });
        const index = tempMovies.findIndex(movie => movie.id === id);
        tempMovies.splice(index,1);
        if (tempMovies.length === 0) {
            entryTextSection.style.display = 'block';
        } else {
            entryTextSection.style.display = 'none';
        }
    } catch (error) {
        console.log(error);
    }

    document.getElementById(id).remove();
    

}



const startAddMovieButton = document.querySelector('header button')
// const startAddMovieButton = document.querySelector('header').lastElementChild;



// const backdrop = document.body.firstElementChild;
const backdrop = document.getElementById('backdrop');
const cancelAddMovieButton = addMovieModal.querySelector('.btn--passive');
const confirmAddMovieButton = cancelAddMovieButton.nextElementSibling;
const userInputs = addMovieModal.querySelectorAll('input');
const entryTextSection = document.getElementById('entry-text');
const deleteMovieModal = document.getElementById('delete-modal');


const updateUI = () => {
    if (movies.length === 0) {
        entryTextSection.style.display = 'block';
    } else {
        entryTextSection.style.display = 'none';
    }

};

const toggleBackdrop = () => {
    backdrop.classList.toggle('visible');

};

const clearMovieInput = () => {
    for (const usrInput of userInputs) {
        usrInput.value = '';
    }
};

const closeMovieDeletionModal = () => {
    toggleBackdrop();
    deleteMovieModal.classList.remove('visible');
};

const deleteMovieHandler = async (movieId) => {
    // let movieIndex = 0;
    // for (const movie of movies) {
    //     if (movie.id === movieId) {
    //         break;
    //     }
    //     movieIndex++;
    // }
    await clearMovietoDatabase(movieId);
    // movies.splice(movieIndex, 1);
    // const listRoot = document.getElementById('movie-list');
    // listRoot.children[movieIndex].remove();
    // listRoot.removeChild(listRoot.children[movieIndex]);
    closeMovieDeletionModal();
    // updateUI();
    console.log(movieId);
    


};


const startDeleteMovieHandler = (movieId) => {

    deleteMovieModal.classList.add('visible');
    toggleBackdrop();
    const cancelDeletionButton = deleteMovieModal.querySelector('.btn--passive');
    let confirmDeletionButton = deleteMovieModal.querySelector('.btn--danger')

    confirmDeletionButton.replaceWith(confirmDeletionButton.cloneNode(true));

    confirmDeletionButton = deleteMovieModal.querySelector('.btn--danger')
    //    confirmDeletionButton.removeEventListener('click', deleteMovieHandler.bind(null,movieId));
    cancelDeletionButton.removeEventListener('click', closeMovieDeletionModal);


    cancelDeletionButton.addEventListener('click', closeMovieDeletionModal);
    confirmDeletionButton.addEventListener('click', deleteMovieHandler.bind(null, movieId));





    // deletemovie(movieId);
};

const renderNewMovieElement = (id, title, imageUrl, rating) => {

    const newMovieElement = document.createElement('li');
    newMovieElement.className = 'movie-element';
    newMovieElement.id = id;
    newMovieElement.innerHTML = `

    <div class = "movie-element__image">
    <img src="${imageUrl}" alt="${title}">
     </div>
     <div class="movie-element__info">
     <h2>${title}</h2>
     <p>${rating}/5 star</p>
     </div>

    `;
    newMovieElement.addEventListener('click', startDeleteMovieHandler.bind(null, id))

    const listRoot = document.getElementById('movie-list');
    listRoot.append(newMovieElement);

}

const closeMovieModal = () => {
    addMovieModal.classList.remove('visible');
}




const showMovieModal = () => {
    addMovieModal.classList.add('visible');
    console.log('Opening Modal for movie');

    toggleBackdrop();
    console.log(movies);

};

const backdropClickHandler = () => {
    closeMovieModal();
    closeMovieDeletionModal();
    clearMovieInput();
};

const cancelAddMovieHandler = () => {
    closeMovieModal();
    toggleBackdrop();
    clearMovieInput();

}

const addMovieHandler = () => {

    const titleValue = userInputs[0].value;
    const imageUrlValue = userInputs[1].value;
    const ratingValue = userInputs[2].value;



    if (
        titleValue.trim() === '' ||
        imageUrlValue.trim() === '' ||
        ratingValue.trim() === '' ||
        +ratingValue < 1 ||
        +ratingValue > 5
    ) {
        alert("plaease enter valid values (rating between 1 and 5)");
    }

    const newMovie = {
        id: Math.random().toString(),
        title: titleValue,
        image: imageUrlValue,
        rating: ratingValue
    };

    movies.push(newMovie);

    storeMovietoDatabase(newMovie);

    //glti se hagg dia

    //yes

    closeMovieModal();
    toggleBackdrop();
    clearMovieInput();
    renderNewMovieElement(newMovie.id, newMovie.title, newMovie.image, newMovie.rating);
    updateUI();
}


startAddMovieButton.addEventListener('click', showMovieModal);
backdrop.addEventListener('click', backdropClickHandler);
cancelAddMovieButton.addEventListener('click', cancelAddMovieHandler);
confirmAddMovieButton.addEventListener('click', addMovieHandler);

