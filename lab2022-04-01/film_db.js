"use strict";

dayjs.extend(window.dayjs_plugin_localizedFormat);

function Film(id, title, fav, date, rating) {
    this.id = id;
    this.title = title;
    this.fav = fav || false;
    this.date = date || undefined;
    this.rating = rating || undefined;
}

function FilmLibrary() {
    this.filmLibrary = [];

    this.addNewFilm = (film) => {
        if(this.filmLibrary.some((f) => f.id === film.id)) 
            console.log("Film with same id already in list.");
        else this.filmLibrary.push(film);
    }

    this.sortByDate = () => {
        this.filmLibrary.sort((a, b) => {
            if(a.date === undefined) return 1;
            if(b.date === undefined) return -1;
            return dayjs(a.date).diff(dayjs(b.date));
        })
    }

    this.deleteFilm = (id) => {
        const index = this.filmLibrary.findIndex((o) => o.id === id);
        if(index !== -1) this.filmLibrary.splice(index, 1);
        else console.log(`Can't find Film with index ${id}`);
    }

    this.resetWatchedFilms = () => {
        this.filmLibrary = this.filmLibrary.map((f) => {
            f.date = undefined;
            return f
        })
    }

    this.getAll = () => this.filmLibrary;

    this.getBestRated = () => this.filmLibrary.filter((f) => f.rating == 5);

    this.getFavorites = () => this.filmLibrary.filter((f) => f.fav);

    this.getLastMonth = () => this.filmLibrary.filter((f) => f.date != undefined && dayjs().diff(f.date, 'month') <= 1);

    this.getRated = () => this.filmLibrary.filter((f) => f.rating !== undefined).sort((a, b) => a.rating - b.rating);
}

function populateFilmTable(film_list, fl) {
    const tb = document.getElementById("film-table").children[0];
    // this needed to delete all elements inside table body
    tb.textContent = '';
    for(const i of film_list()) {
        const tr = document.createElement('tr');
        tr.setAttribute('id', `film-id-${i.id}`);
        const check_str = (i.fav) ? "checked" : "";
        const check_class = (check_str == "") ? "" : 'class="fav-checked"';
        const display_date = (i.date == undefined) ? "" : dayjs(i.date).format('LL');
        tr.innerHTML = `<td ${check_class}>${i.title}</td>`;
        tr.innerHTML += `<td><div class="form-check"><input class="form-check-input" type="checkbox" value="" id="defaultCheck1" ${check_str}>
                        <label class="form-check-label" for="defaultCheck1">Favorite</label></div></td>`;
        tr.innerHTML += `<td>${display_date}</td>`;
        const td = document.createElement('td');
        for(let x = 0; x < i.rating; x++) { td.innerHTML += `<i class="bi bi-star-fill"></i>\n`; }
        for(let x = 0; x < 5 - i.rating; x++) { td.innerHTML += `<i class="bi bi-star"></i>\n`; }
        tr.appendChild(td);
        tr.innerHTML += `<td><button type="button" class="btn btn-danger del-button"><i class="bi bi-trash"></i></button></td>`;
        tb.appendChild(tr);
    }
    bindDelButtons(film_list, fl);
}

function bindDelButtons(film_list, fl) {
    const delButtons = document.getElementsByClassName("del-button");
    for(let b of delButtons) {
        b.addEventListener('click', (e) => {
            const id = b.parentNode.parentNode.id.split('-').pop();
            fl.deleteFilm(parseInt(id));
            populateFilmTable(film_list, fl);
        });
    }
}

function filter(name, f, fl) {
    const filter_title = document.getElementById("filter-title");
    filter_title.textContent = name;
    populateFilmTable(f, fl);
}

document.addEventListener("DOMContentLoaded", (event) => {
    const fl = new FilmLibrary();
    fl.addNewFilm(new Film(1, "Pulp Fiction", true, "2022-03-10", 5));
    fl.addNewFilm(new Film(2, "21 Grams", true, "2022-03-17", 4));
    fl.addNewFilm(new Film(3, "Star Wars", false));
    fl.addNewFilm(new Film(4, "Matrix", false));
    fl.addNewFilm(new Film(5, "Shrek", false, "2022-03-21", 3));
    fl.addNewFilm(new Film(6, "Inception", true, "2022-04-01", 5));

    populateFilmTable(fl.getAll, fl);

    const all_filter = document.getElementById("all-filter").children[0];
    const fav_filter = document.getElementById("fav-filter").children[0];
    const bestrate_filter = document.getElementById("bestrate-filter").children[0];
    const lastmonth_filter = document.getElementById("lastmonth-filter").children[0];

    let selected_filter = all_filter.parentNode;

    all_filter.addEventListener('click', (e) => {
        selected_filter.classList.remove("selected-filter");
        selected_filter = all_filter.parentNode;
        selected_filter.classList.add("selected-filter");
        filter("All", fl.getAll, fl);
        // it's a link, we need to prevent defaul behaviour
        e.preventDefault();
    });

    fav_filter.addEventListener('click', (e) => {
        selected_filter.classList.remove("selected-filter");
        selected_filter = fav_filter.parentNode;
        selected_filter.classList.add("selected-filter");
        filter("Favorites", fl.getFavorites, fl);
        // it's a link, we need to prevent defaul behaviour
        e.preventDefault();
    });

    bestrate_filter.addEventListener('click', (e) => {
        selected_filter.classList.remove("selected-filter");
        selected_filter = bestrate_filter.parentNode;
        selected_filter.classList.add("selected-filter");
        filter("Best Rated", fl.getBestRated, fl);
        // it's a link, we need to prevent defaul behaviour
        e.preventDefault();
    });

    lastmonth_filter.addEventListener('click', (e) => {
        selected_filter.classList.remove("selected-filter");
        selected_filter = lastmonth_filter.parentNode;
        selected_filter.classList.add("selected-filter");
        filter("Seen Last Month", fl.getLastMonth, fl);
        // it's a link, we need to prevent defaul behaviour
        e.preventDefault();
    });

});
