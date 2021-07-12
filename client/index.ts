import GameLoop from "./Core/GameLoop";
import Room from "./Scenes/Room";

document.addEventListener('readystatechange', event => {
    // When HTML/DOM elements are ready:
    if (event.target.readyState === "interactive") {   //does same as:  ..addEventListener("DOMContentLoaded"..
        //alert("hi 1");
    }

    // When window loaded ( external resources are loaded too- `css`,`src`, etc...)
    if (event.target.readyState === "complete") {
        const dungeonRoom = new Room();
        const game = new GameLoop([dungeonRoom]);

        game.start();
    }
});