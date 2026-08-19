document.addEventListener(
    "DOMContentLoaded",
    function () {

        /* =====================================================
           HELPERS
        ====================================================== */

        function get(id) {
            return document.getElementById(id);
        }


        function showSection(id) {

            document
                .querySelectorAll(".page-section")
                .forEach(function (section) {

                    section.classList.remove("active");

                });

            setTimeout(function () {

                const section = get(id);

                if (section) {
                    section.classList.add("active");
                }

            }, 80);
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

                console.log(
                    "Audio error:",
                    error
                );

            }
        }


        /* =====================================================
           AUDIO
        ====================================================== */

        const cameraSound =
            get("camera-sound");

        const wineSound =
            get("wine-sound");

        const glassSound =
            get("glass-sound");


        /* =====================================================
           INTRO POPUPS
        ====================================================== */

        const introCards =
            document.querySelectorAll(
                ".intro-card"
            );

        let introIndex = 0;


        document
            .querySelectorAll(".intro-next")
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        introCards[
                            introIndex
                        ].classList.remove(
                            "active"
                        );

                        introIndex++;

                        setTimeout(
                            function () {

                                if (
                                    introCards[
                                        introIndex
                                    ]
                                ) {

                                    introCards[
                                        introIndex
                                    ].classList.add(
                                        "active"
                                    );

                                }

                            },
                            120
                        );

                    }
                );

            });


        /* =====================================================
           CAMERA START
        ====================================================== */

        get("start-camera")
            .addEventListener(
                "click",
                function () {

                    showSection(
                        "camera-section"
                    );

                }
            );


        /* =====================================================
           CAMERA COUNTDOWN
        ====================================================== */

        const camera =
            get("camera");

        const countdown =
            get("countdown");

        const countdownNumber =
            get("countdown-number");

        const flash =
            get("flash");

        const photoResult =
            get("photo-result");

        let cameraUsed = false;


        camera.addEventListener(
            "click",
            function () {

                if (cameraUsed) {
                    return;
                }

                cameraUsed = true;

                startCountdown();

            }
        );


        function startCountdown() {

            countdown.classList.add(
                "active"
            );

            const numbers = [
                "3",
                "2",
                "1"
            ];

            let index = 0;


            function showNumber() {

                countdownNumber.textContent =
                    numbers[index];

                countdownNumber.style.animation =
                    "none";

                void countdownNumber.offsetWidth;

                countdownNumber.style.animation =
                    "countdownPop .9s ease";


                if (index < numbers.length - 1) {

                    index++;

                    setTimeout(
                        showNumber,
                        900
                    );

                } else {

                    setTimeout(
                        takePhoto,
                        900
                    );

                }

            }


            showNumber();

        }


        /* =====================================================
           TAKE PHOTO
        ====================================================== */

        function takePhoto() {

            countdown.classList.remove(
                "active"
            );

            playSound(
                cameraSound,
                0.7
            );


            /* BIG FLASH */

            flash.classList.add(
                "active"
            );


            setTimeout(
                function () {

                    photoResult.classList.add(
                        "show"
                    );

                },
                400
            );


            setTimeout(
                function () {

                    flash.classList.remove(
                        "active"
                    );

                },
                900
            );

        }


        /* =====================================================
           PHOTO → BOUQUET
        ====================================================== */

        get("photo-continue")
            .addEventListener(
                "click",
                function () {

                    photoResult.classList.remove(
                        "show"
                    );

                    setTimeout(
                        function () {

                            showSection(
                                "bouquet-section"
                            );

                        },
                        300
                    );

                }
            );


        /* =====================================================
           BOUQUET
        ====================================================== */

        const bouquet =
            get("bouquet");

        const bouquetText =
            get("bouquet-text");

        let bouquetClicked = false;


        bouquet.addEventListener(
            "click",
            function () {

                if (bouquetClicked) {
                    return;
                }

                bouquetClicked = true;

                bouquet.classList.add(
                    "glowing"
                );


                bouquetText.textContent =
                    "For the prettiest girl I know... ❤️";


                createBouquetSparkles();


                setTimeout(
                    function () {

                        bouquetText.textContent =
                            "I have something else for you... ✦";

                    },
                    1700
                );


                setTimeout(
                    function () {

                        showSection(
                            "letter-section"
                        );

                    },
                    3000
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
                i < 22;
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
                    (
                        25 +
                        Math.random() * 50
                    ) + "%";

                sparkle.style.top =
                    (
                        25 +
                        Math.random() * 40
                    ) + "%";

                sparkle.style.fontSize =
                    (
                        12 +
                        Math.random() * 15
                    ) + "px";

                sparkle.style.color =
                    "#b52d51";

                sparkle.style.pointerEvents =
                    "none";

                sparkle.style.zIndex =
                    "300";

                document.body.appendChild(
                    sparkle
                );


                const x =
                    (
                        Math.random() - .5
                    ) * 180;

                const y =
                    -(
                        40 +
                        Math.random() * 140
                    );


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
                            1000 +
                            Math.random() * 700,

                        easing:
                            "ease-out"
                    }
                );


                setTimeout(
                    function () {

                        sparkle.remove();

                    },
                    1900
                );

            }

        }


        /* =====================================================
           ENVELOPE
        ====================================================== */

        const envelope =
            get("envelope");

        const postcard =
            get("postcard");

        const envelopeText =
            get("envelope-text");

        let envelopeOpened = false;


        envelope.addEventListener(
            "click",
            function () {

                if (envelopeOpened) {
                    return;
                }

                envelopeOpened = true;

                envelope.classList.add(
                    "open"
                );


                envelopeText.textContent =
                    "Open it... it's just for you. ❤️";


                setTimeout(
                    function () {

                        postcard.classList.add(
                            "show"
                        );

                    },
                    900
                );

            }
        );


        /* =====================================================
           POSTCARD → WINE
        ====================================================== */

        get("wine-continue")
            .addEventListener(
                "click",
                function () {

                    postcard.classList.remove(
                        "show"
                    );

                    envelope.classList.remove(
                        "open"
                    );

                    setTimeout(
                        function () {

                            showSection(
                                "wine-section"
                            );

                        },
                        400
                    );

                }
            );


        /* =====================================================
           WINE
        ====================================================== */

        const bottle =
            get("wine-bottle");

        const glasses =
            document.querySelectorAll(
                ".wine-glass"
            );

        const bottleLiquid =
            document.querySelector(
                ".bottle-liquid"
            );

        const glassWine =
            document.querySelectorAll(
                ".glass-wine"
            );

        const wineCounter =
            get("wine-counter");

        const wineInstruction =
            get("wine-instruction");


        let pourCount = 0;

        const maximumPours = 5;

        let glassesFilled = false;

        let wineFinished = false;


        /* =====================================================
           BOTTLE CLICK
        ====================================================== */

        bottle.addEventListener(
            "click",
            function () {

                if (wineFinished) {
                    return;
                }

                if (glassesFilled) {
                    wineInstruction.textContent =
                        "Now click either glass... 🍷";

                    return;
                }


                if (
                    pourCount >=
                    maximumPours
                ) {
                    return;
                }


                pourCount++;

                playSound(
                    wineSound,
                    0.55
                );


                /* BOTTLE LEVEL */

                const bottleLevel =
                    100 -
                    (
                        pourCount *
                        20
                    );

                bottleLiquid.style.height =
                    bottleLevel + "%";


                /* GLASSES FILL */

                const glassLevel =
                    pourCount * 20;

                glassWine.forEach(
                    function (wine) {

                        wine.style.height =
                            glassLevel + "%";

                    }
                );


                wineCounter.textContent =
                    "POUR " +
                    pourCount +
                    " / 5";


                if (
                    pourCount <
                    maximumPours
                ) {

                    wineInstruction.textContent =
                        "A little more... 🍷❤️";

                } else {

                    glassesFilled = true;

                    wineInstruction.textContent =
                        "Cheers, sweetheart... now drink. 🍷";

                    wineCounter.textContent =
                        "CHEERS ❤️";

                }

            }
        );


        /* =====================================================
           GLASS CLICK
        ====================================================== */

        glasses.forEach(
            function (glass) {

                glass.addEventListener(
                    "click",
                    function () {

                        if (wineFinished) {
                            return;
                        }


                        if (!glassesFilled) {

                            wineInstruction.textContent =
                                "Pour the wine first, sweetheart. ❤️";

                            return;

                        }


                        playSound(
                            glassSound,
                            0.65
                        );


                        /* EMPTY BOTH GLASSES */

                        glassWine.forEach(
                            function (wine) {

                                wine.style.height =
                                    "0%";

                            }
                        );


                        glassesFilled = false;


                        /*
                           THE BOTTLE IS NOW EMPTY
                           AND BOTH GLASSES ARE EMPTY.
                        */

                        if (
                            pourCount >=
                            maximumPours
                        ) {

                            wineFinished = true;

                            wineInstruction.textContent =
                                "Well... that was quick. 😂";

                            wineCounter.textContent =
                                "EMPTY";


                            setTimeout(
                                startDrunkEnding,
                                1000
                            );

                        }

                    }
                );

            }
        );


        /* =====================================================
           DRUNK ENDING
        ====================================================== */

        function startDrunkEnding() {

            const overlay =
                get("drunk-overlay");

            overlay.classList.add(
                "active"
            );


            /*
                Make the entire page
                slowly sway.
            */

            document.body.animate(
                [
                    {
                        transform:
                            "rotate(0deg) scale(1)"
                    },
                    {
                        transform:
                            "rotate(-1deg) scale(1.02)"
                    },
                    {
                        transform:
                            "rotate(1deg) scale(1.04)"
                    },
                    {
                        transform:
                            "rotate(-1deg) scale(1.06)"
                    },
                    {
                        transform:
                            "rotate(1deg) scale(1.08)"
                    },
                    {
                        transform:
                            "rotate(0deg) scale(1.1)"
                    }
                ],
                {
                    duration: 5000,
                    easing: "ease-in-out",
                    fill: "forwards"
                }
            );


            setTimeout(
                function () {

                    get("drunk-popup")
                        .classList.add(
                            "show"
                        );

                },
                4200
            );

        }


        /* =====================================================
           NEXT PAGE
        ====================================================== */

        get("next-page")
            .addEventListener(
                "click",
                function () {

                    window.location.href =
                        "page4.html";

                }
            );

    }
);
