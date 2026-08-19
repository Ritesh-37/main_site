document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       ELEMENTS
    ========================================== */

    const loadingScreen =
        document.getElementById("loading-screen");

    const giftScreen =
        document.getElementById("gift-screen");

    const entranceScreen =
        document.getElementById("entrance-screen");

    const passwordScreen =
        document.getElementById("password-screen");

    const envelope =
        document.getElementById("envelope");

    const openGiftButton =
        document.getElementById("open-gift-btn");

    const curiousButton =
        document.getElementById("curious-btn");

    const passwordInput =
        document.getElementById("password-input");

    const unlockButton =
        document.getElementById("unlock-btn");

    const wrongPopup =
        document.getElementById("wrong-popup");

    const tryAgainButton =
        document.getElementById("try-again-btn");

    const successPopup =
        document.getElementById("success-popup");

    const continueButton =
        document.getElementById("continue-btn");

    const backgroundMusic =
        document.getElementById("background-music");

    const musicControl =
        document.getElementById("music-control");

    const confettiLayer =
        document.getElementById("confetti-layer");


    /* =========================================
       PASSWORD
    ========================================== */

    const correctPassword = "0309";


    /* =========================================
       LOADING
    ========================================== */

    setTimeout(function () {

        if (loadingScreen) {
            loadingScreen.classList.add("hide");
        }

    }, 1500);


    /* =========================================
       SCREEN TRANSITION
    ========================================== */

    function showScreen(screenToShow) {

        const screens = [
            giftScreen,
            entranceScreen,
            passwordScreen
        ];

        screens.forEach(function (screen) {

            if (screen) {
                screen.classList.remove("active");
            }

        });

        setTimeout(function () {

            if (screenToShow) {
                screenToShow.classList.add("active");
            }

        }, 120);

    }


    /* =========================================
       MUSIC
    ========================================== */

    function startMusic() {

        if (!backgroundMusic) {
            return;
        }

        backgroundMusic.volume = 0.32;

        const playPromise =
            backgroundMusic.play();

        if (playPromise !== undefined) {

            playPromise
                .then(function () {

                    if (musicControl) {

                        musicControl.classList.add(
                            "visible"
                        );

                        musicControl.classList.remove(
                            "muted"
                        );

                    }

                })
                .catch(function () {

                    if (musicControl) {

                        musicControl.classList.add(
                            "visible"
                        );

                        musicControl.classList.add(
                            "muted"
                        );

                    }

                });
        }

    }


    /* =========================================
       MUSIC BUTTON
    ========================================== */

    if (musicControl) {

        musicControl.addEventListener(
            "click",
            function () {

                if (!backgroundMusic) {
                    return;
                }

                if (backgroundMusic.paused) {

                    backgroundMusic
                        .play()
                        .then(function () {

                            musicControl.classList
                                .remove("muted");

                        })
                        .catch(function () {

                            musicControl.classList
                                .add("muted");

                        });

                } else {

                    backgroundMusic.pause();

                    musicControl.classList
                        .add("muted");

                }

            }
        );

    }


    /* =========================================
       CONFETTI
    ========================================== */

    function createConfetti(amount) {

        if (!confettiLayer) {
            return;
        }

        for (let i = 0; i < amount; i++) {

            const piece =
                document.createElement("span");

            piece.className =
                "confetti-piece";

            const left =
                Math.random() * 100;

            const rotation =
                Math.random() * 360;

            const delay =
                Math.random() * 0.3;

            const sizes =
                5 + Math.random() * 5;

            piece.style.left =
                left + "%";

            piece.style.top =
                (Math.random() * 12) + "%";

            piece.style.width =
                sizes + "px";

            piece.style.height =
                (sizes * 1.5) + "px";

            piece.style.transform =
                "rotate(" + rotation + "deg)";

            piece.style.animationDelay =
                delay + "s";

            confettiLayer.appendChild(piece);

            setTimeout(function () {

                piece.remove();

            }, 2300);

        }

    }


    /* =========================================
       OPEN ENVELOPE
    ========================================== */

    function openGift() {

        if (!envelope) {
            return;
        }

        if (
            envelope.classList.contains(
                "opening"
            )
        ) {
            return;
        }

        envelope.classList.add("opening");

        if (openGiftButton) {
            openGiftButton.disabled = true;
        }

        createConfetti(28);

        startMusic();

        setTimeout(function () {

            showScreen(entranceScreen);

        }, 850);

    }


    if (openGiftButton) {

        openGiftButton.addEventListener(
            "click",
            openGift
        );

    }

    if (envelope) {

        envelope.addEventListener(
            "click",
            openGift
        );

    }


    /* =========================================
       ENTER ENTRANCE
    ========================================== */

    if (curiousButton) {

        curiousButton.addEventListener(
            "click",
            function () {

                showScreen(passwordScreen);

                setTimeout(function () {

                    if (passwordInput) {
                        passwordInput.focus();
                    }

                }, 700);

            }
        );

    }


    /* =========================================
       PASSWORD CHECK
    ========================================== */

    function checkPassword() {

        if (!passwordInput) {
            return;
        }

        const enteredPassword =
            passwordInput.value.trim();

        if (enteredPassword === correctPassword) {

            if (unlockButton) {

                unlockButton.disabled = true;

                unlockButton.textContent =
                    "CHECKING... 👀";

            }

            passwordInput.classList.add(
                "unlock-success"
            );

            createConfetti(35);

            setTimeout(function () {

                if (unlockButton) {

                    unlockButton.textContent =
                        "✓ IT'S HER! ❤️";

                }

            }, 600);

            setTimeout(function () {

                if (successPopup) {

                    successPopup.classList.add(
                        "show"
                    );

                }

            }, 1100);

        } else {

            passwordInput.value = "";

            if (wrongPopup) {

                wrongPopup.classList.add(
                    "show"
                );

            }

        }

    }


    if (unlockButton) {

        unlockButton.addEventListener(
            "click",
            checkPassword
        );

    }


    /* =========================================
       ENTER KEY
    ========================================== */

    if (passwordInput) {

        passwordInput.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Enter") {

                    checkPassword();

                }

            }
        );


        /* ONLY NUMBERS */

        passwordInput.addEventListener(
            "input",
            function () {

                passwordInput.value =
                    passwordInput.value.replace(
                        /\D/g,
                        ""
                    );

            }
        );

    }


    /* =========================================
       TRY AGAIN
    ========================================== */

    if (tryAgainButton) {

        tryAgainButton.addEventListener(
            "click",
            function () {

                if (wrongPopup) {

                    wrongPopup.classList.remove(
                        "show"
                    );

                }

                setTimeout(function () {

                    if (passwordInput) {

                        passwordInput.focus();

                    }

                }, 300);

            }
        );

    }


    /* =========================================
       CONTINUE TO PAGE 2
    ========================================== */

    if (continueButton) {

        continueButton.addEventListener(
            "click",
            function () {

                if (successPopup) {

                    successPopup.classList.remove(
                        "show"
                    );

                }

                createConfetti(45);

                setTimeout(function () {

                    /*
                     * IMPORTANT:
                     *
                     * Your second page must be named:
                     *
                     * page2.html
                     *
                     */

                    window.location.href =
                        "page2.html";

                }, 700);

            }
        );

    }


    /* =========================================
       CLOSE POPUPS
    ========================================== */

    if (wrongPopup) {

        wrongPopup.addEventListener(
            "click",
            function (event) {

                if (event.target === wrongPopup) {

                    wrongPopup.classList.remove(
                        "show"
                    );

                }

            }
        );

    }


    if (successPopup) {

        successPopup.addEventListener(
            "click",
            function (event) {

                if (event.target === successPopup) {

                    successPopup.classList.remove(
                        "show"
                    );

                }

            }
        );

    }


    /* =========================================
       CAMERA EASTER EGGS
    ========================================== */

    const cameras =
        document.querySelectorAll(".camera");

    cameras.forEach(function (camera) {

        camera.addEventListener(
            "click",
            function () {

                const message =
                    document.createElement("div");

                message.className =
                    "camera-message";

                const messages = [
                    "Caught you snooping 👀",
                    "Smile, birthday girl! 📸",
                    "Okayyy, that's cute 😂",
                    "This camera has seen things... 🤫",
                    "You found me! 🌸"
                ];

                const randomMessage =
                    messages[
                        Math.floor(
                            Math.random() *
                            messages.length
                        )
                    ];

                message.textContent =
                    randomMessage;

                const rect =
                    camera.getBoundingClientRect();

                message.style.left =
                    rect.left + "px";

                message.style.top =
                    (rect.top - 45) + "px";

                document.body.appendChild(
                    message
                );

                createConfetti(8);

                setTimeout(function () {

                    message.remove();

                }, 1800);

            }
        );

    });

});
