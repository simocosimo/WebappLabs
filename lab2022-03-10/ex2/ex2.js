"use strict";

var dayjs = require("dayjs");
var localizedFormat = require('dayjs/plugin/localizedFormat');
dayjs.extend(localizedFormat);

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

const fl = new FilmLibrary();
fl.addNewFilm(new Film(1, "Pulp Fiction", true, "2022-03-10", 5));
fl.addNewFilm(new Film(2, "21 Grams", true, "2022-03-17", 4));
fl.addNewFilm(new Film(3, "Star Wars", false));
fl.addNewFilm(new Film(4, "Matrix", false));
fl.addNewFilm(new Film(5, "Shrek", false, "2022-03-21", 3));

for(let f of fl.filmLibrary) {
    let date = (f.date) ? dayjs(f.date).format("LL") : '<not assigned>';
    console.log(`Id: ${f.id}, Title: ${f.title}, Favourite: ${f.fav}, Watch date: ${date}, Score: ${f.rating || '<not assigned>'}`);
}

console.log("deleted and sorted list");
fl.sortByDate();
fl.deleteFilm(2);
for(let f of fl.filmLibrary) {
    let date = (f.date) ? dayjs(f.date).format("LL") : '<not assigned>';
    console.log(`Id: ${f.id}, Title: ${f.title}, Favourite: ${f.fav}, Watch date: ${date}, Score: ${f.rating || '<not assigned>'}`);
}

console.log("Rated and sorted list");
for(let f of fl.getRated()) {
    let date = (f.date) ? dayjs(f.date).format("LL") : '<not assigned>';
    console.log(`Id: ${f.id}, Title: ${f.title}, Favourite: ${f.fav}, Watch date: ${date}, Score: ${f.rating || '<not assigned>'}`);
}

console.log("Resetted list");
fl.resetWatchedFilms();
for(let f of fl.filmLibrary) {
    let date = (f.date) ? dayjs(f.date).format("LL") : '<not assigned>';
    console.log(`Id: ${f.id}, Title: ${f.title}, Favourite: ${f.fav}, Watch date: ${date}, Score: ${f.rating || '<not assigned>'}`);
}

debugger;