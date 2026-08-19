document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       HELPERS
    ====================================================== */

    function get(id) {
        return document.getElementById(id);
    }


    /* =====================================================
       AUDIO
    ====================================================== */

    const music = get("birthday-music");
    const musicButton = get("music-button");


    function startMusic() {

        if (!music) {
            return;
        }

        music.volume = 0.35;

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


    if (musicButton) {

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

    }


    /* =====================================================
       SECTION SWITCH
    ====================================================== */

    function showSection(id) {

        const sections =
            document.querySelectorAll(
                ".page-section"
            );

        sections.forEach(function (section) {

            section.classList.remove("active");

        });


        const target = get(id);

        if (!target) {
            return;
        }


        setTimeout(function () {

            target.classList.add("active");

        }, 100);

    }


    /* =====================================================
       CAMERA INTRO
    ====================================================== */

    const cameraIntroButton =
        get("camera-intro-button");

    const cameraArea =
        get("camera-area");


    if (cameraIntroButton) {

        cameraIntroButton.addEventListener(
            "click",
            function () {

                cameraIntroButton.style.display =
                    "none";

                setTimeout(function () {

                    cameraArea.classList.remove(
                        "hidden"
                    );

                    cameraArea.animate(
                        [
                            {
                                opacity: 0,
                                transform:
                                    "translateY(30px) scale(.95)"
                            },
                            {
                                opacity: 1,
                                transform:
                                    "translateY(0) scale(1)"
                            }
                        ],
                        {
                            duration: 700,
                            easing: "ease-out"
                        }
                    );

                }, 250);

                startMusic();

            }
        );

    }


    /* =====================================================
       CAMERA
    ====================================================== */

    const camera =
        get("camera");

    const countdownOverlay =
        get("countdown-overlay");

    const countdownNumber =
        get("countdown-number");

    const photoFlash =
        get("photo-flash");

    const photoPopup =
        get("photo-popup");

    const photoContinue =
        get("photo-continue");

    let cameraBusy = false;


    function takePhotograph() {

        if (cameraBusy) {
            return;
        }

        cameraBusy = true;

        countdownOverlay.classList.add(
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
                "countdownPop 0.9s ease forwards";


            index++;


            if (index < numbers.length) {

                setTimeout(
                    showNumber,
                    900
                );

            } else {

                setTimeout(
                    photographFlash,
                    900
                );

            }

        }


        showNumber();

    }


    function photographFlash() {

        countdownOverlay.classList.remove(
            "active"
        );


        /* BIG FLASH */

        photoFlash.classList.add(
            "active"
        );


        /* Camera shake */

        camera.animate(
            [
                {
                    transform:
                        "translateX(0)"
                },
                {
                    transform:
                        "translateX(-8px)"
                },
                {
                    transform:
                        "translateX(8px)"
                },
                {
                    transform:
                        "translateX(-5px)"
                },
                {
                    transform:
                        "translateX(5px)"
                },
                {
                    transform:
                        "translateX(0)"
                }
            ],
            {
                duration: 450,
                easing: "ease-out"
            }
        );


        setTimeout(function () {

            photoFlash.classList.remove(
                "active"
            );

            photoPopup.classList.add(
                "show"
            );

        }, 700);

    }


    if (camera) {

        camera.addEventListener(
            "click",
            takePhotograph
        );


        camera.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    takePhotograph();

                }

            }
        );

    }


    /* =====================================================
       PHOTO → LETTER
    ====================================================== */

    if (photoContinue) {

        photoContinue.addEventListener(
            "click",
            function () {

                photoPopup.classList.remove(
                    "show"
                );

                showSection(
                    "letter-section"
                );

            }
        );

    }


    /* =====================================================
       BOUQUET
    ====================================================== */

    const bouquet =
        get("bouquet");


    if (bouquet) {

        bouquet.addEventListener(
            "click",
            function () {

                bouquet.animate(
                    [
                        {
                            transform:
                                "scale(1)"
                        },
                        {
                            transform:
                                "scale(1.08) rotate(-2deg)"
                        },
                        {
                            transform:
                                "scale(1) rotate(0deg)"
                        }
                    ],
                    {
                        duration: 550,
                        easing: "ease-out"
                    }
                );

            }
        );

    }


    /* =====================================================
       ENVELOPE
    ====================================================== */

    const envelope =
        get("envelope");

    const letterButton =
        get("letter-button");


    function openLetter() {

        if (!envelope) {
            return;
        }

        envelope.classList.toggle(
            "open"
        );


        if (
            envelope.classList.contains(
                "open"
            )
        ) {

            if (letterButton) {

                letterButton.textContent =
                    "CLOSE LETTER ❤️";

            }

        } else {

            if (letterButton) {

                letterButton.textContent =
                    "OPEN YOUR LETTER 💌";

            }

        }

    }


    if (envelope) {

        envelope.addEventListener(
            "click",
            openLetter
        );

    }


    if (letterButton) {

        letterButton.addEventListener(
            "click",
            openLetter
        );

    }


    /* =====================================================
       AFTER LETTER
    ====================================================== */

    if (letterButton) {

        let firstClick = true;

        letterButton.addEventListener(
            "click",
            function () {

                if (
                    envelope.classList.contains(
                        "open"
                    ) &&
                    firstClick
                ) {

                    firstClick = false;

                    setTimeout(
                        function () {

                            letterButton.textContent =
                                "LET'S HAVE A DRINK 🍷";

                        },
                        800
                    );

                } else if (
                    !envelope.classList.contains(
                        "open"
                    )
                ) {

                    firstClick = true;

                }

            }
        );

    }


    /*
       Clicking the bouquet after reading the letter
       moves forward.
    */

    if (bouquet) {

        bouquet.addEventListener(
            "dblclick",
            function () {

                showSection(
                    "wine-section"
                );

            }
        );

    }


    /*
       Convenient transition:
       once the letter has been opened,
       clicking the button again after its text
       changes goes to wine.
    */

    let letterOpenedOnce = false;

    if (letterButton) {

        letterButton.addEventListener(
            "click",
            function () {

                if (
                    envelope.classList.contains(
                        "open"
                    )
                ) {

                    if (!letterOpenedOnce) {

                        letterOpenedOnce = true;

                    } else {

                        setTimeout(
                            function () {

                                showSection(
                                    "wine-section"
                                );

                            },
                            350
                        );

                    }

                }

            }
        );

    }


    /* =====================================================
       WINE
    ====================================================== */

    const bottle =
        get("wine-bottle");

    const liquidOne =
        get("wine-liquid-one");

    const liquidTwo =
        get("wine-liquid-two");

    const wineInstruction =
        get("wine-instruction");

    const progressDots =
        document.querySelectorAll(
            ".progress-dot"
        );

    const drunkOverlay =
        get("drunk-overlay");

    const nextPageButton =
        get("next-page-button");


    let pours = 0;

    const maximumPours = 5;

    let glassesFilled = false;

    let wineFinished = false;


    function updateProgress() {

        progressDots.forEach(
            function (dot, index) {

                dot.classList.remove(
                    "active"
                );

                if (index < pours) {

                    dot.classList.add(
                        "active"
                    );

                }

            }
        );

    }


    function pourWine() {

        if (wineFinished) {
            return;
        }


        if (glassesFilled) {

            wineInstruction.textContent =
                "The glasses are full... tap either glass. 🍷";

            return;
        }


        if (pours >= maximumPours) {
            return;
        }


        pours++;


        const percentage =
            pours * 20;


        /*
            Bottle visually empties
        */

        const bottleBody =
            bottle.querySelector(
                ".bottle-body"
            );


        if (bottleBody) {

            bottleBody.style.opacity =
                String(
                    1 - (pours * 0.07)
                );

        }


        /*
            Both glasses fill together
        */

        liquidOne.style.height =
            percentage + "%";

        liquidTwo.style.height =
            percentage + "%";


        updateProgress();


        /*
            Bottle reaches final empty state
        */

        if (pours === maximumPours) {

            glassesFilled = true;

            wineInstruction.textContent =
                "Perfect. Now take a sip... 🍷";

        } else {

            const remaining =
                maximumPours - pours;

            wineInstruction.textContent =
                remaining +
                (
                    remaining === 1
                        ? " pour"
                        : " pours"
                ) +
                " left...";

        }

    }


    function emptyGlasses() {

        if (!glassesFilled) {

            wineInstruction.textContent =
                "Pour the wine first, sweetheart. 🍷";

            return;
        }


        liquidOne.style.height =
            "0%";

        liquidTwo.style.height =
            "0%";


        wineInstruction.textContent =
            "Oh no... somebody finished it. 😂";


        setTimeout(
            finishWineScene,
            700
        );

    }


    if (bottle) {

        bottle.addEventListener(
            "click",
            pourWine
        );


        bottle.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    pourWine();

                }

            }
        );

    }


    const glasses =
        document.querySelectorAll(
            ".wine-glass"
        );


    glasses.forEach(
        function (glass) {

            glass.addEventListener(
                "click",
                emptyGlasses
            );

        }
    );


    /* =====================================================
       DRUNK ENDING
    ====================================================== */

    function finishWineScene() {

        if (wineFinished) {
            return;
        }

        wineFinished = true;


        /*
            Fade everything
        */

        const wineSection =
            get("wine-section");


        wineSection.animate(
            [
                {
                    filter:
                        "blur(0px)",
                    opacity: 1
                },
                {
                    filter:
                        "blur(5px)",
                    opacity: 0.7
                },
                {
                    filter:
                        "blur(10px)",
                    opacity: 0.35
                }
            ],
            {
                duration: 1400,
                easing: "ease-in-out"
            }
        );


        /*
            Show drunk overlay
        */

        setTimeout(
            function () {

                drunkOverlay.classList.add(
                    "show"
                );

            },
            900
        );

    }


    /* =====================================================
       NEXT PAGE
    ====================================================== */

    if (nextPageButton) {

        nextPageButton.addEventListener(
            "click",
            function () {

                window.location.href =
                    "page4.html";

            }
        );

    }

});
