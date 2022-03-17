"use strict";

var dayjs = require("dayjs");
var sqlite = require("sqlite3");
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

    const db = new sqlite.Database('lab2022-03-17/ex1/films.db', (err) => {
        if (err) throw(err);
    })

    this.dbGetAll = () => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM films';
            db.all(sql, (err, rows) => {
                if (err) reject(err);
                else resolve(rows.map((f) => new Film(f.id, f.title, f.favorite, f.watchdate, f.rating)))
            });
        });
    }

    this.dbGetFavorite = () => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM films WHERE favorite = 1';
            db.all(sql, (err, rows) => {
                if (err) reject(err);
                else resolve(rows.map((f) => new Film(f.id, f.title, f.favorite, f.watchdate, f.rating)))
            });
        });
    }

    this.dbGetWatchedToday = () => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM films WHERE watchdate = ?';
            db.all(sql, [dayjs().format('YYYY-MM-DD')], (err, rows) => {
                if (err) reject(err);
                else resolve(rows.map((f) => new Film(f.id, f.title, f.favorite, f.watchdate, f.rating)))
            });
        });
    }

    this.dbGetWatchedBeforeDate = (d) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM films WHERE watchdate < ?';
            db.all(sql, [dayjs(d).format('YYYY-MM-DD')], (err, rows) => {
                if (err) reject(err);
                else resolve(rows.map((f) => new Film(f.id, f.title, f.favorite, f.watchdate, f.rating)))
            });
        });
    }

    this.dbGetRatingFrom = (r) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM films WHERE rating >= ?';
            db.all(sql, [r], (err, rows) => {
                if (err) reject(err);
                else resolve(rows.map((f) => new Film(f.id, f.title, f.favorite, f.watchdate, f.rating)))
            });
        });
    }

    this.dbGetByTitle = (t) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM films WHERE title = ?';
            db.all(sql, [t], (err, rows) => {
                if (err) reject(err);
                else resolve(rows.map((f) => new Film(f.id, f.title, f.favorite, f.watchdate, f.rating)))
            });
        });
    }

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

function printFilm(f) {
    let date = (f.date) ? dayjs(f.date).format("LL") : '<not assigned>';
    console.log(`Id: ${f.id}, Title: ${f.title}, Favourite: ${f.fav}, Watch date: ${date}, Score: ${f.rating || '<not assigned>'}`);
}

function printFilms(films) {
    for(let f of films) { printFilm(f); }
}

async function main() {
    const fl = new FilmLibrary();
    const films = await fl.dbGetAll();
    const favs = await fl.dbGetFavorite();
    const todays = await fl.dbGetWatchedToday();
    const before = await fl.dbGetWatchedBeforeDate(new Date());
    const rates = await fl.dbGetRatingFrom(4);
    const titles = await fl.dbGetByTitle("Pulp Fiction");
    printFilms(films);
    console.log('=======')
    printFilms(favs);
    console.log('=======')
    printFilms(todays);
    console.log('=======')
    printFilms(before);
    console.log('=======')
    printFilms(rates);
    console.log('=======')
    printFilms(titles);
}

main();
// debugger;