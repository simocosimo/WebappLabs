"use strict";

const list = ["prova", "test", "it", "i", "cat", "color", "dog", "of", "cavallo"];

for(let s of list) {
    if(s.length < 2) console.log("");
    else console.log(s.slice(0, 2) + s.slice(-2));
}

//TODO: wirte some test functions