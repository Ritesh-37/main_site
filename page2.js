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

    musicButton.addEventListener("click", function () {

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

    });


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

        button.addEventListener("click", function () {

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

        });

    });


    /* =========================
       ENTER CAKE
    ========================== */

    get("start-cake").addEventListener("click", function () {

        showSection("cake-section");

        startBirthdayMusic();

    });


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

        candle.addEventListener("click", function () {

            if (candle.classList.contains("off")) {
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
                    (remaining === 1 ? "" : "s") +
                    " left, sweetheart... 🕯️❤️";

            }

            if (candlesOff === candles.length) {

                cakeInstruction.textContent =
                    "MAKE A WISH, BEAUTIFUL GIRL... ❤️✨";

                startMegaCelebration();

            }

        });

    });


    /* =========================
       SMALL CANDLE SPARKLES
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
                (rect.left + rect.width / 2) + "px";

            sparkle.style.top =
                rect.top + "px";

            sparkle.style.fontSize =
                (12 + Math.random() * 10) + "px";

            document.body.appendChild(sparkle);

            const x =
                (Math.random() - 0.5) * 120;

            const y =
                -(30 + Math.random() * 100);

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
       10 SECOND DIWALI CELEBRATION
    ================================================== */

    function startMegaCelebration() {

        if (celebrationStarted) {
            return;
        }

        celebrationStarted = true;

        celebrationLayer.classList.add("active");

        startBirthdayMusic();

        /*
            IMPORTANT:
            No emoji-based celebration objects are used here.
            Everything is generated with HTML/CSS.
        */

        createGrandFlash();

        createFireworkBurst();
        createCrackerExplosion();
        createFlowerShower();
        createSparkleStorm();
        createCodedPopper(7);
        createGroundFountain();

        const celebrationStart =
            Date.now();

        const celebrationDuration =
            10000;

        const celebrationTimer =
            setInterval(function () {

                const elapsed =
                    Date.now() -
                    celebrationStart;

                if (elapsed >= celebrationDuration) {

                    clearInterval(
                        celebrationTimer
                    );

                    finishCelebration();

                    return;
                }

                /*
                    Keep throwing different effects
                    across the entire screen.
                */

                createFireworkBurst();
                createCrackerExplosion();
                createSparkleStorm();
                createFlowerShower();
                createCodedPopper(
                    Math.random() > 0.5 ? 1 : 2
                );

                if (Math.random() > 0.35) {
                    createGroundFountain();
                }

            }, 480);

    }


    /* ==================================================
       GRAND WHITE FLASH
    ================================================== */

    function createGrandFlash() {

        const flash =
            document.createElement("div");

        flash.style.position = "fixed";
        flash.style.inset = "0";
        flash.style.background = "#ffffff";
        flash.style.zIndex = "1500";
        flash.style.pointerEvents = "none";

        document.body.appendChild(flash);

        flash.animate(
            [
                {
                    opacity: 0
                },
                {
                    opacity: 0.95
                },
                {
                    opacity: 0
                }
            ],
            {
                duration: 900,
                easing: "ease-out"
            }
        );

        setTimeout(function () {
            flash.remove();
        }, 1000);

    }


    /* ==================================================
       CODED FIREWORK BURST
    ================================================== */

    function createFireworkBurst() {

        const x =
            5 +
            Math.random() * 90;

        const y =
            10 +
            Math.random() * 55;

        playSound(
            crackleSound,
            0.32
        );

        const core =
            document.createElement("div");

        core.className =
            "coded-firework-core";

        core.style.left =
            x + "%";

        core.style.top =
            y + "%";

        document.body.appendChild(core);

        core.animate(
            [
                {
                    transform: "scale(0)",
                    opacity: 0
                },
                {
                    transform: "scale(1)",
                    opacity: 1
                },
                {
                    transform: "scale(3)",
                    opacity: 0
                }
            ],
            {
                duration: 450
            }
        );

        setTimeout(function () {
            core.remove();
        }, 600);


        /*
            Large radial firework.
        */

        const particleCount =
            28 +
            Math.floor(
                Math.random() * 18
            );

        for (
            let i = 0;
            i < particleCount;
            i++
        ) {

            const spark =
                document.createElement("div");

            spark.className =
                "coded-firework-spark";

            spark.style.left =
                x + "%";

            spark.style.top =
                y + "%";

            const angle =
                Math.random() *
                Math.PI *
                2;

            const distance =
                80 +
                Math.random() *
                250;

            const dx =
                Math.cos(angle) *
                distance;

            const dy =
                Math.sin(angle) *
                distance;

            const size =
                3 +
                Math.random() * 6;

            spark.style.width =
                size + "px";

            spark.style.height =
                size + "px";

            document.body.appendChild(spark);

            spark.animate(
                [
                    {
                        transform:
                            "translate(-50%,-50%) scale(.1)",
                        opacity: 0
                    },
                    {
                        transform:
                            "translate(-50%,-50%) scale(1.5)",
                        opacity: 1
                    },
                    {
                        transform:
                            "translate(calc(-50% + " +
                            dx +
                            "px), calc(-50% + " +
                            dy +
                            "px)) scale(.1)",
                        opacity: 0
                    }
                ],
                {
                    duration:
                        700 +
                        Math.random() * 900,

                    easing:
                        "cubic-bezier(.1,.8,.2,1)"
                }
            );

            setTimeout(function () {
                spark.remove();
            }, 1900);

        }

    }


    /* ==================================================
       CODED CRACKER EXPLOSION
    ================================================== */

    function createCrackerExplosion() {

        const x =
            Math.random() * 100;

        const y =
            20 +
            Math.random() * 65;

        const cracker =
            document.createElement("div");

        cracker.className =
            "coded-cracker";

        cracker.style.left =
            x + "%";

        cracker.style.top =
            y + "%";

        document.body.appendChild(cracker);

        cracker.animate(
            [
                {
                    transform:
                        "translate(-50%,-50%) scale(.1)",
                    opacity: 0
                },
                {
                    transform:
                        "translate(-50%,-50%) scale(1)",
                    opacity: 1
                },
                {
                    transform:
                        "translate(-50%,-50%) scale(1.8)",
                    opacity: 0
                }
            ],
            {
                duration: 400
            }
        );

        setTimeout(function () {
            cracker.remove();
        }, 550);


        /*
            Tiny cracker sparks.
        */

        for (let i = 0; i < 14; i++) {

            const spark =
                document.createElement("div");

            spark.className =
                "cracker-spark";

            spark.style.left =
                x + "%";

            spark.style.top =
                y + "%";

            const angle =
                Math.random() *
                Math.PI *
                2;

            const distance =
                30 +
                Math.random() * 120;

            const dx =
                Math.cos(angle) *
                distance;

            const dy =
                Math.sin(angle) *
                distance;

            document.body.appendChild(spark);

            spark.animate(
                [
                    {
                        transform:
                            "translate(-50%,-50%) scale(1)",
                        opacity: 1
                    },
                    {
                        transform:
                            "translate(calc(-50% + " +
                            dx +
                            "px), calc(-50% + " +
                            dy +
                            "px)) scale(0)",
                        opacity: 0
                    }
                ],
                {
                    duration:
                        350 +
                        Math.random() * 450
                }
            );

            setTimeout(function () {
                spark.remove();
            }, 900);

        }

    }


    /* ==================================================
       CODED PARTY POPPER
       NO EMOJI
    ================================================== */

    function createCodedPopper(count) {

        for (
            let c = 0;
            c < count;
            c++
        ) {

            const fromLeft =
                Math.random() > 0.5;

            const x =
                fromLeft
                    ? -10
                    : 110;

            const y =
                55 +
                Math.random() * 25;

            const popper =
                document.createElement("div");

            popper.className =
                "coded-popper";

            popper.style.left =
                x + "%";

            popper.style.top =
                y + "%";

            popper.style.transform =
                fromLeft
                    ? "rotate(-25deg)"
                    : "rotate(25deg)";

            document.body.appendChild(popper);

            playSound(
                popperSound,
                0.25
            );


            for (let i = 0; i < 18; i++) {

                const piece =
                    document.createElement("div");

                piece.className =
                    "coded-popper-piece";

                piece.style.left =
                    x + "%";

                piece.style.top =
                    y + "%";

                const direction =
                    fromLeft ? 1 : -1;

                const dx =
                    direction *
                    (
                        100 +
                        Math.random() * 350
                    );

                const dy =
                    (
                        Math.random() - 0.5
                    ) *
                    280;

                document.body.appendChild(piece);

                piece.animate(
                    [
                        {
                            transform:
                                "translate(-50%,-50%) scale(1)",
                            opacity: 1
                        },
                        {
                            transform:
                                "translate(calc(-50% + " +
                                dx +
                                "px), calc(-50% + " +
                                dy +
                                "px)) rotate(" +
                                (
                                    Math.random() * 720
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
                }, 1600);

            }

            setTimeout(function () {
                popper.remove();
            }, 900);

        }

    }


    /* ==================================================
       CODED FLOWER SHOWER
    ================================================== */

    function createFlowerShower() {

        const flower =
            document.createElement("div");

        flower.className =
            "coded-flower";

        flower.style.left =
            Math.random() * 100 + "%";

        flower.style.top =
            "-40px";

        const size =
            10 +
            Math.random() * 18;

        flower.style.width =
            size + "px";

        flower.style.height =
            size + "px";

        document.body.appendChild(flower);

        const x =
            (
                Math.random() - 0.5
            ) *
            220;

        const y =
            window.innerHeight +
            100;

        flower.animate(
            [
                {
                    transform:
                        "translateY(0) rotate(0deg)",
                    opacity: 0
                },
                {
                    transform:
                        "translateY(150px) rotate(180deg)",
                    opacity: 1
                },
                {
                    transform:
                        "translate(" +
                        x +
                        "px," +
                        y +
                        "px) rotate(720deg)",
                    opacity: 0
                }
            ],
            {
                duration:
                    2500 +
                    Math.random() * 1800,

                easing: "ease-in"
            }
        );

        setTimeout(function () {
            flower.remove();
        }, 5000);

    }


    /* ==================================================
       SPARKLE STORM
    ================================================== */

    function createSparkleStorm() {

        for (let i = 0; i < 20; i++) {

            const sparkle =
                document.createElement("div");

            sparkle.className =
                "coded-sparkle";

            sparkle.style.left =
                Math.random() * 100 + "%";

            sparkle.style.top =
                Math.random() * 100 + "%";

            const size =
                3 +
                Math.random() * 8;

            sparkle.style.width =
                size + "px";

            sparkle.style.height =
                size + "px";

            document.body.appendChild(sparkle);

            sparkle.animate(
                [
                    {
                        transform:
                            "scale(0) rotate(0deg)",
                        opacity: 0
                    },
                    {
                        transform:
                            "scale(2) rotate(180deg)",
                        opacity: 1
                    },
                    {
                        transform:
                            "scale(0) rotate(360deg)",
                        opacity: 0
                    }
                ],
                {
                    duration:
                        500 +
                        Math.random() * 700
                }
            );

            setTimeout(function () {
                sparkle.remove();
            }, 1400);

        }

    }


    /* ==================================================
       GROUND FOUNTAIN
    ================================================== */

    function createGroundFountain() {

        const fountain =
            document.createElement("div");

        fountain.className =
            "coded-fountain";

        fountain.style.left =
            (
                10 +
                Math.random() * 80
            ) + "%";

        fountain.style.bottom =
            "0px";

        document.body.appendChild(fountain);

        for (let i = 0; i < 24; i++) {

            const spark =
                document.createElement("div");

            spark.className =
                "fountain-spark";

            fountain.appendChild(spark);

            const angle =
                (
                    -Math.PI +
                    Math.random() *
                    Math.PI
                );

            const distance =
                100 +
                Math.random() * 240;

            const dx =
                Math.cos(angle) *
                distance;

            const dy =
                -(
                    60 +
                    Math.random() *
                    240
                );

            spark.animate(
                [
                    {
                        transform:
                            "translate(0,0) scale(.4)",
                        opacity: 0
                    },
                    {
                        transform:
                            "translate(" +
                            dx * 0.5 +
                            "px," +
                            dy * 0.5 +
                            "px) scale(1)",
                        opacity: 1
                    },
                    {
                        transform:
                            "translate(" +
                            dx +
                            "px," +
                            (
                                dy +
                                100
                            ) +
                            "px) scale(.1)",
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

        }

        setTimeout(function () {
            fountain.remove();
        }, 1600);

    }


    /* ==================================================
       FINISH
    ================================================== */

    function finishCelebration() {

        /*
            One final elegant burst before
            the birthday popup appears.
        */

        createGrandFlash();

        for (let i = 0; i < 50; i++) {

            const sparkle =
                document.createElement("div");

            sparkle.className =
                "coded-sparkle";

            sparkle.style.left = "50%";
            sparkle.style.top = "50%";

            document.body.appendChild(sparkle);

            const angle =
                Math.random() *
                Math.PI *
                2;

            const distance =
                100 +
                Math.random() *
                450;

            const x =
                Math.cos(angle) *
                distance;

            const y =
                Math.sin(angle) *
                distance;

            sparkle.animate(
                [
                    {
                        transform:
                            "translate(-50%,-50%) scale(.1)",
                        opacity: 0
                    },
                    {
                        transform:
                            "translate(-50%,-50%) scale(1.8)",
                        opacity: 1
                    },
                    {
                        transform:
                            "translate(calc(-50% + " +
                            x +
                            "px), calc(-50% + " +
                            y +
                            "px)) scale(0)",
                        opacity: 0
                    }
                ],
                {
                    duration:
                        900 +
                        Math.random() * 700,

                    easing: "ease-out"
                }
            );

            setTimeout(function () {
                sparkle.remove();
            }, 1800);

        }


        setTimeout(function () {

            celebrationLayer.classList.remove("active");

            birthdayPopup.classList.add("show");

            cakeInstruction.textContent =
                "Happy Birthday, beautiful girl. ❤️";

        }, 1000);

    }


    /* ==================================================
       PAGE 3
    ================================================== */

    get("page3-button").addEventListener(
        "click",
        function () {

            window.location.href =
                "page3.html";

        }
    );

});
