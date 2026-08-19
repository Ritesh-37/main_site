document.addEventListener("DOMContentLoaded", function () {

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
            console.log("Audio error:", error);
        }
    }


    /* =====================================================
       AUDIO
    ===================================================== */

    const music = get("birthday-music");
    const musicButton = get("music-button");

    const cameraSound = get("camera-sound");
    const pourSound = get("pour-sound");
    const glassSound = get("glass-sound");


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

        setTimeout(function () {

            const target = get(id);

            if (target) {
                target.classList.add("active");
            }

        }, 100);
    }


    /* =====================================================
       START MUSIC AFTER USER INTERACTION
    ===================================================== */

    document.addEventListener(
        "click",
        function () {
            startMusic();
        },
        {
            once: true
        }
    );


    /* =====================================================
       PHOTO INTRO POPUPS
    ===================================================== */

    const introButtons =
        document.querySelectorAll(".intro-next");


    introButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const next =
                    button.getAttribute("data-next");

                document
                    .querySelectorAll(".intro-popup")
                    .forEach(function (popup) {

                        popup.classList.remove("active");

                    });

                setTimeout(function () {

                    const nextPopup =
                        get("photo-popup-" + next);

                    if (nextPopup) {
                        nextPopup.classList.add("active");
                    }

                }, 100);

            }
        );

    });


    /* =====================================================
       SHOW CAMERA
    ===================================================== */

    get("show-camera")
        .addEventListener(
            "click",
            function () {

                document
                    .querySelectorAll(".intro-popup")
                    .forEach(function (popup) {

                        popup.classList.remove("active");

                    });

                get("camera-area")
                    .classList.add("show");

                startMusic();

            }
        );


    /* =====================================================
       CAMERA COUNTDOWN
    ===================================================== */

    const camera =
        get("camera");

    const countdownOverlay =
        get("countdown-overlay");

    const countdownNumber =
        get("countdown-number");

    const cameraFlash =
        get("camera-flash");

    const photoResult =
        get("photo-result");


    let cameraBusy = false;


    camera.addEventListener(
        "click",
        function () {

            if (cameraBusy) {
                return;
            }

            cameraBusy = true;

            runCountdown();

        }
    );


    function runCountdown() {

        countdownOverlay.classList.add("show");

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
                "countdownPulse 1s ease";


            if (index < numbers.length - 1) {

                setTimeout(function () {

                    index++;

                    showNumber();

                }, 1000);

            } else {

                setTimeout(function () {

                    countdownOverlay.classList.remove(
                        "show"
                    );

                    takePhotograph();

                }, 1000);

            }

        }


        showNumber();

    }


    /* =====================================================
       TAKE PHOTOGRAPH
    ===================================================== */

    function takePhotograph() {

        playSound(
            cameraSound,
            0.65
        );


        /* BIG FLASH */

        cameraFlash.classList.remove("flash");

        void cameraFlash.offsetWidth;

        cameraFlash.classList.add("flash");


        /* PHOTO */

        setTimeout(function () {

            photoResult.classList.add("show");

        }, 500);


        /* CAMERA SHUTTER EFFECT */

        camera.style.transform =
            "scale(0.94)";

        setTimeout(function () {

            camera.style.transform =
                "";

        }, 180);

    }


    /* =====================================================
       CONTINUE FROM PHOTO
    ===================================================== */

    get("photo-continue")
        .addEventListener(
            "click",
            function () {

                photoResult.classList.remove(
                    "show"
                );

                setTimeout(function () {

                    showSection(
                        "bouquet-section"
                    );

                }, 300);

            }
        );


    /* =====================================================
       BOUQUET
    ===================================================== */

    const bouquet =
        get("bouquet");

    const bouquetButton =
        get("bouquet-button");

    const bouquetMessage =
        get("bouquet-message");

    const letterButton =
        get("letter-button");


    bouquetButton.addEventListener(
        "click",
        function () {

            bouquet.classList.remove("active");

            void bouquet.offsetWidth;

            bouquet.classList.add("active");

            bouquetMessage.classList.add("show");

            createHeartParticles(
                window.innerWidth / 2,
                window.innerHeight / 2,
                16
            );


            setTimeout(function () {

                letterButton.classList.add(
                    "show"
                );

            }, 800);

        }
    );


    /* =====================================================
       LETTER SECTION
    ===================================================== */

    letterButton.addEventListener(
        "click",
        function () {

            showSection(
                "letter-section"
            );

        }
    );


    /* =====================================================
       ENVELOPE
    ===================================================== */

    const envelope =
        get("envelope");

    const envelopeInstruction =
        get("envelope-instruction");

    const letter =
        get("letter");

    const letterHeartArea =
        get("letter-heart-area");


    envelope.addEventListener(
        "click",
        function () {

            if (
                envelope.classList.contains(
                    "open"
                )
            ) {
                return;
            }

            envelope.classList.add("open");

            envelopeInstruction.textContent =
                "Opening something special for you... ❤️";


            setTimeout(function () {

                letter.classList.add("show");

            }, 600);


            setTimeout(function () {

                letterHeartArea.classList.add(
                    "show"
                );

            }, 1800);

        }
    );


    /* =====================================================
       HEART
    ===================================================== */

    const heartButton =
        get("heart-button");

    const heartMessage =
        get("heart-message");

    const wineButton =
        get("wine-button");


    heartButton.addEventListener(
        "click",
        function () {

            heartButton.classList.remove("beat");

            void heartButton.offsetWidth;

            heartButton.classList.add("beat");

            heartMessage.classList.add(
                "show"
            );


            createHeartParticles(
                window.innerWidth / 2,
                window.innerHeight / 2,
                25
            );


            setTimeout(function () {

                wineButton.style.opacity =
                    "1";

            }, 500);

        }
    );


    /* =====================================================
       HEART PARTICLES
    ===================================================== */

    function createHeartParticles(
        x,
        y,
        amount
    ) {

        const symbols = [
            "♥",
            "✦",
            "✧",
            "✨"
        ];


        for (
            let i = 0;
            i < amount;
            i++
        ) {

            const particle =
                document.createElement(
                    "div"
                );

            particle.className =
                "love-particle";

            particle.textContent =
                symbols[
                    Math.floor(
                        Math.random() *
                        symbols.length
                    )
                ];


            particle.style.left =
                x + "px";

            particle.style.top =
                y + "px";


            particle.style.setProperty(
                "--x",
                (
                    Math.random() - 0.5
                ) * 250 + "px"
            );

            particle.style.setProperty(
                "--y",
                -(
                    50 +
                    Math.random() * 220
                ) + "px"
            );


            document.body.appendChild(
                particle
            );


            setTimeout(function () {

                particle.remove();

            }, 1400);

        }

    }


    /* =====================================================
       ENTER WINE
    ===================================================== */

    wineButton.addEventListener(
        "click",
        function () {

            letter.classList.remove(
                "show"
            );

            letterHeartArea.classList.remove(
                "show"
            );

            setTimeout(function () {

                showSection(
                    "wine-section"
                );

            }, 300);

        }
    );


    /* =====================================================
       WINE SYSTEM
    ===================================================== */

    const wineBottle =
        get("wine-bottle");

    const wineInstruction =
        get("wine-instruction");

    const wineCounter =
        get("wine-counter");

    const leftLiquid =
        get("left-liquid");

    const rightLiquid =
        get("right-liquid");

    const glasses =
        document.querySelectorAll(
            ".wine-glass"
        );


    let bottleClicks = 0;

    let bottleEmpty = false;

    let glassesEmpty = false;


    /* =====================================================
       BOTTLE CLICK
    ===================================================== */

    wineBottle.addEventListener(
        "click",
        function () {

            if (bottleEmpty) {
                return;
            }

            bottleClicks++;


            /* BOTTLE ANIMATION */

            wineBottle.classList.remove(
                "pour"
            );

            void wineBottle.offsetWidth;

            wineBottle.classList.add(
                "pour"
            );


            /* SOUND */

            playSound(
                pourSound,
                0.45
            );


            /* BOTTLE LIQUID */

            const remainingPercent =
                Math.max(
                    0,
                    100 -
                    bottleClicks * 20
                );


            document
                .querySelector(
                    ".wine-liquid"
                )
                .style.height =
                    remainingPercent + "%";


            /* GLASSES FILL */

            const glassPercent =
                Math.min(
                    100,
                    bottleClicks * 20
                );


            leftLiquid.style.height =
                glassPercent + "%";

            rightLiquid.style.height =
                glassPercent + "%";


            /* COUNTER */

            wineCounter.textContent =
                bottleClicks +
                " / 5";


            if (
                bottleClicks < 5
            ) {

                wineInstruction.textContent =
                    "Another little pour... 🍷";

            } else {

                bottleEmpty = true;

                wineInstruction.textContent =
                    "Both glasses are ready... 🥂";

            }

        }
    );


    /* =====================================================
       GLASS CLICK
    ===================================================== */

    glasses.forEach(function (glass) {

        glass.addEventListener(
            "click",
            function () {

                if (
                    !bottleEmpty ||
                    glassesEmpty
                ) {
                    return;
                }


                glassesEmpty = true;


                /* GLASS ANIMATION */

                glasses.forEach(
                    function (item) {

                        item.classList.remove(
                            "clink"
                        );

                        void item.offsetWidth;

                        item.classList.add(
                            "clink"
                        );

                    }
                );


                /* SOUND */

                playSound(
                    glassSound,
                    0.6
                );


                /* EMPTY BOTH */

                leftLiquid.style.height =
                    "0%";

                rightLiquid.style.height =
                    "0%";


                wineInstruction.textContent =
                    "Ummm... sweetheart? 👀";


                createHeartParticles(
                    window.innerWidth / 2,
                    window.innerHeight / 2,
                    12
                );


                /* START ENDING */

                setTimeout(function () {

                    startDizzyEnding();

                }, 900);

            }
        );

    });


    /* =====================================================
       DIZZY ENDING
    ===================================================== */

    const dizzyOverlay =
        get("dizzy-overlay");


    function startDizzyEnding() {

        dizzyOverlay.classList.add(
            "show"
        );

    }


    /* =====================================================
       NEXT PAGE
    ===================================================== */

    get("next-page")
        .addEventListener(
            "click",
            function () {

                /*
                    CHANGE THIS TO YOUR NEXT
                    PAGE FILE NAME.
                */

                window.location.href =
                    "page4.html";

            }
        );

});
