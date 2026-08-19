/* =========================================
   PAGE 2 - JAVASCRIPT
========================================= */


/* =========================================
   SECTION 01 - WELCOME
========================================= */

const startButton = document.getElementById("startButton");

const welcomeScreen = document.getElementById("welcomeScreen");
const partyScene = document.getElementById("partyScene");

startButton.addEventListener("click", function () {

    welcomeScreen.classList.remove("active");

    setTimeout(function () {
        partyScene.classList.add("active");
    }, 700);

});


/* =========================================
   SECTION 02 - CANDLES
========================================= */

const candles = document.querySelectorAll(".candle");

const candleInstruction =
    document.getElementById("candleInstruction");

const wishMessage =
    document.getElementById("wishMessage");

let candlesOut = 0;
let celebrationStarted = false;


candles.forEach(function (candle) {

    candle.addEventListener("click", function () {

        if (candle.classList.contains("extinguished")) {
            return;
        }

        candle.classList.add("extinguished");

        candlesOut++;

        if (candlesOut === candles.length) {

            startCelebration();

        }

    });

});


/* =========================================
   SECTION 03 - CELEBRATION
========================================= */

function startCelebration() {

    if (celebrationStarted) {
        return;
    }

    celebrationStarted = true;

    candleInstruction.style.opacity = "0";

    popBalloons();

    firePoppers();

    createConfetti();

    setTimeout(function () {

        wishMessage.classList.add("show");

    }, 700);

}


/* =========================================
   SECTION 04 - BALLOONS
========================================= */

const balloons =
    document.querySelectorAll(".balloon");


function popBalloons() {

    balloons.forEach(function (balloon, index) {

        setTimeout(function () {

            balloon.classList.add("popped");

        }, index * 100);

    });

}


/* =========================================
   SECTION 05 - PARTY POPPERS
========================================= */

const leftPopper =
    document.getElementById("leftPopper");

const rightPopper =
    document.getElementById("rightPopper");


function firePoppers() {

    leftPopper.classList.add("pop");

    setTimeout(function () {

        rightPopper.classList.add("pop");

    }, 180);

}


/* =========================================
   SECTION 06 - CONFETTI
========================================= */

function createConfetti() {

    const amount = 80;

    for (let i = 0; i < amount; i++) {

        const piece =
            document.createElement("div");

        piece.style.position = "fixed";
        piece.style.width = "8px";
        piece.style.height = "14px";

        piece.style.background =
            ["#ff8ba7", "#ffd166", "#ffffff", "#8ed1a8"][
                Math.floor(Math.random() * 4)
            ];

        piece.style.left =
            Math.random() * 100 + "%";

        piece.style.top = "-20px";

        piece.style.zIndex = "500";

        piece.style.transform =
            "rotate(" + Math.random() * 360 + "deg)";

        piece.style.transition =
            "top 2.5s ease, transform 2.5s ease, opacity 2.5s ease";

        document.body.appendChild(piece);

        setTimeout(function () {

            piece.style.top =
                (70 + Math.random() * 40) + "%";

            piece.style.transform =
                "rotate(" +
                (Math.random() * 1000) +
                "deg)";

            piece.style.opacity = "0";

        }, 50);

        setTimeout(function () {

            piece.remove();

        }, 3000);

    }

}


/* =========================================
   SECTION 07 - CAKE CLICK
========================================= */

const cake =
    document.getElementById("cake");

cake.addEventListener("click", function () {

    if (!celebrationStarted) {
        return;
    }

    cake.style.transform =
        "scale(1.15) rotate(-2deg)";

    createConfetti();

    setTimeout(function () {

        wishMessage.classList.remove("show");

        partyScene.classList.remove("active");

        setTimeout(function () {

            document
                .getElementById("letterScene")
                .classList.add("active");

        }, 800);

    }, 700);

});


/* =========================================
   SECTION 08 - LETTER
========================================= */

const letter =
    document.getElementById("letter");

const letterContent =
    document.getElementById("letterContent");

