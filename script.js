document.addEventListener("DOMContentLoaded", function () {

    /* =========================================================
       ELEMENTS
    ========================================================= */

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


    /* =========================================================
       PASSWORD
    ========================================================= */

    const correctPassword = "0309";


    /* =========================================================
       AUDIO ENGINE
       
       Everything below is generated using JavaScript.
       NO AUDIO FILES ARE REQUIRED.
    ========================================================= */

    let audioContext = null;
    let masterGain = null;

    let musicStarted = false;
    let musicNodes = [];

    let lastClickSound = 0;
    let lastTypingSound = 0;


    /* ---------------------------------------------------------
       CREATE AUDIO CONTEXT
    --------------------------------------------------------- */

    function initAudio() {

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

        masterGain.gain.value = 0.22;

        masterGain.connect(
            audioContext.destination
        );
    }


    /* ---------------------------------------------------------
       RESUME AUDIO
    --------------------------------------------------------- */

    function resumeAudio() {

        initAudio();

        if (
            audioContext &&
            audioContext.state === "suspended"
        ) {
            audioContext.resume();
        }
    }


    /* =========================================================
       BASIC SOUND GENERATOR
    ========================================================= */

    function playTone(
        frequency,
        duration,
        volume,
        type = "sine",
        delay = 0
    ) {

        if (!audioContext || !masterGain) {
            return;
        }

        const now =
            audioContext.currentTime + delay;

        const oscillator =
            audioContext.createOscillator();

        const gain =
            audioContext.createGain();

        oscillator.type = type;

        oscillator.frequency.setValueAtTime(
            frequency,
            now
        );

        gain.gain.setValueAtTime(
            0,
            now
        );

        gain.gain.linearRampToValueAtTime(
            volume,
            now + 0.015
        );

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            now + duration
        );

        oscillator.connect(gain);
        gain.connect(masterGain);

        oscillator.start(now);
        oscillator.stop(now + duration + 0.03);
    }


    /* =========================================================
       SOUND EFFECTS
    ========================================================= */


    /* ---------------------------------------------------------
       1. CLEAN UI CLICK
    --------------------------------------------------------- */

    function playClickSound() {

        const now =
            performance.now();

        /*
         * Prevent accidental double-click sound spam.
         */
        if (
            now - lastClickSound < 90
        ) {
            return;
        }

        lastClickSound = now;

        resumeAudio();

        playTone(
            520,
            0.055,
            0.045,
            "sine"
        );

        playTone(
            760,
            0.045,
            0.025,
            "sine",
            0.025
        );
    }


    /* ---------------------------------------------------------
       2. PASSWORD TYPING
       
       Very soft tick.
       Throttled so it never becomes irritating.
    --------------------------------------------------------- */

    function playTypingSound() {

        const now =
            performance.now();

        if (
            now - lastTypingSound < 65
        ) {
            return;
        }

        lastTypingSound = now;

        resumeAudio();

        playTone(
            720,
            0.035,
            0.018,
            "sine"
        );
    }


    /* ---------------------------------------------------------
       3. WRONG PASSWORD
       
       Cute descending "uh-oh" sound.
    --------------------------------------------------------- */

    function playWrongSound() {

        resumeAudio();

        playTone(
            420,
            0.16,
            0.07,
            "sine"
        );

        playTone(
            300,
            0.20,
            0.055,
            "sine",
            0.10
        );

        playTone(
            220,
            0.24,
            0.045,
            "sine",
            0.20
        );
    }


    /* ---------------------------------------------------------
       4. SUCCESS PASSWORD
       
       Small magical ascending chime.
    --------------------------------------------------------- */

    function playSuccessSound() {

        resumeAudio();

        playTone(
            523,
            0.18,
            0.055,
            "sine"
        );

        playTone(
            659,
            0.18,
            0.055,
            "sine",
            0.10
        );

        playTone(
            784,
            0.22,
            0.06,
            "sine",
            0.20
        );

        playTone(
            1047,
            0.35,
            0.05,
            "sine",
            0.32
        );
    }


    /* ---------------------------------------------------------
       5. ENVELOPE OPEN
       
       Soft magical paper-opening sound.
    --------------------------------------------------------- */

    function playEnvelopeSound() {

        resumeAudio();

        playTone(
            330,
            0.15,
            0.035,
            "triangle"
        );

        playTone(
            440,
            0.20,
            0.04,
            "triangle",
            0.08
        );

        playTone(
            660,
            0.28,
            0.035,
            "sine",
            0.17
        );
    }


    /* ---------------------------------------------------------
       6. PAGE TRANSITION
       
       Magical "whoosh/chime" when going to Page 2.
    --------------------------------------------------------- */

    function playTransitionSound() {

        resumeAudio();

        /*
         * Rising sweep.
         */

        if (!audioContext || !masterGain) {
            return;
        }

        const now =
            audioContext.currentTime;

        const oscillator =
            audioContext.createOscillator();

        const gain =
            audioContext.createGain();

        oscillator.type = "sine";

        oscillator.frequency.setValueAtTime(
            180,
            now
        );

        oscillator.frequency.exponentialRampToValueAtTime(
            900,
            now + 0.65
        );

        gain.gain.setValueAtTime(
            0,
            now
        );

        gain.gain.linearRampToValueAtTime(
            0.055,
            now + 0.12
        );

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            now + 0.75
        );

        oscillator.connect(gain);
        gain.connect(masterGain);

        oscillator.start(now);
        oscillator.stop(now + 0.8);


        /*
         * Final sparkle.
         */

        playTone(
            880,
            0.30,
            0.045,
            "sine",
            0.52
        );

        playTone(
            1175,
            0.35,
            0.035,
            "sine",
            0.62
        );
    }


    /* =========================================================
       BACKGROUND MUSIC
       
       Soft romantic ambient BGM created entirely with JS.
    ========================================================= */

    function startCodedMusic() {

        if (
            musicStarted ||
            !audioContext ||
            !masterGain
        ) {
            return;
        }

        musicStarted = true;

        const bassGain =
            audioContext.createGain();

        const padGain =
            audioContext.createGain();

        const shimmerGain =
            audioContext.createGain();

        bassGain.gain.value = 0.018;
        padGain.gain.value = 0.012;
        shimmerGain.gain.value = 0.006;

        bassGain.connect(masterGain);
        padGain.connect(masterGain);
        shimmerGain.connect(masterGain);

        musicNodes.push(
            bassGain,
            padGain,
            shimmerGain
        );


        /*
         * Gentle chord progression.
         */

        const chords = [

            [261.63, 329.63, 392.00],

            [220.00, 261.63, 329.63],

            [174.61, 220.00, 261.63],

            [196.00, 246.94, 293.66]

        ];

        let chordIndex = 0;


        function playChord() {

            if (!audioContext) {
                return;
            }

            const chord =
                chords[chordIndex];

            chordIndex =
                (chordIndex + 1) %
                chords.length;

            chord.forEach(
                function (frequency, index) {

                    const oscillator =
                        audioContext.createOscillator();

                    const gain =
                        audioContext.createGain();

                    oscillator.type = "sine";

                    oscillator.frequency.value =
                        frequency;

                    gain.gain.setValueAtTime(
                        0,
                        audioContext.currentTime
                    );

                    gain.gain.linearRampToValueAtTime(
                        0.5,
                        audioContext.currentTime + 1.2
                    );

                    gain.gain.linearRampToValueAtTime(
                        0,
                        audioContext.currentTime + 5.5
                    );

                    oscillator.connect(gain);
                    gain.connect(padGain);

                    oscillator.start();

                    oscillator.stop(
                        audioContext.currentTime + 5.7
                    );

                }
            );

            setTimeout(
                playChord,
                4800
            );
        }


        playChord();


        /*
         * Very occasional high sparkle.
         */

        function sparkle() {

            if (!audioContext) {
                return;
            }

            const notes = [
                783.99,
                880,
                987.77,
                1174.66
            ];

            const note =
                notes[
                    Math.floor(
                        Math.random() *
                        notes.length
                    )
                ];

            const oscillator =
                audioContext.createOscillator();

            const gain =
                audioContext.createGain();

            oscillator.type = "sine";

            oscillator.frequency.value =
                note;

            gain.gain.setValueAtTime(
                0,
                audioContext.currentTime
            );

            gain.gain.linearRampToValueAtTime(
                0.35,
                audioContext.currentTime + 0.05
            );

            gain.gain.exponentialRampToValueAtTime(
                0.001,
                audioContext.currentTime + 1.2
            );

            oscillator.connect(gain);
            gain.connect(shimmerGain);

            oscillator.start();

            oscillator.stop(
                audioContext.currentTime + 1.3
            );

            setTimeout(
                sparkle,
                6000 + Math.random() * 5000
            );
        }

        sparkle();
    }


    /* =========================================================
       START MUSIC
    ========================================================= */

    function startMusic() {

        resumeAudio();

        if (!audioContext) {
            return;
        }

        startCodedMusic();

        if (musicControl) {

            musicControl.classList.add(
                "visible"
            );

            musicControl.classList.remove(
                "muted"
            );
        }
    }


    /* =========================================================
       MUSIC BUTTON
    ========================================================= */

    if (musicControl) {

        musicControl.addEventListener(
            "click",
            function () {

                resumeAudio();

                if (!musicStarted) {

                    startMusic();

                    return;
                }

                /*
                 * Toggle master music volume.
                 */

                if (
                    masterGain.gain.value > 0.001
                ) {

                    masterGain.gain.value =
                        0;

                    musicControl.classList.add(
                        "muted"
                    );

                } else {

                    masterGain.gain.value =
                        0.22;

                    musicControl.classList.remove(
                        "muted"
                    );
                }

            }
        );

    }


    /* =========================================================
       LOADING SCREEN
    ========================================================= */

    setTimeout(
        function () {

            if (loadingScreen) {

                loadingScreen.classList.add(
                    "hide"
                );

            }

        },
        1500
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

        screens.forEach(
            function (screen) {

                if (screen) {

                    screen.classList.remove(
                        "active"
                    );

                }

            }
        );

        setTimeout(
            function () {

                if (screenToShow) {

                    screenToShow.classList.add(
                        "active"
                    );

                }

            },
            120
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
                Math.random() * 12 + "%";

            piece.style.width =
                sizes + "px";

            piece.style.height =
                sizes * 1.5 + "px";

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

        resumeAudio();

        playEnvelopeSound();

        envelope.classList.add(
            "opening"
        );

        if (openGiftButton) {

            openGiftButton.disabled =
                true;

        }

        createConfetti(28);

        startMusic();

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
            function () {

                playClickSound();

                openGift();

            }
        );

    }


    if (envelope) {

        envelope.addEventListener(
            "click",
            function () {

                openGift();

            }
        );

    }


    /* =========================================================
       ENTRANCE BUTTON
    ========================================================= */

    if (curiousButton) {

        curiousButton.addEventListener(
            "click",
            function () {

                playClickSound();

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


    /* =========================================================
       PASSWORD CHECK
    ========================================================= */

    function checkPassword() {

        if (!passwordInput) {
            return;
        }

        const enteredPassword =
            passwordInput.value.trim();


        /* -----------------------------------------------------
           CORRECT PASSWORD
        ----------------------------------------------------- */

        if (
            enteredPassword ===
            correctPassword
        ) {

            playSuccessSound();

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


        } else {

            /* -------------------------------------------------
               WRONG PASSWORD
            ------------------------------------------------- */

            playWrongSound();

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

                playClickSound();

                checkPassword();

            }
        );

    }


    /* =========================================================
       PASSWORD INPUT SOUND
    ========================================================= */

    if (passwordInput) {

        passwordInput.addEventListener(
            "keydown",
            function (event) {

                /*
                 * Only play typing sound for actual
                 * number keys.
                 */

                if (
                    /^[0-9]$/.test(
                        event.key
                    )
                ) {

                    playTypingSound();

                }


                if (
                    event.key === "Enter"
                ) {

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


    /* =========================================================
       TRY AGAIN
    ========================================================= */

    if (tryAgainButton) {

        tryAgainButton.addEventListener(
            "click",
            function () {

                playClickSound();

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


    /* =========================================================
       CONTINUE TO PAGE 2
    ========================================================= */

    if (continueButton) {

        continueButton.addEventListener(
            "click",
            function () {

                playClickSound();

                if (successPopup) {

                    successPopup.classList.remove(
                        "show"
                    );

                }

                createConfetti(45);

                /*
                 * Magical transition sound.
                 */

                playTransitionSound();


                /*
                 * Give the sound time to play
                 * before changing page.
                 */

                setTimeout(
                    function () {

                        window.location.href =
                            "page2.html";

                    },
                    850
                );

            }
        );

    }


    /* =========================================================
       CLOSE POPUPS
    ========================================================= */

    if (wrongPopup) {

        wrongPopup.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    wrongPopup
                ) {

                    playClickSound();

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

                if (
                    event.target ===
                    successPopup
                ) {

                    playClickSound();

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

                    /*
                     * One clean click sound only.
                     */

                    playClickSound();

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
                        rect.top - 45 + "px";

                    document.body.appendChild(
                        message
                    );

                    /*
                     * Tiny amount of confetti.
                     * No extra sound.
                     */

                    createConfetti(5);

                    setTimeout(
                        function () {

                            message.remove();

                        },
                        1800
                    );

                }
            );

        });


    /* =========================================================
       GLOBAL BUTTON CLICK SOUND
       
       Covers buttons we may add later.
       Excludes elements that already have their own
       click sound to prevent double audio.
    ========================================================= */

    document.addEventListener(
        "click",
        function (event) {

            const target =
                event.target.closest(
                    "button"
                );

            if (!target) {
                return;
            }

            /*
             * These already have dedicated sounds.
             */

            const specialButtons = [
                openGiftButton,
                curiousButton,
                unlockButton,
                tryAgainButton,
                continueButton,
                musicControl
            ];

            if (
                specialButtons.includes(
                    target
                )
            ) {
                return;
            }

            playClickSound();

        }
    );


    /* =========================================================
       FIRST USER INTERACTION
       
       Important for Android/Chrome autoplay restrictions.
    ========================================================= */

    document.addEventListener(
        "pointerdown",
        function firstInteraction() {

            resumeAudio();

            /*
             * Start the BGM on the first genuine
             * user interaction.
             */

            if (!musicStarted) {

                startMusic();

            }

            document.removeEventListener(
                "pointerdown",
                firstInteraction
            );

        },
        {
            once: true
        }
    );

});
