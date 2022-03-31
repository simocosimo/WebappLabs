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

    this.getRated = () => this.filmLibrary.filter((f) => f.rating !== undefined).sort((a, b) => a.rating - b.rating);
}

document.addEventListener("DOMContentLoaded", (event) => {
    const fl = new FilmLibrary();
    fl.addNewFilm(new Film(1, "Pulp Fiction", true, "2022-03-10", 5));
    fl.addNewFilm(new Film(2, "21 Grams", true, "2022-03-17", 4));
    fl.addNewFilm(new Film(3, "Star Wars", false));
    fl.addNewFilm(new Film(4, "Matrix", false));
    fl.addNewFilm(new Film(5, "Shrek", false, "2022-03-21", 3));
    fl.addNewFilm(new Film(6, "Inception", true, "2022-04-01", 5));

    const tb = document.getElementById("film-table").children[0];
    for(const i of fl.filmLibrary) {
        const tr = document.createElement('tr');
        const check_str = (i.fav) ? "checked" : "";
        const check_class = (check_str == "") ? "" : 'class="fav-checked"';
        const display_date = (i.date == undefined) ? "" : dayjs(i.date).format('LL');
        tr.innerHTML = `<td ${check_class}>${i.title}</td>`;
        tr.innerHTML += `<td><div class="form-check"><input class="form-check-input" type="checkbox" value="" id="defaultCheck1" ${check_str}>
                        <label class="form-check-label" for="defaultCheck1">Favorite</label></div></td>`;
        tr.innerHTML += `<td>${display_date}</td>`;
        const td = document.createElement('td');
        for(let x = 0; x < i.rating; x++) { 
            //if(x == 0) tr.innerHTML += `<td>`;
            td.innerHTML += `<i class="bi bi-star-fill"></i>\n`; 
        }
        for(let x = 0; x < 5 - i.rating; x++) { 
            td.innerHTML += `<i class="bi bi-star"></i>\n`; 
            //if(x == 4 - i.rating) tr.innerHTML += `</td>`;
        }
        tr.appendChild(td);
        tb.appendChild(tr);
    }
});
