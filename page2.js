document.addEventListener("DOMContentLoaded", function () {

    function get(id) {
        return document.getElementById(id);
    }


    /* =========================
       AUDIO
    ========================== */

    const music = get("birthday-music");
    const musicButton = get("music-button");

    const candleSound = get("candle-sound");
    const balloonSound = get("balloon-pop-sound");
    const popperSound = get("popper-sound");
    const crackleSound = get("crackle-sound");


    function playSound(audio, volume) {

        if (!audio) {
            return;
        }

        try {

            audio.pause();
            audio.currentTime = 0;
            audio.volume = volume || 0.6;

            const promise = audio.play();

            if (promise) {
                promise.catch(function () {});
            }

        } catch (error) {
            console.log("Audio error:", error);
        }
    }


    function startBirthdayMusic() {

        if (!music) {
            return;
        }

        music.volume = 0.38;

        const promise = music.play();

        if (promise) {

            promise
                .then(function () {
                    musicButton.textContent = "♫";
                })
                .catch(function () {
                    musicButton.textContent = "🔇";
                });

        }
    }


    musicButton.addEventListener(
        "click",
        function () {

            if (!music) {
                return;
            }

            if (music.paused) {

                music.play()
                    .then(function () {
                        musicButton.textContent = "♫";
                    })
                    .catch(function () {});

            } else {

                music.pause();

                musicButton.textContent = "🔇";
            }

        }
    );


    /* =========================
       SECTION SWITCH
    ========================== */

    function showSection(id) {

        document
            .querySelectorAll(".party-section")
            .forEach(function (section) {

                section.classList.remove("active");

            });


        const target = get(id);

        if (!target) {
            return;
        }


        setTimeout(function () {

            target.classList.add("active");

        }, 50);
    }


    /* =========================
       WELCOME
    ========================== */

    const welcomeSteps =
        document.querySelectorAll(".welcome-step");

    const welcomeButtons =
        document.querySelectorAll(".welcome-next");


    welcomeButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const next =
                    button.getAttribute("data-next");


                welcomeSteps.forEach(function (step) {

                    step.classList.remove("active");

                });


                const nextStep =
                    get("welcome-step-" + next);


                if (nextStep) {

                    setTimeout(function () {

                        nextStep.classList.add("active");

                    }, 100);

                }

            }
        );

    });


    /* =========================
       ENTER CAKE
    ========================== */

    get("start-cake").addEventListener(
        "click",
        function () {

            showSection("cake-section");

            startBirthdayMusic();

        }
    );


    /* =========================
       CANDLES
    ========================== */

    const candles =
        document.querySelectorAll(".candle");

    const cakeInstruction =
        get("cake-instruction");

    const celebrationLayer =
        get("celebration-layer");

    const birthdayPopup =
        get("birthday-popup");


    let candlesOff = 0;
    let celebrationStarted = false;


    candles.forEach(function (candle) {

        candle.addEventListener(
            "click",
            function () {

                if (
                    candle.classList.contains("off")
                ) {
                    return;
                }


                candle.classList.add("off");

                candlesOff++;


                playSound(
                    candleSound,
                    0.5
                );


                createSmallSparkle(candle);


                const remaining =
                    candles.length - candlesOff;


                if (remaining > 0) {

                    cakeInstruction.textContent =
                        remaining +
                        " candle" +
                        (
                            remaining === 1
                                ? ""
                                : "s"
                        ) +
                        " left, sweetheart... 🕯️❤️";

                }


                if (
                    candlesOff === candles.length
                ) {

                    cakeInstruction.textContent =
                        "MAKE A WISH, BEAUTIFUL GIRL... ❤️✨";

                    startMegaCelebration();

                }

            }
        );

    });


    /* =========================
       SMALL SPARKLES
    ========================== */

    function createSmallSparkle(candle) {

        const rect =
            candle.getBoundingClientRect();


        const symbols = [
            "✦",
            "✧",
            "✨",
            "♥"
        ];


        for (let i = 0; i < 8; i++) {

            const sparkle =
                document.createElement("div");

            sparkle.className =
                "celebration-particle sparkle";

            sparkle.textContent =
                symbols[
                    Math.floor(
                        Math.random() *
                        symbols.length
                    )
                ];


            sparkle.style.left =
                (
                    rect.left +
                    rect.width / 2
                ) + "px";

            sparkle.style.top =
                rect.top + "px";


            sparkle.style.fontSize =
                (
                    12 +
                    Math.random() * 10
                ) + "px";


            document.body.appendChild(sparkle);


            const x =
                (
                    Math.random() - .5
                ) * 120;

            const y =
                -(
                    30 +
                    Math.random() * 100
                );


            sparkle.animate(
                [
                    {
                        transform:
                            "translate(0,0) scale(1)",
                        opacity: 1
                    },
                    {
                        transform:
                            "translate(" +
                            x +
                            "px," +
                            y +
                            "px) scale(0)",
                        opacity: 0
                    }
                ],
                {
                    duration:
                        600 +
                        Math.random() * 400,

                    easing: "ease-out"
                }
            );


            setTimeout(function () {

                sparkle.remove();

            }, 1200);

        }

    }


    /* ==================================================
       6 SECOND MEGA CELEBRATION
       EVERYTHING IS CODED
    ================================================== */

    function startMegaCelebration() {

        if (celebrationStarted) {
            return;
        }

        celebrationStarted = true;


        celebrationLayer.classList.add("active");

        startBirthdayMusic();


        /* FIRST MASSIVE BURST */

        createMegaBurst();
        createBalloonBurst();
        createPopperBurst();
        createFirework();


        const celebrationStart =
            Date.now();

        const celebrationDuration =
            6000;


        const celebrationTimer =
            setInterval(function () {

                const elapsed =
                    Date.now() -
                    celebrationStart;


                if (
                    elapsed >=
                    celebrationDuration
                ) {

                    clearInterval(
                        celebrationTimer
                    );

                    finishCelebration();

                    return;
                }


                /* REPEATING EFFECTS */

                createSparkleWave();
                createConfettiBurst();
                createFirework();
                createBalloonBurst();
                createPopperBurst();

            }, 500);

    }


    /* ==================================================
       CODED MEGA BURST
    ================================================== */

    function createMegaBurst() {

        for (let i = 0; i < 70; i++) {

            const particle =
                document.createElement("div");

            particle.className =
                "celebration-particle";


            /* CODED SPARKLE */

            particle.style.width =
                (
                    3 +
                    Math.random() * 7
                ) + "px";

            particle.style.height =
                (
                    3 +
                    Math.random() * 7
                ) + "px";

            particle.style.borderRadius =
                "50%";

            particle.style.background =
                "#fff7b0";

            particle.style.boxShadow =
                "0 0 8px #ffffff, 0 0 18px #ffd45c";


            particle.style.left = "50%";
            particle.style.top = "50%";


            document.body.appendChild(particle);


            const angle =
                Math.random() *
                Math.PI *
                2;

            const distance =
                100 +
                Math.random() * 450;


            const x =
                Math.cos(angle) *
                distance;

            const y =
                Math.sin(angle) *
                distance;


            particle.animate(
                [
                    {
                        transform:
                            "translate(-50%,-50%) scale(.1)",
                        opacity: 0
                    },
                    {
                        transform:
                            "translate(-50%,-50%) scale(1.4)",
                        opacity: 1
                    },
                    {
                        transform:
                            "translate(calc(-50% + " +
                            x +
                            "px), calc(-50% + " +
                            y +
                            "px)) scale(.1)",
                        opacity: 0
                    }
                ],
                {
                    duration:
                        800 +
                        Math.random() * 1000,

                    easing:
                        "cubic-bezier(.2,.8,.2,1)"
                }
            );


            setTimeout(function () {

                particle.remove();

            }, 2200);

        }

    }


    /* ==================================================
       CODED SPARKLE WAVE
    ================================================== */

    function createSparkleWave() {

        for (let i = 0; i < 20; i++) {

            const particle =
                document.createElement("div");

            particle.className =
                "celebration-particle";


            particle.style.width =
                (
                    3 +
                    Math.random() * 6
                ) + "px";

            particle.style.height =
                (
                    3 +
                    Math.random() * 6
                ) + "px";

            particle.style.borderRadius =
                "50%";

            particle.style.background =
                "#ffffff";

            particle.style.boxShadow =
                "0 0 8px #ffffff, 0 0 20px #ffd85c";


            particle.style.left =
                Math.random() * 100 + "%";

            particle.style.top =
                Math.random() * 100 + "%";


            document.body.appendChild(particle);


            particle.animate(
                [
                    {
                        transform:
                            "scale(.1)",
                        opacity: 0
                    },
                    {
                        transform:
                            "scale(2)",
                        opacity: 1
                    },
                    {
                        transform:
                            "scale(.1)",
                        opacity: 0
                    }
                ],
                {
                    duration:
                        600 +
                        Math.random() * 700
                }
            );


            setTimeout(function () {

                particle.remove();

            }, 1600);

        }

    }


    /* ==================================================
       CODED CONFETTI
    ================================================== */

    function createConfettiBurst() {

        const x =
            Math.random() *
            window.innerWidth;

        const y =
            window.innerHeight * .08;


        for (let i = 0; i < 25; i++) {

            const piece =
                document.createElement("div");

            piece.className =
                "celebration-particle";


            const size =
                5 +
                Math.random() * 8;


            piece.style.width =
                size + "px";

            piece.style.height =
                (
                    size * 1.8
                ) + "px";


            piece.style.borderRadius =
                Math.random() > .5
                    ? "2px"
                    : "50%";


            piece.style.background =
                [
                    "#8f243d",
                    "#b52d51",
                    "#e2a31a",
                    "#f08ba3",
                    "#ffffff"
                ][
                    Math.floor(
                        Math.random() * 5
                    )
                ];


            piece.style.left =
                x + "px";

            piece.style.top =
                y + "px";


            document.body.appendChild(piece);


            const moveX =
                (
                    Math.random() - .5
                ) * 400;

            const moveY =
                250 +
                Math.random() * 500;


            piece.animate(
                [
                    {
                        transform:
                            "translate(0,0) rotate(0deg)",
                        opacity: 1
                    },
                    {
                        transform:
                            "translate(" +
                            moveX +
                            "px," +
                            moveY +
                            "px) rotate(" +
                            (
                                Math.random() * 1000
                            ) +
                            "deg)",
                        opacity: 0
                    }
                ],
                {
                    duration:
                        1000 +
                        Math.random() * 900,

                    easing: "ease-out"
                }
            );


            setTimeout(function () {

                piece.remove();

            }, 2300);

        }

    }


    /* ==================================================
       CODED BALLOON
    ================================================== */

    function createBalloonBurst() {

        const x =
            70 +
            Math.random() *
            (
                window.innerWidth - 140
            );

        const y =
            120 +
            Math.random() *
            (
                window.innerHeight * .45
            );


        playSound(
            balloonSound,
            0.35
        );


        const balloon =
            document.createElement("div");

        balloon.className =
            "celebration-particle";


        balloon.style.position =
            "fixed";

        balloon.style.left =
            x + "px";

        balloon.style.top =
            y + "px";


        balloon.style.width =
            "42px";

        balloon.style.height =
            "52px";


        balloon.style.borderRadius =
            "50% 50% 48% 48%";


        balloon.style.background =
            [
                "linear-gradient(135deg,#f08ba3,#a92549)",
                "linear-gradient(135deg,#ffd2dc,#d94d6c)",
                "linear-gradient(135deg,#ffffff,#f08ba3)"
            ][
                Math.floor(
                    Math.random() * 3
                )
            ];


        balloon.style.boxShadow =
            "inset -8px -10px 15px rgba(90,10,30,.15), 0 8px 20px rgba(90,10,30,.2)";


        balloon.style.zIndex =
            "1200";


        document.body.appendChild(balloon);


        /* BALLOON STRING */

        const string =
            document.createElement("div");

        string.style.position =
            "fixed";

        string.style.left =
            (
                x + 21
            ) + "px";

        string.style.top =
            (
                y + 50
            ) + "px";

        string.style.width =
            "1px";

        string.style.height =
            "80px";

        string.style.background =
            "rgba(80,30,40,.35)";

        string.style.zIndex =
            "1199";


        document.body.appendChild(string);


        setTimeout(function () {

            balloon.animate(
                [
                    {
                        transform:
                            "scale(.5)",
                        opacity: 0
                    },
                    {
                        transform:
                            "scale(1.15)",
                        opacity: 1
                    },
                    {
                        transform:
                            "scale(1)",
                        opacity: 1
                    }
                ],
                {
                    duration: 350
                }
            );

        }, 10);


        setTimeout(function () {

            /* POP */

            balloon.animate(
                [
                    {
                        transform:
                            "scale(1)"
                    },
                    {
                        transform:
                            "scale(1.3)"
                    },
                    {
                        transform:
                            "scale(.05)"
                    }
                ],
                {
                    duration: 280
                }
            );


            string.animate(
                [
                    {
                        opacity: 1
                    },
                    {
                        opacity: 0
                    }
                ],
                {
                    duration: 250
                }
            );


            /* CODED POP PARTICLES */

            for (let i = 0; i < 18; i++) {

                const spark =
                    document.createElement("div");

                spark.style.position =
                    "fixed";

                spark.style.left =
                    x + 21 + "px";

                spark.style.top =
                    y + 25 + "px";

                spark.style.width =
                    "5px";

                spark.style.height =
                    "5px";

                spark.style.borderRadius =
                    "50%";

                spark.style.background =
                    "#ffd85c";

                spark.style.boxShadow =
                    "0 0 10px #fff";


                document.body.appendChild(spark);


                const angle =
                    Math.random() *
                    Math.PI *
                    2;

                const distance =
                    40 +
                    Math.random() *
                    100;


                spark.animate(
                    [
                        {
                            transform:
                                "translate(0,0) scale(1)",
                            opacity: 1
                        },
                        {
                            transform:
                                "translate(" +
                                Math.cos(angle) *
                                distance +
                                "px," +
                                Math.sin(angle) *
                                distance +
                                "px) scale(.1)",
                            opacity: 0
                        }
                    ],
                    {
                        duration:
                            450 +
                            Math.random() * 300
                    }
                );


                setTimeout(function () {
                    spark.remove();
                }, 1000);

            }

        }, 550);


        setTimeout(function () {

            balloon.remove();
            string.remove();

        }, 1500);

    }


    /* ==================================================
       CODED PARTY POPPER
    ================================================== */

    function createPopperBurst() {

        const leftSide =
            Math.random() < .5;


        const x =
            leftSide
                ? 70
                : window.innerWidth - 70;


        const y =
            window.innerHeight *
            (
                .35 +
                Math.random() * .25
            );


        playSound(
            popperSound,
            0.4
        );


        /* POPPER BODY */

        const popper =
            document.createElement("div");

        popper.style.position =
            "fixed";

        popper.style.left =
            x + "px";

        popper.style.top =
            y + "px";

        popper.style.width =
            "25px";

        popper.style.height =
            "70px";

        popper.style.borderRadius =
            "7px";

        popper.style.background =
            "linear-gradient(135deg,#7d1834,#e15a78)";

        popper.style.transform =
            leftSide
                ? "rotate(-25deg)"
                : "rotate(25deg)";

        popper.style.boxShadow =
            "0 8px 20px rgba(80,10,30,.25)";

        popper.style.zIndex =
            "1200";


        document.body.appendChild(popper);


        /* BURST PARTICLES */

        for (let i = 0; i < 22; i++) {

            const piece =
                document.createElement("div");

            piece.style.position =
                "fixed";

            piece.style.left =
                x + "px";

            piece.style.top =
                y + "px";


            const width =
                4 +
                Math.random() * 7;

            const height =
                10 +
                Math.random() * 14;


            piece.style.width =
                width + "px";

            piece.style.height =
                height + "px";


            piece.style.borderRadius =
                "2px";


            piece.style.background =
                [
                    "#a92549",
                    "#e2a31a",
                    "#f08ba3",
                    "#ffffff"
                ][
                    Math.floor(
                        Math.random() * 4
                    )
                ];


            piece.style.zIndex =
                "1250";


            document.body.appendChild(piece);


            const direction =
                leftSide
                    ? 1
                    : -1;


            const moveX =
                direction *
                (
                    80 +
                    Math.random() * 260
                );


            const moveY =
                (
                    Math.random() - .5
                ) *
                280;


            piece.animate(
                [
                    {
                        transform:
                            "translate(0,0) rotate(0deg) scale(1)",
                        opacity: 1
                    },
                    {
                        transform:
                            "translate(" +
                            moveX +
                            "px," +
                            moveY +
                            "px) rotate(" +
                            (
                                Math.random() * 800
                            ) +
                            "deg) scale(.2)",
                        opacity: 0
                    }
                ],
                {
                    duration:
                        700 +
                        Math.random() * 700,

                    easing: "ease-out"
                }
            );


            setTimeout(function () {

                piece.remove();

            }, 1700);

        }


        setTimeout(function () {

            popper.animate(
                [
                    {
                        transform:
                            leftSide
                                ? "rotate(-25deg) scale(1)"
                                : "rotate(25deg) scale(1)"
                    },
                    {
                        transform:
                            leftSide
                                ? "rotate(-25deg) scale(.6)"
                                : "rotate(25deg) scale(.6)"
                    }
                ],
                {
                    duration: 250
                }
            );

        }, 350);


        setTimeout(function () {

            popper.remove();

        }, 1000);

    }


    /* ==================================================
       CODED FIREWORK / CRACKLE
    ================================================== */

    function createFirework() {

        const x =
            10 +
            Math.random() * 80;

        const y =
            15 +
            Math.random() * 45;


        playSound(
            crackleSound,
            0.35
        );


        /* CENTER FLASH */

        const center =
            document.createElement("div");

        center.style.position =
            "fixed";

        center.style.left =
            x + "%";

        center.style.top =
            y + "%";

        center.style.width =
            "12px";

        center.style.height =
            "12px";

        center.style.borderRadius =
            "50%";

        center.style.background =
            "#fff";

        center.style.boxShadow =
            "0 0 15px #fff, 0 0 35px #ffd85c";

        center.style.zIndex =
            "1300";


        document.body.appendChild(center);


        center.animate(
            [
                {
                    transform:
                        "scale(.1)",
                    opacity: 0
                },
                {
                    transform:
                        "scale(2)",
                    opacity: 1
                },
                {
                    transform:
                        "scale(.1)",
                    opacity: 0
                }
            ],
            {
                duration: 500
            }
        );


        /* RADIAL CRACKLE */

        for (let i = 0; i < 28; i++) {

            const spark =
                document.createElement("div");

            spark.style.position =
                "fixed";

            spark.style.left =
                x + "%";

            spark.style.top =
                y + "%";

            spark.style.width =
                "4px";

            spark.style.height =
                "18px";

            spark.style.borderRadius =
                "5px";

            spark.style.background =
                [
                    "#fff",
                    "#ffd85c",
                    "#f08ba3"
                ][
                    Math.floor(
                        Math.random() * 3
                    )
                ];

            spark.style.boxShadow =
                "0 0 8px rgba(255,255,255,.9)";

            spark.style.transformOrigin =
                "center bottom";

            spark.style.zIndex =
                "1300";


            document.body.appendChild(spark);


            const angle =
                Math.random() *
                Math.PI *
                2;

            const distance =
                50 +
                Math.random() * 180;


            const moveX =
                Math.cos(angle) *
                distance;

            const moveY =
                Math.sin(angle) *
                distance;


            spark.animate(
                [
                    {
                        transform:
                            "translate(0,0) rotate(" +
                            angle +
                            "rad) scale(.2)",
                        opacity: 0
                    },
                    {
                        transform:
                            "translate(" +
                            moveX +
                            "px," +
                            moveY +
                            "px) rotate(" +
                            angle +
                            "rad) scale(1)",
                        opacity: 1
                    },
                    {
                        transform:
                            "translate(" +
                            moveX * 1.2 +
                            "px," +
                            moveY * 1.2 +
                            "px) rotate(" +
                            angle +
                            "rad) scale(.1)",
                        opacity: 0
                    }
                ],
                {
                    duration:
                        650 +
                        Math.random() * 500,

                    easing: "ease-out"
                }
            );


            setTimeout(function () {

                spark.remove();

            }, 1600);

        }


        setTimeout(function () {

            center.remove();

        }, 800);

    }


    /* =========================
       FINISH
    ========================== */

    function finishCelebration() {

        createMegaBurst();


        setTimeout(function () {

            celebrationLayer.classList.remove("active");

            birthdayPopup.classList.add("show");

            cakeInstruction.textContent =
                "Happy Birthday, beautiful girl. ❤️";

        }, 900);

    }


    /* =========================
       PAGE 3
    ========================== */

    get("page3-button").addEventListener(
        "click",
        function () {

            window.location.href =
                "page3.html";

        }
    );

});
