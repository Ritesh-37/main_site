document.addEventListener(
    "DOMContentLoaded",
    function () {

        /* =====================================================
           HELPERS
        ===================================================== */

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
                console.log(error);
            }
        }


        /* =====================================================
           AUDIO
        ===================================================== */

        const music = get("page3-music");
        const musicButton = get("music-button");

        const cameraSound = get("camera-sound");
        const wineSound = get("wine-pour-sound");
        const glassSound = get("glass-sound");


        function startMusic() {

            if (!music) {
                return;
            }

            music.volume = 0.32;

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
        ===================================================== */

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


            setTimeout(
                function () {

                    target.classList.add("active");

                },
                80
            );

        }


        /* =====================================================
           START MUSIC AFTER USER ENTERS PAGE
        ===================================================== */

        document.addEventListener(
            "click",
            function () {

                if (
                    music &&
                    music.paused
                ) {
                    startMusic();
                }

            },
            {
                once: true
            }
        );


        /* =====================================================
           CAMERA
        ===================================================== */

        const camera = get("camera");
        const countdown = get("countdown");
        const cameraFlash = get("camera-screen-flash");

        const photoPopup = get("photo-popup");
        const photoContinue = get("photo-continue");

        let cameraUsed = false;


        camera.addEventListener(
            "click",
            function () {

                if (cameraUsed) {
                    return;
                }

                cameraUsed = true;

                camera.style.pointerEvents = "none";

                get("camera-hint").style.opacity = "0";

                runCountdown();

            }
        );


        function runCountdown() {

            const numbers = [
                "3",
                "2",
                "1"
            ];

            let index = 0;


            function showNumber() {

                countdown.textContent =
                    numbers[index];

                countdown.classList.remove("show");

                void countdown.offsetWidth;

                countdown.classList.add("show");


                setTimeout(
                    function () {

                        index++;

                        if (
                            index <
                            numbers.length
                        ) {

                            showNumber();

                        } else {

                            takePicture();

                        }

                    },
                    1000
                );

            }


            showNumber();

        }


        function takePicture() {

            playSound(
                cameraSound,
                0.65
            );


            cameraFlash.classList.remove(
                "flash"
            );

            void cameraFlash.offsetWidth;

            cameraFlash.classList.add(
                "flash"
            );


            setTimeout(
                function () {

                    photoPopup.classList.add(
                        "show"
                    );

                },
                400
            );

        }


        photoContinue.addEventListener(
            "click",
            function () {

                photoPopup.classList.remove(
                    "show"
                );

                setTimeout(
                    function () {

                        showSection(
                            "bouquet-section"
                        );

                    },
                    500
                );

            }
        );


        /* =====================================================
           BOUQUET
        ===================================================== */

        const bouquet = get("bouquet");
        const envelope = get("letter-envelope");
        const letterHint = get("letter-hint");

        let bouquetOpened = false;


        bouquet.addEventListener(
            "click",
            function () {

                if (bouquetOpened) {
                    return;
                }

                bouquetOpened = true;

                bouquet.classList.add(
                    "open"
                );

                get("bouquet-hint").style.opacity =
                    "0";


                setTimeout(
                    function () {

                        envelope.classList.add(
                            "show"
                        );

                        letterHint.classList.add(
                            "show"
                        );

                    },
                    1000
                );

            }
        );


        /* =====================================================
           ENVELOPE
        ===================================================== */

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

                letterHint.classList.remove(
                    "show"
                );


                setTimeout(
                    function () {

                        showSection(
                            "letter-section"
                        );

                        setTimeout(
                            function () {

                                startLetter();

                            },
                            800
                        );

                    },
                    1200
                );

            }
        );


        /* =====================================================
           LETTER
        ===================================================== */

        const letterText = get("letter-text");
        const letterSignature =
            get("letter-signature");

        const letterContinue =
            get("letter-continue");


        const letterLines = [

            "There are some things I don't say often enough...",

            "You make ordinary days feel a little more beautiful.",

            "Somehow, somewhere along the way, you became such a special part of my life.",

            "And today, more than anything, I just want you to know how loved you are.",

            "I hope this new year of your life brings you everything your beautiful heart deserves.",

            "And if I get to be there beside you through it all...",

            "well, I think I'd call myself pretty lucky. ❤️"

        ];


        let letterStarted = false;


        function startLetter() {

            if (letterStarted) {
                return;
            }

            letterStarted = true;

            letterText.innerHTML = "";

            typeLetterLine(
                0
            );

        }


        function typeLetterLine(index) {

            if (
                index >=
                letterLines.length
            ) {

                setTimeout(
                    function () {

                        letterSignature.classList.add(
                            "show"
                        );

                        setTimeout(
                            function () {

                                letterContinue.classList.add(
                                    "show"
                                );

                            },
                            1000
                        );

                    },
                    700
                );

                return;
            }


            const paragraph =
                document.createElement(
                    "p"
                );

            paragraph.style.marginBottom =
                "16px";

            letterText.appendChild(
                paragraph
            );


            const text =
                letterLines[index];

            let character = 0;


            function typeCharacter() {

                if (
                    character <
                    text.length
                ) {

                    paragraph.textContent +=
                        text.charAt(
                            character
                        );

                    character++;

                    setTimeout(
                        typeCharacter,
                        25
                    );

                } else {

                    setTimeout(
                        function () {

                            typeLetterLine(
                                index + 1
                            );

                        },
                        350
                    );

                }

            }


            typeCharacter();

        }


        /* =====================================================
           LETTER → WINE
        ===================================================== */

        letterContinue.addEventListener(
            "click",
            function () {

                showSection(
                    "wine-section"
                );

            }
        );


        /* =====================================================
           WINE
        ===================================================== */

        const bottle =
            get("wine-bottle");

        const wineLevel =
            get("wine-level");

        const glassWine =
            get("glass-wine");

        const wineCount =
            get("wine-count");

        const dizzyOverlay =
            get("dizzy-overlay");

        const drunkPopup =
            get("drunk-popup");

        const nextPage =
            get("next-page");


        let wineClicks = 0;

        const totalClicks = 5;


        bottle.addEventListener(
            "click",
            function () {

                if (
                    wineClicks >=
                    totalClicks
                ) {
                    return;
                }


                wineClicks++;


                playSound(
                    wineSound,
                    0.5
                );


                /* =============================================
                   BOTTLE LEVEL
                ============================================== */

                const remaining =
                    100 -
                    (
                        wineClicks *
                        20
                    );


                wineLevel.style.height =
                    remaining + "%";


                /* =============================================
                   GLASS LEVEL
                ============================================== */

                const glassHeight =
                    wineClicks *
                    15;

                glassWine.style.height =
                    glassHeight + "px";


                /* =============================================
                   BOTTLE ANIMATION
                ============================================== */

                bottle.animate(
                    [
                        {
                            transform:
                                "rotate(0deg)"
                        },
                        {
                            transform:
                                "rotate(-12deg)"
                        },
                        {
                            transform:
                                "rotate(0deg)"
                        }
                    ],
                    {
                        duration: 650,
                        easing: "ease-in-out"
                    }
                );


                /* =============================================
                   TEXT
                ============================================== */

                if (
                    wineClicks <
                    totalClicks
                ) {

                    const remainingClicks =
                        totalClicks -
                        wineClicks;

                    wineCount.textContent =
                        remainingClicks +
                        (
                            remainingClicks === 1
                                ? " pour left..."
                                : " pours left..."
                        );

                } else {

                    wineCount.textContent =
                        "BOTTOMS UP... 🍷❤️";

                    finishWine();

                }

            }
        );


        /* =====================================================
           FINAL WINE
        ===================================================== */

        function finishWine() {

            bottle.style.pointerEvents =
                "none";


            setTimeout(
                function () {

                    playSound(
                        glassSound,
                        0.7
                    );

                    glassWine.animate(
                        [
                            {
                                transform:
                                    "scale(1)"
                            },
                            {
                                transform:
                                    "scale(1.12)"
                            },
                            {
                                transform:
                                    "scale(1)"
                            }
                        ],
                        {
                            duration: 500
                        }
                    );

                },
                500
            );


            setTimeout(
                function () {

                    dizzyOverlay.classList.add(
                        "active"
                    );

                },
                1100
            );


            setTimeout(
                function () {

                    drunkPopup.classList.add(
                        "show"
                    );

                },
                2600
            );

        }


        /* =====================================================
           NEXT PAGE
        ===================================================== */

        nextPage.addEventListener(
            "click",
            function () {

                window.location.href =
                    "page4.html";

            }
        );

    }
);
