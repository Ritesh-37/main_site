/* =====================================================
   PAGE 2 — ANDROID FRIENDLY JAVASCRIPT
===================================================== */

"use strict";


/* =====================================================
   HELPER
===================================================== */

function showScene(scene) {

    document
        .querySelectorAll(".scene")
        .forEach(function (item) {

            item.classList.remove("active");

        });

    scene.classList.add("active");
}


/* =====================================================
   SECTION 1 — WELCOME
===================================================== */

const startButton =
    document.getElementById("startButton");

const welcomeScene =
    document.getElementById("welcomeScene");

const partyScene =
    document.getElementById("partyScene");


startButton.addEventListener(
    "pointerup",
    function () {

        showScene(partyScene);

    }
);


/* =====================================================
   SECTION 2 — CANDLES
===================================================== */

const candles =
    document.querySelectorAll(".candle");

const candleInstruction =
    document.getElementById("candleInstruction");

const wishOverlay =
    document.getElementById("wishOverlay");

const cake =
    document.getElementById("cake");


let extinguishedCandles = 0;
let celebrationFinished = false;


candles.forEach(function (candle) {

    candle.addEventListener(
        "pointerup",
        function (event) {

            event.stopPropagation();

            if (
                candle.classList.contains(
                    "extinguished"
                )
            ) {
                return;
            }

            candle.classList.add(
                "extinguished"
            );

            extinguishedCandles++;

            if (
                extinguishedCandles ===
                candles.length
            ) {

                triggerBirthdayCelebration();

            }

        }
    );

});


/* =====================================================
   CELEBRATION
===================================================== */

function triggerBirthdayCelebration() {

    if (celebrationFinished) {
        return;
    }

    celebrationFinished = true;

    candleInstruction.style.opacity = "0";

    cake.classList.add("ready");

    popAllBalloons();

    firePartyPoppers();

    createConfetti();

    setTimeout(
        function () {

            wishOverlay.classList.remove(
                "hidden"
            );

        },
        700
    );

}


/* =====================================================
   BALLOONS
===================================================== */

function popAllBalloons() {

    const balloons =
        document.querySelectorAll(
            ".balloon"
        );

    balloons.forEach(
        function (balloon, index) {

            setTimeout(
                function () {

                    balloon.classList.add(
                        "popped"
                    );

                },
                index * 120
            );

        }
    );

}


/* =====================================================
   PARTY POPPERS
===================================================== */

const leftPopper =
    document.getElementById("leftPopper");

const rightPopper =
    document.getElementById("rightPopper");


function firePartyPoppers() {

    leftPopper.classList.add("blast");

    setTimeout(
        function () {

            rightPopper.classList.add("blast");

        },
        180
    );

}


/* =====================================================
   CONFETTI
===================================================== */

function createConfetti() {

    const pieces = 90;

    for (
        let i = 0;
        i < pieces;
        i++
    ) {

        const confetti =
            document.createElement("div");

        confetti.style.position = "fixed";

        confetti.style.left =
            Math.random() * 100 + "vw";

        confetti.style.top = "-20px";

        confetti.style.width = "7px";
        confetti.style.height = "13px";

        const colors = [
            "#ffffff",
            "#ffd166",
            "#ff8fab",
            "#a8e6cf"
        ];

        confetti.style.background =
            colors[
                Math.floor(
                    Math.random() *
                    colors.length
                )
            ];

        confetti.style.zIndex = "900";

        confetti.style.pointerEvents =
            "none";

        confetti.style.transform =
            "rotate(" +
            Math.random() * 360 +
            "deg)";

        confetti.style.transition =
            "top 2.5s ease-out, " +
            "transform 2.5s ease-out, " +
            "opacity 2.5s ease";

        document.body.appendChild(
            confetti
        );

        requestAnimationFrame(
            function () {

                confetti.style.top =
                    80 +
                    Math.random() * 30 +
                    "vh";

                confetti.style.transform =
                    "rotate(" +
                    Math.random() * 1000 +
                    "deg)";

                confetti.style.opacity = "0";

            }
        );

        setTimeout(
            function () {

                confetti.remove();

            },
            3000
        );

    }

}


/* =====================================================
   CAKE
===================================================== */

cake.addEventListener(
    "pointerup",
    function () {

        if (!celebrationFinished) {
            return;
        }

        cake.style.transform =
            "translate(-50%, -50%) scale(1.12)";

        createConfetti();

        setTimeout(
            function () {

                showScene(
                    document.getElementById(
                        "letterScene"
                    )
                );

                cake.style.transform =
                    "translate(-50%, -50%)";

            },
            900
        );

    }
);


