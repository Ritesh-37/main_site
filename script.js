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

    const musicControl =
        document.getElementById("music-control");

    const confettiLayer =
        document.getElementById("confetti-layer");


    /* =========================================
       PASSWORD
    ========================================== */

    const correctPassword = "0309";


    /* =========================================
       LOADING SCREEN
    ========================================== */

    setTimeout(function () {

        if (loadingScreen) {

            loadingScreen.classList.add(
                "hide"
            );

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

                screen.classList.remove(
                    "active"
                );

            }

        });


        setTimeout(function () {

            if (screenToShow) {

                screenToShow.classList.add(
                    "active"
                );

            }

        }, 120);

    }


    /* =========================================
       CODED BACKGROUND MUSIC
       NO MP3 REQUIRED
    ========================================== */

    let audioContext = null;

    let masterGain = null;

    let musicStarted = false;

    let musicTimer = null;

    let musicMuted = false;


    /* =========================================
       START BACKGROUND MUSIC
    ========================================== */

    function startMusic() {

        /*
         * IMPORTANT:
         * Prevent music from restarting.
         */

        if (musicStarted) {

            return;

        }


        musicStarted = true;


        try {

            const AudioContext =
                window.AudioContext ||
                window.webkitAudioContext;


            if (!AudioContext) {

                console.log(
                    "Web Audio API not supported."
                );

                return;

            }


            audioContext =
                new AudioContext();


            masterGain =
                audioContext.createGain();


            /*
             * VERY LOW VOLUME.
             *
             * This keeps the music
             * in the background.
             */

            masterGain.gain.value =
                0.055;


            masterGain.connect(
                audioContext.destination
            );


            /*
             * Mobile browsers may suspend
             * the audio context.
             */

            if (
                audioContext.state ===
                "suspended"
            ) {

                audioContext.resume();

            }


            playBirthdayMusic();


            if (musicControl) {

                musicControl.classList.add(
                    "visible"
                );

                musicControl.classList.remove(
                    "muted"
                );

            }

        } catch (error) {

            console.log(
                "Could not start coded music.",
                error
            );

        }

    }


    /* =========================================
       PLAY ONE SOFT NOTE
    ========================================== */

    function playNote(
        frequency,
        duration,
        startTime,
        volume
    ) {

        if (
            !audioContext ||
            !masterGain ||
            musicMuted
        ) {

            return;

        }


        const oscillator =
            audioContext.createOscillator();


        const gain =
            audioContext.createGain();


        /*
         * Sine wave creates a soft,
         * smooth sound.
         */

        oscillator.type =
            "sine";


        oscillator.frequency.value =
            frequency;


        /*
         * Gentle fade-in.
         */

        gain.gain.setValueAtTime(
            0,
            startTime
        );


        gain.gain.linearRampToValueAtTime(
            volume,
            startTime + 0.08
        );


        /*
         * Gentle fade-out.
         */

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            startTime + duration
        );


        oscillator.connect(gain);

        gain.connect(masterGain);


        oscillator.start(
            startTime
        );


        oscillator.stop(
            startTime +
            duration +
            0.05
        );

    }


    /* =========================================
       CUTE ROMANTIC BIRTHDAY MELODY
    ========================================== */

    function playBirthdayMusic() {

        if (
            !audioContext ||
            musicMuted
        ) {

            return;

        }


        const now =
            audioContext.currentTime;


        /*
         * Main melody.
         *
         * Soft romantic sequence:
         *
         * C D E G
         * E D C
         * A C E
         * G E D
         */

        const melody = [

            [261.63, 0.55],

            [293.66, 0.55],

            [329.63, 0.75],

            [392.00, 0.85],

            [329.63, 0.55],

            [293.66, 0.55],

            [261.63, 0.90],

            [220.00, 0.55],

            [261.63, 0.55],

            [329.63, 0.80],

            [392.00, 0.60],

            [329.63, 0.60],

            [293.66, 0.90]

        ];


        let position =
            now + 0.15;


        melody.forEach(function (note) {

            playNote(
                note[0],
                note[1],
                position,
                0.28
            );


            position +=
                note[1] * 0.92;

        });


        /*
         * Very quiet harmony.
         */

        const harmonyNotes = [

            130.81,

            164.81,

            196.00

        ];


        harmonyNotes.forEach(
            function (frequency) {

                playNote(
                    frequency,
                    10,
                    now + 0.1,
                    0.025
                );

            }
        );


        /*
         * Calculate melody duration.
         */

        const melodyLength =
            melody.reduce(
                function (
                    total,
                    note
                ) {

                    return (
                        total +
                        note[1] * 0.92
                    );

                },
                0
            );


        /*
         * Repeat naturally.
         */

        musicTimer =
            setTimeout(
                function () {

                    playBirthdayMusic();

                },
                (melodyLength + 1.5) *
                1000
            );

    }


    /* =========================================
       MUSIC BUTTON
    ========================================== */

    if (musicControl) {

        musicControl.addEventListener(
            "click",
            function () {

                /*
                 * If music hasn't started,
                 * start it.
                 */

                if (!audioContext) {

                    startMusic();

                    return;

                }


                /*
                 * MUSIC ON → OFF
                 */

                if (
                    audioContext.state ===
                    "running"
                ) {

                    musicMuted = true;

                    audioContext.suspend();


                    musicControl.classList.add(
                        "muted"
                    );

                }


                /*
                 * MUSIC OFF → ON
                 */

                else {

                    musicMuted = false;

                    audioContext.resume();


                    musicControl.classList.remove(
                        "muted"
                    );

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


        for (
            let i = 0;
            i < amount;
            i++
        ) {

            const piece =
                document.createElement(
                    "span"
                );


            piece.className =
                "confetti-piece";


            const left =
                Math.random() * 100;


            const rotation =
                Math.random() * 360;


            const delay =
                Math.random() * 0.3;


            const sizes =
                5 +
                Math.random() * 5;


            piece.style.left =
                left + "%";


            piece.style.top =
                Math.random() *
                12 +
                "%";


            piece.style.width =
                sizes + "px";


            piece.style.height =
                sizes * 1.5 +
                "px";


            piece.style.transform =
                "rotate(" +
                rotation +
                "deg)";


            piece.style.animationDelay =
                delay + "s";


            confettiLayer.appendChild(
                piece
            );


            setTimeout(
                function () {

                    piece.remove();

                },
                2300
            );

        }

    }


    /* =========================================
       OPEN ENVELOPE
    ========================================== */

    function openGift() {

        if (!envelope) {

            return;

        }


        /*
         * Prevent double clicking.
         */

        if (
            envelope.classList.contains(
                "opening"
            )
        ) {

            return;

        }


        envelope.classList.add(
            "opening"
        );


        if (openGiftButton) {

            openGiftButton.disabled =
                true;

        }


        /*
         * Small visual celebration.
         */

        createConfetti(28);


        /*
         * Start coded music.
         */

        startMusic();


        /*
         * Move to entrance page.
         */

        setTimeout(
            function () {

                showScreen(
                    entranceScreen
                );

            },
            850
        );

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
       ENTRANCE → PASSWORD
    ========================================== */

    if (curiousButton) {

        curiousButton.addEventListener(
            "click",
            function () {

                showScreen(
                    passwordScreen
                );


                setTimeout(
                    function () {

                        if (passwordInput) {

                            passwordInput.focus();

                        }

                    },
                    700
                );

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


        /*
         * CORRECT PASSWORD
         */

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


            createConfetti(35);


            setTimeout(
                function () {

                    if (unlockButton) {

                        unlockButton.textContent =
                            "✓ IT'S HER! ❤️";

                    }

                },
                600
            );


            setTimeout(
                function () {

                    if (successPopup) {

                        successPopup.classList.add(
                            "show"
                        );

                    }

                },
                1100
            );

        }


        /*
         * WRONG PASSWORD
         */

        else {

            passwordInput.value =
                "";


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

                if (
                    event.key ===
                    "Enter"
                ) {

                    checkPassword();

                }

            }
        );


        /*
         * Numbers only.
         */

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


                setTimeout(
                    function () {

                        if (passwordInput) {

                            passwordInput.focus();

                        }

                    },
                    300
                );

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


                setTimeout(
                    function () {

                        /*
                         * Page 2 filename.
                         */

                        window.location.href =
                            "page2.html";

                    },
                    700
                );

            }
        );

    }


    /* =========================================
       CLOSE WRONG PASSWORD POPUP
    ========================================== */

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


    /* =========================================
       CLOSE SUCCESS POPUP
    ========================================== */

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


    /* =========================================
       CAMERA EASTER EGGS
    ========================================== */

    const cameras =
        document.querySelectorAll(
            ".camera"
        );


    cameras.forEach(
        function (camera) {

            camera.addEventListener(
                "click",
                function () {

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
                        rect.left +
                        "px";


                    message.style.top =
                        rect.top -
                        45 +
                        "px";


                    document.body.appendChild(
                        message
                    );


                    /*
                     * Small visual reaction only.
                     *
                     * NO AUDIO.
                     */

                    createConfetti(8);


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

});
