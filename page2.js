document.addEventListener("DOMContentLoaded", function () {

    /* =========================================================
       ELEMENTS
    ========================================================= */

    const loadingScreen = document.getElementById("loading-screen");

    const giftScreen = document.getElementById("gift-screen");
    const entranceScreen = document.getElementById("entrance-screen");
    const passwordScreen = document.getElementById("password-screen");

    const envelope = document.getElementById("envelope");
    const openGiftButton = document.getElementById("open-gift-btn");
    const curiousButton = document.getElementById("curious-btn");

    const passwordInput = document.getElementById("password-input");
    const unlockButton = document.getElementById("unlock-btn");

    const wrongPopup = document.getElementById("wrong-popup");
    const tryAgainButton = document.getElementById("try-again-btn");

    const successPopup = document.getElementById("success-popup");
    const continueButton = document.getElementById("continue-btn");

    const backgroundMusic = document.getElementById("background-music");
    const musicControl = document.getElementById("music-control");

    const confettiLayer = document.getElementById("confetti-layer");


    /* =========================================================
       PASSWORD
    ========================================================= */

    const correctPassword = "0309";


    /* =========================================================
       AUDIO ENGINE
       
       Sound effects are generated directly by the browser.
       No separate sound-effect files are required.
    ========================================================= */

    let audioContext = null;
    let masterGain = null;
    let audioUnlocked = false;


    function initializeAudio() {

        if (audioContext) {
            return;
        }

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioContext) {
            return;
        }

        audioContext = new AudioContext();

        masterGain =
            audioContext.createGain();

        masterGain.gain.value = 0.55;

        masterGain.connect(
            audioContext.destination
        );
    }


    function unlockAudio() {

        initializeAudio();

        if (!audioContext) {
            return;
        }

        if (audioContext.state === "suspended") {

            audioContext.resume()
                .catch(function () {});

        }

        audioUnlocked = true;
    }


    /* =========================================================
       GENERIC TONE
    ========================================================= */

    function playTone(
        frequency,
        duration,
        volume,
        type,
        delay,
        endFrequency
    ) {

        if (!audioContext || !masterGain) {
            return;
        }

        const oscillator =
            audioContext.createOscillator();

        const gain =
            audioContext.createGain();

        const now =
            audioContext.currentTime +
            (delay || 0);

        oscillator.type =
            type || "sine";

        oscillator.frequency.setValueAtTime(
            frequency,
            now
        );

        if (endFrequency) {

            oscillator.frequency.exponentialRampToValueAtTime(
                Math.max(endFrequency, 20),
                now + duration
            );

        }

        gain.gain.setValueAtTime(
            0.0001,
            now
        );

        gain.gain.exponentialRampToValueAtTime(
            volume,
            now + 0.015
        );

        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            now + duration
        );

        oscillator.connect(gain);
        gain.connect(masterGain);

        oscillator.start(now);
        oscillator.stop(now + duration + 0.05);
    }


    /* =========================================================
       MAGICAL SPARKLE
    ========================================================= */

    function sparkleSound() {

        unlockAudio();

        playTone(
            880,
            0.18,
            0.08,
            "sine",
            0
        );

        playTone(
            1320,
            0.22,
            0.06,
            "sine",
            0.07
        );

        playTone(
            1760,
            0.28,
            0.045,
            "sine",
            0.14
        );
    }


    /* =========================================================
       BUTTON CLICK
    ========================================================= */

    function buttonSound() {

        unlockAudio();

        playTone(
            520,
            0.08,
            0.045,
            "sine",
            0,
            720
        );
    }


    /* =========================================================
       ENVELOPE OPENING
    ========================================================= */

    function envelopeSound() {

        unlockAudio();

        playTone(
            180,
            0.5,
            0.07,
            "sine",
            0,
            520
        );

        playTone(
            420,
            0.5,
            0.055,
            "sine",
            0.12,
            1050
        );

        playTone(
            880,
            0.4,
            0.045,
            "sine",
            0.25,
            1450
        );

        setTimeout(
            sparkleSound,
            280
        );
    }


    /* =========================================================
       SOFT PAGE TRANSITION
    ========================================================= */

    function transitionSound() {

        unlockAudio();

        playTone(
            220,
            0.7,
            0.055,
            "sine",
            0,
            880
        );

        playTone(
            440,
            0.6,
            0.04,
            "sine",
            0.15,
            1320
        );

        setTimeout(
            sparkleSound,
            350
        );
    }


    /* =========================================================
       WRONG PASSWORD
    ========================================================= */

    function wrongPasswordSound() {

        unlockAudio();

        playTone(
            420,
            0.15,
            0.07,
            "triangle",
            0,
            280
        );

        playTone(
            280,
            0.25,
            0.065,
            "triangle",
            0.13,
            180
        );
    }


    /* =========================================================
       PASSWORD TYPING
    ========================================================= */

    function typingSound() {

        unlockAudio();

        playTone(
            700,
            0.045,
            0.025,
            "sine",
            0
        );
    }


    /* =========================================================
       UNLOCK SUCCESS
    ========================================================= */

    function successSound() {

        unlockAudio();

        playTone(
            523,
            0.28,
            0.065,
            "sine",
            0
        );

        playTone(
            659,
            0.28,
            0.06,
            "sine",
            0.12
        );

        playTone(
            784,
            0.32,
            0.065,
            "sine",
            0.24
        );

        playTone(
            1046,
            0.5,
            0.055,
            "sine",
            0.38
        );

        setTimeout(
            sparkleSound,
            450
        );

        setTimeout(
            sparkleSound,
            700
        );
    }


    /* =========================================================
       CAMERA SHUTTER
    ========================================================= */

    function cameraSound() {

        unlockAudio();

        playTone(
            1200,
            0.055,
            0.065,
            "square",
            0
        );

        playTone(
            760,
            0.12,
            0.045,
            "sine",
            0.055
        );

        setTimeout(
            sparkleSound,
            100
        );
    }


    /* =========================================================
       CONFETTI CELEBRATION
    ========================================================= */

    function celebrationSound() {

        unlockAudio();

        const notes = [
            523,
            659,
            784,
            988,
            1174,
            1318
        ];

        notes.forEach(
            function (note, index) {

                playTone(
                    note,
                    0.22,
                    0.035,
                    "sine",
                    index * 0.07
                );

            }
        );
    }


    /* =========================================================
       LOADING SCREEN
    ========================================================= */

    setTimeout(function () {

        if (loadingScreen) {
            loadingScreen.classList.add("hide");
        }

        sparkleSound();

    }, 1500);


    /* =========================================================
       FIRST USER INTERACTION
       Unlock browser audio on Android/mobile.
    ========================================================= */

    document.addEventListener(
        "pointerdown",
        function () {

            unlockAudio();

        },
        {
            once: true,
            passive: true
        }
    );


    /* =========================================================
       SCREEN TRANSITION
    ========================================================= */

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


    /* =========================================================
       BACKGROUND MUSIC
    ========================================================= */

    function startMusic() {

        if (!backgroundMusic) {
            return;
        }

        unlockAudio();

        backgroundMusic.volume = 0.30;

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


    /* =========================================================
       MUSIC BUTTON
    ========================================================= */

    if (musicControl) {

        musicControl.addEventListener(
            "click",
            function () {

                unlockAudio();

                buttonSound();

                if (!backgroundMusic) {
                    return;
                }

                if (backgroundMusic.paused) {

                    backgroundMusic
                        .play()
                        .then(function () {

                            musicControl.classList.remove(
                                "muted"
                            );

                        })
                        .catch(function () {

                            musicControl.classList.add(
                                "muted"
                            );

                        });

                } else {

                    backgroundMusic.pause();

                    musicControl.classList.add(
                        "muted"
                    );

                }

            }
        );
    }


    /* =========================================================
       CONFETTI
    ========================================================= */

    function createConfetti(amount) {

        if (!confettiLayer) {
            return;
        }

        for (
            let i = 0;
            i < amount;
            i++
        ) {

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
                "rotate(" +
                rotation +
                "deg)";

            piece.style.animationDelay =
                delay + "s";

            confettiLayer.appendChild(piece);

            setTimeout(function () {

                piece.remove();

            }, 2300);
        }
    }


    /* =========================================================
       OPEN ENVELOPE
    ========================================================= */

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

        unlockAudio();

        envelope.classList.add(
            "opening"
        );

        if (openGiftButton) {
            openGiftButton.disabled = true;
        }

        envelopeSound();

        createConfetti(28);

        setTimeout(
            celebrationSound,
            300
        );

        startMusic();

        setTimeout(function () {

            showScreen(
                entranceScreen
            );

            sparkleSound();

        }, 850);
    }


    if (openGiftButton) {

        openGiftButton.addEventListener(
            "click",
            function () {

                buttonSound();

                openGift();

            }
        );
    }


    if (envelope) {

        envelope.addEventListener(
            "click",
            openGift
        );
    }


    /* =========================================================
       ENTRANCE → PASSWORD
    ========================================================= */

    if (curiousButton) {

        curiousButton.addEventListener(
            "click",
            function () {

                buttonSound();

                setTimeout(
                    transitionSound,
                    100
                );

                showScreen(
                    passwordScreen
                );

                setTimeout(function () {

                    if (passwordInput) {
                        passwordInput.focus();
                    }

                }, 700);

            }
        );
    }


    /* =========================================================
       PASSWORD CHECK
    ========================================================= */

    function checkPassword() {

        if (!passwordInput) {
            return;
        }

        unlockAudio();

        const enteredPassword =
            passwordInput.value.trim();


        /* =====================================
           CORRECT PASSWORD
        ===================================== */

        if (
            enteredPassword ===
            correctPassword
        ) {

            if (unlockButton) {

                unlockButton.disabled =
                    true;

                unlockButton.textContent =
                    "CHECKING... 👀";
            }

            passwordInput.classList.add(
                "unlock-success"
            );

            successSound();

            createConfetti(35);

            setTimeout(
                celebrationSound,
                450
            );

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

                sparkleSound();

            }, 1100);


        } else {

            /* =================================
               WRONG PASSWORD
            ================================= */

            wrongPasswordSound();

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
            function () {

                buttonSound();

                checkPassword();

            }
        );
    }


    /* =========================================================
       ENTER KEY
    ========================================================= */

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

                if (
                    passwordInput.value.length > 0
                ) {

                    typingSound();

                }

            }
        );
    }


    /* =========================================================
       TRY AGAIN
    ========================================================= */

    if (tryAgainButton) {

        tryAgainButton.addEventListener(
            "click",
            function () {

                buttonSound();

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


    /* =========================================================
       CONTINUE TO PAGE 2
    ========================================================= */

    if (continueButton) {

        continueButton.addEventListener(
            "click",
            function () {

                buttonSound();

                if (successPopup) {

                    successPopup.classList.remove(
                        "show"
                    );

                }

                createConfetti(45);

                transitionSound();

                setTimeout(function () {

                    /*
                     * PAGE 2
                     *
                     * Make sure the file is:
                     *
                     * page2.html
                     */

                    window.location.href =
                        "page2.html";

                }, 700);

            }
        );
    }


    /* =========================================================
       CLOSE WRONG POPUP
    ========================================================= */

    if (wrongPopup) {

        wrongPopup.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    wrongPopup
                ) {

                    wrongPopup.classList.remove(
                        "show"
                    );

                }

            }
        );
    }


    /* =========================================================
       CLOSE SUCCESS POPUP
    ========================================================= */

    if (successPopup) {

        successPopup.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    successPopup
                ) {

                    successPopup.classList.remove(
                        "show"
                    );

                }

            }
        );
    }


    /* =========================================================
       CAMERA EASTER EGGS
    ========================================================= */

    const cameras =
        document.querySelectorAll(
            ".camera"
        );

    cameras.forEach(
        function (camera) {

            camera.addEventListener(
                "click",
                function () {

                    unlockAudio();

                    cameraSound();

                    const message =
                        document.createElement(
                            "div"
                        );

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
                        (rect.top - 45) +
                        "px";

                    document.body.appendChild(
                        message
                    );

                    createConfetti(8);

                    setTimeout(
                        sparkleSound,
                        150
                    );

                    setTimeout(
                        function () {

                            message.remove();

                        },
                        1800
                    );

                }
            );
        }
    );


    /* =========================================================
       GENERAL BUTTON MICRO-SOUNDS
    ========================================================= */

    const allButtons =
        document.querySelectorAll(
            ".luxury-button"
        );

    allButtons.forEach(
        function (button) {

            button.addEventListener(
                "pointerdown",
                function () {

                    unlockAudio();

                },
                {
                    passive: true
                }
            );

        }
    );

});
