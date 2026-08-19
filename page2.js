document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       HELPERS
    ====================================================== */

    function get(id) {
        return document.getElementById(id);
    }


    function playSound(audio, volume) {

        if (!audio) {
            return;
        }

        try {

            audio.pause();

            audio.currentTime = 0;

            audio.volume = volume || 0.5;

            const promise = audio.play();

            if (promise) {
                promise.catch(function () {});
            }

        } catch (error) {
            console.log("Audio error:", error);
        }
    }


    /* =====================================================
       AUDIO
    ====================================================== */

    const music =
        get("birthday-music");

    const musicButton =
        get("music-button");

    const cameraSound =
        get("camera-sound");

    const wineSound =
        get("wine-sound");

    const glassSound =
        get("glass-sound");


    function startMusic() {

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


    /* =====================================================
       SECTION SWITCH
    ====================================================== */

    function showSection(id) {

        document
            .querySelectorAll(".page-section")
            .forEach(function (section) {

                section.classList.remove("active");

            });


        const target = get(id);

        if (!target) {
            return;
        }


        setTimeout(function () {

            target.classList.add("active");

        }, 80);

    }


    /* =====================================================
       CAMERA INTRO
    ====================================================== */

    const cameraMessages =
        document.querySelectorAll(
            ".intro-message"
        );

    const cameraNextButtons =
        document.querySelectorAll(
            ".camera-next"
        );


    cameraNextButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const next =
                        button.getAttribute(
                            "data-message"
                        );


                    cameraMessages.forEach(
                        function (message) {

                            message.classList.remove(
                                "active"
                            );

                        }
                    );


                    const nextMessage =
                        get(
                            "camera-message-" +
                            next
                        );


                    if (nextMessage) {

                        setTimeout(
                            function () {

                                nextMessage.classList.add(
                                    "active"
                                );

                            },
                            120
                        );

                    }

                }
            );

        }
    );


    /* =====================================================
       OPEN CAMERA
    ====================================================== */

    const openCamera =
        get("open-camera");

    const cameraArea =
        get("camera-area");


    openCamera.addEventListener(
        "click",
        function () {

            cameraMessages.forEach(
                function (message) {

                    message.classList.remove(
                        "active"
                    );

                }
            );


            setTimeout(
                function () {

                    cameraArea.classList.add(
                        "visible"
                    );

                },
                300
            );


            startMusic();

        }
    );


    /* =====================================================
       CAMERA SHUTTER
    ====================================================== */

    const shutter =
        get("shutter-button");

    const countdown =
        get("countdown");

    const countdownNumber =
        get("countdown-number");

    const flashScreen =
        get("camera-flash-screen");

    const photoResult =
        get("photo-result");


    let cameraUsed = false;


    shutter.addEventListener(
        "click",
        function () {

            if (cameraUsed) {
                return;
            }

            cameraUsed = true;

            shutter.disabled = true;


            runCountdown();

        }
    );


    function runCountdown() {

        countdown.classList.add("active");


        const numbers = [
            "3",
            "2",
            "1"
        ];

        let index = 0;


        function nextNumber() {

            countdownNumber.textContent =
                numbers[index];


            countdownNumber.style.animation =
                "none";


            void countdownNumber.offsetWidth;


            countdownNumber.style.animation =
                "countdownPulse 0.9s ease";


            index++;


            if (index < numbers.length) {

                setTimeout(
                    nextNumber,
                    900
                );

            } else {

                setTimeout(
                    takePhotograph,
                    700
                );

            }

        }


        nextNumber();

    }


    function takePhotograph() {

        countdown.classList.remove(
            "active"
        );


        playSound(
            cameraSound,
            0.75
        );


        /* BIG FLASH */

        flashScreen.classList.add(
            "active"
        );


        setTimeout(
            function () {

                flashScreen.classList.remove(
                    "active"
                );

                photoResult.classList.add(
                    "show"
                );

            },
            850
        );

    }


    /* =====================================================
       CAMERA CONTINUE
    ====================================================== */

    get("camera-continue")
        .addEventListener(
            "click",
            function () {

                photoResult.classList.remove(
                    "show"
                );

                showSection(
                    "bouquet-section"
                );

            }
        );


    /* =====================================================
       BOUQUET
    ====================================================== */

    const bouquet =
        get("bouquet");

    let bouquetClicked = false;


    bouquet.addEventListener(
        "click",
        function () {

            if (bouquetClicked) {
                return;
            }

            bouquetClicked = true;


            bouquet.classList.add(
                "opened"
            );


            createBouquetSparkles();


            setTimeout(
                function () {

                    document
                        .querySelector(
                            ".bouquet-hint"
                        )
                        .textContent =
                        "A little something for you... ❤️";

                },
                500
            );

        }
    );


    function createBouquetSparkles() {

        const symbols = [
            "✦",
            "✧",
            "✨",
            "♥"
        ];


        for (
            let i = 0;
            i < 18;
            i++
        ) {

            const sparkle =
                document.createElement(
                    "span"
                );


            sparkle.textContent =
                symbols[
                    Math.floor(
                        Math.random() *
                        symbols.length
                    )
                ];


            sparkle.style.position =
                "fixed";

            sparkle.style.left =
                (35 + Math.random() * 30) +
                "%";

            sparkle.style.top =
                (30 + Math.random() * 30) +
                "%";


            sparkle.style.color =
                "#b88b35";

            sparkle.style.fontSize =
                (12 + Math.random() * 14) +
                "px";

            sparkle.style.pointerEvents =
                "none";

            sparkle.style.zIndex =
                "1000";


            document.body.appendChild(
                sparkle
            );


            const x =
                (Math.random() - 0.5) *
                220;

            const y =
                -(50 + Math.random() * 160);


            sparkle.animate(
                [
                    {
                        transform:
                            "translate(0,0) scale(.3)",
                        opacity: 0
                    },
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
                            "px) scale(.2)",
                        opacity: 0
                    }
                ],
                {
                    duration:
                        900 +
                        Math.random() *
                        700,

                    easing:
                        "ease-out"
                }
            );


            setTimeout(
                function () {
                    sparkle.remove();
                },
                1800
            );

        }

    }


    /* =====================================================
       ENVELOPE
    ====================================================== */

    const envelope =
        get("envelope");

    const letter =
        get("letter");


    envelope.addEventListener(
        "click",
        function () {

            envelope.classList.add(
                "open"
            );


            setTimeout(
                function () {

                    letter.classList.add(
                        "show"
                    );

                },
                650
            );

        }
    );


    /* =====================================================
       LETTER CONTINUE
    ====================================================== */

    get("letter-continue")
        .addEventListener(
            "click",
            function () {

                letter.classList.remove(
                    "show"
                );


                setTimeout(
                    function () {

                        showSection(
                            "wine-section"
                        );

                    },
                    500
                );

            }
        );


    /* =====================================================
       WINE SYSTEM
    ====================================================== */

    const bottle =
        get("wine-bottle");

    const bottleWine =
        get("bottle-wine");

    const glassLiquidOne =
        get("glass-liquid-1");

    const glassLiquidTwo =
        get("glass-liquid-2");

    const wineCount =
        get("wine-count");

    const wineInstruction =
        get("wine-instruction");

    const wineGlasses =
        document.querySelectorAll(
            ".wine-glass"
        );


    let wineClicks = 0;

    let glassesReady = false;

    let endingStarted = false;


    bottle.addEventListener(
        "click",
        function () {

            if (
                glassesReady ||
                endingStarted
            ) {
                return;
            }


            if (wineClicks >= 5) {
                return;
            }


            wineClicks++;


            playSound(
                wineSound,
                0.5
            );


            /*

                BOTTLE DECREASES
                20% EACH CLICK

            */

            const bottleRemaining =
                100 -
                (wineClicks * 20);


            bottleWine.style.height =
                bottleRemaining + "%";


            /*

                BOTH GLASSES
                FILL TOGETHER

            */

            const glassFill =
                wineClicks * 20;


            glassLiquidOne.style.height =
                glassFill + "%";

            glassLiquidTwo.style.height =
                glassFill + "%";


            wineCount.textContent =
                wineClicks;


            /* TEXT */

            if (wineClicks < 5) {

                const remaining =
                    5 - wineClicks;

                wineInstruction.textContent =
                    remaining +
                    " more pour" +
                    (
                        remaining === 1
                            ? ""
                            : "s"
                    ) +
                    "... 🍷";

            }


            /* LAST POUR */

            if (wineClicks === 5) {

                glassesReady = true;


                wineInstruction.textContent =
                    "Perfect. Now, birthday girl... bottoms up. 🍷❤️";

            }

        }
    );


    /* =====================================================
       GLASS CLICK
    ====================================================== */

    wineGlasses.forEach(
        function (glass) {

            glass.addEventListener(
                "click",
                function () {

                    if (
                        !glassesReady ||
                        endingStarted
                    ) {
                        return;
                    }


                    endWineSequence();

                }
            );

        }
    );


    /* =====================================================
       WINE ENDING
    ====================================================== */

    function endWineSequence() {

        endingStarted = true;


        playSound(
            glassSound,
            0.7
        );


        /*

            BOTH GLASSES EMPTY
            SIMULTANEOUSLY

        */

        glassLiquidOne.style.height =
            "0%";

        glassLiquidTwo.style.height =
            "0%";


        /*

            SMALL GLASS MOVEMENT

        */

        document
            .querySelectorAll(
                ".wine-glass"
            )
            .forEach(
                function (glass) {

                    glass.animate(
                        [
                            {
                                transform:
                                    "rotate(0deg)"
                            },
                            {
                                transform:
                                    "rotate(-8deg)"
                            },
                            {
                                transform:
                                    "rotate(8deg)"
                            },
                            {
                                transform:
                                    "rotate(0deg)"
                            }
                        ],
                        {
                            duration: 800,
                            easing: "ease-in-out"
                        }
                    );

                }
            );


        wineInstruction.textContent =
            "Oh no... 🥴";


        /*

            WAIT BEFORE DIZZY EFFECT

        */

        setTimeout(
            function () {

                startDrunkEffect();

            },
            900
        );

    }


    /* =====================================================
       DRUNK EFFECT
    ====================================================== */

    function startDrunkEffect() {

        const overlay =
            get("drunk-overlay");

        const popup =
            get("drunk-popup");


        overlay.classList.add(
            "active"
        );


        /*

            MAKE PAGE SWAY

        */

        document
            .querySelectorAll(
                ".page-section.active > *:not(.drunk-popup)"
            )
            .forEach(
                function (element) {

                    element.animate(
                        [
                            {
                                transform:
                                    "rotate(0deg)"
                            },
                            {
                                transform:
                                    "rotate(2deg)"
                            },
                            {
                                transform:
                                    "rotate(-2deg)"
                            },
                            {
                                transform:
                                    "rotate(1deg)"
                            }
                        ],
                        {
                            duration: 2200,
                            iterations: 2,
                            easing:
                                "ease-in-out"
                        }
                    );

                }
            );


        /*

            SCREEN FADES AND
            POPUP APPEARS

        */

        setTimeout(
            function () {

                popup.classList.add(
                    "show"
                );

            },
            3200
        );

    }


    /* =====================================================
       PAGE 4
    ====================================================== */

    get("page4-button")
        .addEventListener(
            "click",
            function () {

                window.location.href =
                    "page4.html";

            }
        );

});