/* =====================================================
   SECTION 3 — LETTER
===================================================== */

const letterButton =
    document.getElementById(
        "letterButton"
    );

const letterOverlay =
    document.getElementById(
        "letterOverlay"
    );

const closeLetter =
    document.getElementById(
        "closeLetter"
    );

const continueToWine =
    document.getElementById(
        "continueToWine"
    );


letterButton.addEventListener(
    "pointerup",
    function () {

        letterOverlay.classList.remove(
            "hidden"
        );

    }
);


closeLetter.addEventListener(
    "pointerup",
    function (event) {

        event.stopPropagation();

        letterOverlay.classList.add(
            "hidden"
        );

    }
);


/* =====================================================
   LETTER → WINE
===================================================== */

continueToWine.addEventListener(
    "pointerup",
    function () {

        letterOverlay.classList.add(
            "hidden"
        );

        setTimeout(
            function () {

                showScene(
                    document.getElementById(
                        "wineScene"
                    )
                );

            },
            500
        );

    }
);


/* =====================================================
   SECTION 4 — WINE
===================================================== */

const wineBottle =
    document.getElementById(
        "wineBottle"
    );

const wineLiquid =
    document.getElementById(
        "wineLiquid"
    );

const glassLiquid =
    document.getElementById(
        "glassLiquid"
    );

const wineText =
    document.getElementById(
        "wineText"
    );

const wineFog =
    document.getElementById(
        "wineFog"
    );

const wineWorld =
    document.getElementById(
        "wineWorld"
    );

const finalWineMessage =
    document.getElementById(
        "finalWineMessage"
    );

const blackout =
    document.getElementById(
        "blackout"
    );


let wineClicks = 0;


const wineMessages = [

    "Tonight is yours… so let yourself feel every little moment. ❤️",

    "Some moments are meant to be remembered forever… ✨",

    "Close your eyes… and just let the moment take you somewhere beautiful. 🌙",

    "Because the best part of tonight… is still waiting for you. ❤️"

];


wineBottle.addEventListener(
    "pointerup",
    function () {

        if (wineClicks >= 5) {
            return;
        }

        wineClicks++;


        /* ---------------------------------------------
           WINE LEVEL
        --------------------------------------------- */

        const bottleLevel =
            100 -
            wineClicks * 20;

        const glassLevel =
            65 -
            wineClicks * 13;

        wineLiquid.style.height =
            bottleLevel + "%";

        glassLiquid.style.height =
            Math.max(
                glassLevel,
                0
            ) + "%";


        /* ---------------------------------------------
           TEXT
        --------------------------------------------- */

        wineText.classList.add(
            "fade"
        );

        setTimeout(
            function () {

                if (wineClicks <= 4) {

                    wineText.textContent =
                        wineMessages[
                            wineClicks - 1
                        ];

                }

                wineText.classList.remove(
                    "fade"
                );

            },
            400
        );


        /* ---------------------------------------------
           FOG
        --------------------------------------------- */

        if (wineClicks >= 2) {

            wineFog.classList.add(
                "active"
            );

        }


        /* ---------------------------------------------
           SCREEN MOVEMENT
        --------------------------------------------- */

        if (wineClicks >= 3) {

            wineWorld.style.animation =
                "screenSway 3s infinite ease-in-out";

        }


        /* ---------------------------------------------
           FINAL CLICK
        --------------------------------------------- */

        if (wineClicks === 5) {

            finishWine();

        }

    }
);


/* =====================================================
   WINE ENDING
===================================================== */

function finishWine() {

    wineText.classList.add(
        "fade"
    );

    wineFog.classList.add(
        "active"
    );


    setTimeout(
        function () {

            finalWineMessage.classList.remove(
                "hidden"
            );

        },
        1800
    );


    setTimeout(
        function () {

            finalWineMessage.classList.add(
                "hidden"
            );

        },
        5000
    );


    setTimeout(
        function () {

            blackout.classList.add(
                "show"
            );

        },
        6500
    );


    /*
       PAGE 3 CONNECTION

       When Page 3 is ready, replace the
       following comment with:

       window.location.href = "page3.html";

       Example:

       setTimeout(function () {
           window.location.href = "page3.html";
       }, 8500);
    */

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