const closeLetter =
    document.getElementById("closeLetter");


letter.addEventListener("click", function () {

    letterContent.classList.add("open");

});


closeLetter.addEventListener("click", function (event) {

    event.stopPropagation();

    letterContent.classList.remove("open");

});


/* =========================================
   SECTION 09 - MOVE TO WINE
========================================= */

/*
   Clicking outside the letter after reading it
   moves to the wine scene.
*/

letterContent.addEventListener("click", function (event) {

    if (event.target === letterContent) {

        letterContent.classList.remove("open");

        setTimeout(function () {

            document
                .getElementById("letterScene")
                .classList.remove("active");

            document
                .getElementById("wineScene")
                .classList.add("active");

        }, 800);

    }

});


/* =========================================
   SECTION 10 - WINE
========================================= */

const wineBottle =
    document.getElementById("wineBottle");

const wineLiquid =
    document.getElementById("wineLiquid");

const wineGlassLiquid =
    document.getElementById("wineGlassLiquid");

const wineText =
    document.getElementById("wineText");

const wineFog =
    document.querySelector(".wine-fog");

const wineWorld =
    document.querySelector(".wine-world");

const finalWineMessage =
    document.getElementById("finalWineMessage");

const blackout =
    document.getElementById("blackout");


let wineClicks = 0;


const wineMessages = [

    "Tonight is yours… so let yourself feel every little moment. ❤️",

    "Some moments are meant to be remembered forever… ✨",

    "Close your eyes… and just let the moment take you somewhere beautiful. 🌙",

    "Because the best part of tonight… is still waiting for you. ❤️"

];


wineBottle.addEventListener("click", function () {

    if (wineClicks >= 5) {
        return;
    }

    wineClicks++;

    const remaining =
        85 - (wineClicks * 17);

    wineLiquid.style.height =
        Math.max(remaining, 0) + "%";

    wineGlassLiquid.style.height =
        Math.max(65 - (wineClicks * 13), 0) + "%";


    /* -----------------------------------------
       TEXT
    ----------------------------------------- */

    wineText.classList.add("fade");

    setTimeout(function () {

        if (wineClicks <= 4) {

            wineText.textContent =
                wineMessages[wineClicks - 1];

        }

        wineText.classList.remove("fade");

    }, 500);


    /* -----------------------------------------
       FOG
    ----------------------------------------- */

    if (wineClicks >= 2) {

        wineFog.classList.add("active");

    }


    /* -----------------------------------------
       SCREEN SWAY
    ----------------------------------------- */

    if (wineClicks >= 3) {

        wineWorld.style.animation =
            "screenSway 3s infinite ease-in-out";

    }


    /* -----------------------------------------
       FINAL CLICK
    ----------------------------------------- */

    if (wineClicks === 5) {

        finishWineScene();

    }

});


/* =========================================
   SECTION 11 - WINE ENDING
========================================= */

function finishWineScene() {

    wineText.classList.add("fade");

    wineFog.classList.add("active");

    setTimeout(function () {

        finalWineMessage.classList.add("show");

    }, 1800);


    setTimeout(function () {

        finalWineMessage.classList.remove("show");

    }, 5000);


    setTimeout(function () {

        blackout.classList.add("show");

    }, 6500);


    /*
       Page 3 connection will be added here.

       Example later:

       window.location.href = "page3.html";
    */

}


/* =========================================
   SECTION 12 - SCREEN SWAY
========================================= */

const dynamicStyle =
    document.createElement("style");

dynamicStyle.textContent = `

@keyframes screenSway {

    0% {
        transform: translateX(0) rotate(0deg);
    }

    25% {
        transform: translateX(-12px) rotate(-0.5deg);
    }

    50% {
        transform: translateX(12px) rotate(0.5deg);
    }

    75% {
        transform: translateX(-8px) rotate(-0.3deg);
    }

    100% {
        transform: translateX(0) rotate(0deg);
    }

}

`;

document.head.appendChild(dynamicStyle);
