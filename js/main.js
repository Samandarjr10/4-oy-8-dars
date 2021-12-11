// Dom element
var elFlex = document.querySelector("#d-flex");
var elForm = document.querySelector("#form_submit");
var elInput = document.querySelector("#input_rating");
var elSelectCategories = document.querySelector("#select_genre");
var elSelect2 = document.querySelector("#select2");
var elInput2 = document.querySelector("#input_title");
var elTitleMovies = document.querySelector("#search_heading");
var elList = document.querySelector("#list");

var elTempleteCard = document.querySelector("#templete-card-movies").content
var elTempleteBookmark = document.querySelector("#bookmark-templete").content
// console.log(templeteCard);

var twoMovies = movies.slice(0, 20);

var normolizeMovies = twoMovies.map((item, index) => {
    return {
        id: index,
        title: item.Title.toString(),
        categories: item.Categories,
        rating: item.imdb_rating,
        year: item.movie_year,
        imagelink: `http://i3.ytimg.com/vi/${item.ytid}/mqdefault.jpg`,
        ytlink: `https://www.youtube.com/watch?v=${item.ytid}`
    }
})

var renderCategories = (filmList, renderSelect) => {
    var resultCategoriList = [];

    filmList.forEach(item => {
        var splitCategories = item.categories.split("|");

        splitCategories.forEach(categoryItem => {
            var categoriesIncludes = resultCategoriList.includes(categoryItem);
            if (!categoriesIncludes) {
                resultCategoriList.push(categoryItem)       
            }
        })
    })
    resultCategoriList.sort();

    var elOptionSelect = document.createDocumentFragment();
    resultCategoriList.forEach(category => {
        var categoryOption = document.createElement("option");
        categoryOption.textContent = category;
        categoryOption.value = category;

        elOptionSelect.appendChild(categoryOption);
    })

    renderSelect.appendChild(elOptionSelect);
}
renderCategories(normolizeMovies, elSelectCategories);

function renderMovies(moviesArray) {
    var resultNewCreator = document.createDocumentFragment();

    moviesArray.forEach(films => {
        var movieCardTemp = elTempleteCard.cloneNode(true);

        movieCardTemp.querySelector("#img_card").src = films.imagelink;
        movieCardTemp.querySelector("#h4_title").textContent = films.title;
        movieCardTemp.querySelector("#year").textContent = films.year;
        movieCardTemp.querySelector("#rating").textContent = films.rating;
        movieCardTemp.querySelector("#ytlink").href = films.ytlink;
        movieCardTemp.querySelector("#bookmark").dataset.id = films.id;

        resultNewCreator.appendChild(movieCardTemp);
    });

    elFlex.innerHTML = null;  
    elFlex.appendChild(resultNewCreator);

    elTitleMovies.textContent = `Search results: ${moviesArray.length}`;

}
renderMovies(normolizeMovies, elFlex);

function renderBookmark(moviesListTemp) {
    var elLi = document.createDocumentFragment();

    moviesListTemp.forEach(item => {
        var newLi = elTempleteBookmark.cloneNode(true);

        newLi.querySelector("#bookmark-title").textContent = item.title;
        newLi.querySelector("#bookmark-remove").dataset.idJon = item.id;
        elLi.appendChild(newLi);
    })
    elList.innerHTML = null;
    elList.appendChild(elLi);
}


var findFilms = (title, minRating, janr) => {
    return normolizeMovies.filter(movie => {
        var doesMatchCategory = janr === "All" || movie.categories.includes(janr);

        return movie.title.match(title) && movie.rating >= minRating && doesMatchCategory;
    });
}


elForm.addEventListener("submit", (evt) => {
    evt.preventDefault();

    var searchInput = elInput2.value.trim();
    var searchInputRating = elInput.value.trim();
    var searchKey = new RegExp(searchInput, "gi");
    var categorySelect = elSelectCategories.value
    var resultFindMovies = findFilms(searchKey, searchInputRating, categorySelect);

    if (resultFindMovies.length > 0) {
        elFlex.innerHTML = null;
        renderMovies(resultFindMovies, elFlex);    
    }else {
        elFlex.innerHTML = "Kino yo'q"
        elTitleMovies.textContent = "0"
    }
})

var storage = window.localStorage;

var getBookmark = storage.getItem("bookmark");
var bookmarkArray = JSON.parse(getBookmark) || []
renderBookmark(bookmarkArray);

elFlex.addEventListener("click", (evt) => {
    var listId = evt.target.dataset.id;
    if (listId) {
        var findIdItem = normolizeMovies.find(item => {
            if (item.id == listId) {
                return item
            }
        });
        var resultIncluded = bookmarkArray.includes(findIdItem)
        if (!resultIncluded) {
            bookmarkArray.push(findIdItem)   
        }

        storage.setItem("bookmark", JSON.stringify(bookmarkArray))
    }
    renderBookmark(bookmarkArray)    
});

elList.addEventListener("click", (evt) => {
    var buttonId = evt.target.dataset.idJon
    
    if (buttonId) {
        var foundItem = bookmarkArray.findIndex(function (item) {
            if (item.id == buttonId) {
                return item
            }
        })
        
        bookmarkArray.splice(foundItem, 1)
        storage.setItem("bookmark", JSON.stringify(bookmarkArray))
        
        renderBookmark(bookmarkArray)     
    }
})

