document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       PAGE 1 AUDIO + INTERACTION ENGINE
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

    const musicControl = document.getElementById("music-control");
    const confettiLayer = document.getElementById("confetti-layer");

    const correctPassword = "0309";


    /* =========================================================
       AUDIO ENGINE
       ========================================================= */

    let audioContext = null;
    let masterGain = null;
    let musicGain = null;
    let sfxGain = null;

    let audioReady = false;
    let musicPlaying = false;

    let musicTimer = null;
    let musicStep = 0;

    let lastClickTime = 0;
    let lastKeyTime = 0;


    /* =========================================================
       INITIALIZE AUDIO
       ========================================================= */

    function initializeAudio() {

        if (audioReady) {

            if (
                audioContext &&
                audioContext.state === "suspended"
            ) {
                audioContext.resume();
            }

            return;
        }

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioContext) {
            console.log("Web Audio is not supported.");
            return;
        }

        audioContext = new AudioContext();

        masterGain =
            audioContext.createGain();

        musicGain =
            audioContext.createGain();

        sfxGain =
            audioContext.createGain();

        /*
         * Overall volume.
         */

        masterGain.gain.value = 0.75;

        /*
         * BGM volume.
         * Kept lower than sound effects.
         */

        musicGain.gain.value = 0.16;

        /*
         * Sound effects volume.
         */

        sfxGain.gain.value = 0.50;

        musicGain.connect(masterGain);
        sfxGain.connect(masterGain);
        masterGain.connect(
            audioContext.destination
        );

        audioReady = true;

        if (
            audioContext.state === "suspended"
        ) {
            audioContext.resume();
        }
    }


    /* =========================================================
       RESUME AUDIO
       ========================================================= */

    async function unlockAudio() {

        initializeAudio();

        if (
            audioContext &&
            audioContext.state === "suspended"
        ) {

            try {
                await audioContext.resume();
            } catch (error) {
                console.log(
                    "Audio resume failed:",
                    error
                );
            }
        }
    }


    /* =========================================================
       BASIC OSCILLATOR
       ========================================================= */

    function tone({
        frequency = 440,
        duration = 0.1,
        volume = 0.1,
        type = "sine",
        startDelay = 0,
        destination = sfxGain,
        attack = 0.01,
        release = 0.08
    }) {

        if (
            !audioContext ||
            !destination
        ) {
            return;
        }

        const now =
            audioContext.currentTime +
            startDelay;

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
            now + attack
        );

        gain.gain.setValueAtTime(
            volume,
            now + Math.max(
                attack,
                duration - release
            )
        );

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            now + duration
        );

        oscillator.connect(gain);
        gain.connect(destination);

        oscillator.start(now);

        oscillator.stop(
            now + duration + 0.03
        );
    }


    /* =========================================================
       NOISE BURST
       Used for envelope / transition textures.
       ========================================================= */

    function noiseBurst({
        duration = 0.15,
        volume = 0.04,
        startDelay = 0
    }) {

        if (
            !audioContext ||
            !sfxGain
        ) {
            return;
        }

        const bufferSize =
            audioContext.sampleRate *
            duration;

        const buffer =
            audioContext.createBuffer(
                1,
                bufferSize,
                audioContext.sampleRate
            );

        const data =
            buffer.getChannelData(0);

        for (
            let i = 0;
            i < bufferSize;
            i++
        ) {

            data[i] =
                Math.random() * 2 - 1;
        }

        const source =
            audioContext.createBufferSource();

        const gain =
            audioContext.createGain();

        source.buffer = buffer;

        const now =
            audioContext.currentTime +
            startDelay;

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

        source.connect(gain);
        gain.connect(sfxGain);

        source.start(now);

        source.stop(
            now + duration
        );
    }


    /* =========================================================
       SOUND EFFECT 1
       CLEAN BUTTON CLICK
       ========================================================= */

    function playClick() {

        const now =
            performance.now();

        /*
         * Prevent double-click clutter.
         */

        if (
            now - lastClickTime <
            100
        ) {
            return;
        }

        lastClickTime = now;

        unlockAudio();

        tone({
            frequency: 620,
            duration: 0.07,
            volume: 0.12,
            type: "sine",
            attack: 0.005,
            release: 0.04
        });

        tone({
            frequency: 900,
            duration: 0.055,
            volume: 0.06,
            type: "sine",
            startDelay: 0.025,
            attack: 0.005,
            release: 0.03
        });
    }


    /* =========================================================
       SOUND EFFECT 2
       PASSWORD KEY
       ========================================================= */

    function playKeySound() {

        const now =
            performance.now();

        if (
            now - lastKeyTime <
            70
        ) {
            return;
        }

        lastKeyTime = now;

        unlockAudio();

        /*
         * Slightly different pitch each time.
         * Makes typing feel natural.
         */

        const frequencies = [
            540,
            580,
            620,
            560
        ];

        const frequency =
            frequencies[
                Math.floor(
                    Math.random() *
                    frequencies.length
                )
            ];

        tone({
            frequency,
            duration: 0.075,
            volume: 0.085,
            type: "triangle",
            attack: 0.005,
            release: 0.045
        });
    }


    /* =========================================================
       SOUND EFFECT 3
       WRONG PASSWORD
       ========================================================= */

    function playWrongSound() {

        unlockAudio();

        /*
         * Cute descending melody.
         */

        tone({
            frequency: 480,
            duration: 0.16,
            volume: 0.18,
            type: "triangle",
            release: 0.07
        });

        tone({
            frequency: 380,
            duration: 0.18,
            volume: 0.16,
            type: "triangle",
            startDelay: 0.12,
            release: 0.08
        });

        tone({
            frequency: 270,
            duration: 0.25,
            volume: 0.14,
            type: "triangle",
            startDelay: 0.24,
            release: 0.12
        });
    }


    /* =========================================================
       SOUND EFFECT 4
       CORRECT PASSWORD
       ========================================================= */

    function playSuccessSound() {

        unlockAudio();

        /*
         * C - E - G - high C
         */

        tone({
            frequency: 523.25,
            duration: 0.22,
            volume: 0.16,
            type: "sine",
            release: 0.09
        });

        tone({
            frequency: 659.25,
            duration: 0.22,
            volume: 0.16,
            type: "sine",
            startDelay: 0.11,
            release: 0.09
        });

        tone({
            frequency: 783.99,
            duration: 0.25,
            volume: 0.18,
            type: "sine",
            startDelay: 0.22,
            release: 0.10
        });

        tone({
            frequency: 1046.50,
            duration: 0.48,
            volume: 0.16,
            type: "sine",
            startDelay: 0.35,
            release: 0.18
        });

        /*
         * Tiny sparkle.
         */

        tone({
            frequency: 1567.98,
            duration: 0.35,
            volume: 0.055,
            type: "sine",
            startDelay: 0.42,
            release: 0.18
        });
    }


    /* =========================================================
       SOUND EFFECT 5
       ENVELOPE OPEN
       ========================================================= */

    function playEnvelopeSound() {

        unlockAudio();

        /*
         * Soft paper movement.
         */

        noiseBurst({
            duration: 0.22,
            volume: 0.055
        });

        /*
         * Rising magical notes.
         */

        tone({
            frequency: 330,
            duration: 0.16,
            volume: 0.09,
            type: "triangle"
        });

        tone({
            frequency: 440,
            duration: 0.18,
            volume: 0.10,
            type: "triangle",
            startDelay: 0.08
        });

        tone({
            frequency: 554.37,
            duration: 0.22,
            volume: 0.11,
            type: "sine",
            startDelay: 0.17
        });

        tone({
            frequency: 659.25,
            duration: 0.35,
            volume: 0.10,
            type: "sine",
            startDelay: 0.28
        });
    }


    /* =========================================================
       SOUND EFFECT 6
       PAGE TRANSITION
       ========================================================= */

    function playTransitionSound() {

        unlockAudio();

        if (
            !audioContext ||
            !sfxGain
        ) {
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
            1100,
            now + 0.65
        );

        gain.gain.setValueAtTime(
            0,
            now
        );

        gain.gain.linearRampToValueAtTime(
            0.14,
            now + 0.18
        );

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            now + 0.85
        );

        oscillator.connect(gain);
        gain.connect(sfxGain);

        oscillator.start(now);

        oscillator.stop(
            now + 0.9
        );


        /*
         * Magical final chimes.
         */

        tone({
            frequency: 783.99,
            duration: 0.35,
            volume: 0.10,
            type: "sine",
            startDelay: 0.48
        });

        tone({
            frequency: 987.77,
            duration: 0.40,
            volume: 0.10,
            type: "sine",
            startDelay: 0.58
        });

        tone({
            frequency: 1174.66,
            duration: 0.55,
            volume: 0.08,
            type: "sine",
            startDelay: 0.70
        });
    }


    /* =========================================================
       CODED BACKGROUND MUSIC
       
       Soft repeating romantic melody.
       No external MP3.
       ========================================================= */

    const melody = [

        261.63,
        329.63,
        392.00,
        329.63,

        293.66,
        349.23,
        440.00,
        349.23,

        261.63,
        329.63,
        392.00,
        493.88,

        293.66,
        349.23,
        440.00,
        392.00
    ];


    function playMusicNote() {

        if (
            !musicPlaying ||
            !audioContext ||
            !musicGain
        ) {
            return;
        }

        const frequency =
            melody[
                musicStep %
                melody.length
            ];

        musicStep++;

        /*
         * Main soft note.
         */

        tone({
            frequency,
            duration: 1.15,
            volume: 0.20,
            type: "sine",
            destination: musicGain,
            attack: 0.10,
            release: 0.35
        });

        /*
         * Very quiet harmony.
         */

        tone({
            frequency:
                frequency * 1.5,
            duration: 0.90,
            volume: 0.045,
            type: "sine",
            startDelay: 0.08,
            destination: musicGain,
            attack: 0.10,
            release: 0.35
        });

        musicTimer =
            setTimeout(
                playMusicNote,
                620
            );
    }


    function startMusic() {

        unlockAudio();

        if (musicPlaying) {
            return;
        }

        musicPlaying = true;
        musicStep = 0;

        if (musicControl) {

            musicControl.classList.add(
                "visible"
            );

            musicControl.classList.remove(
                "muted"
            );
        }

        playMusicNote();
    }


    function stopMusic() {

        musicPlaying = false;

        if (musicTimer) {

            clearTimeout(
                musicTimer
            );

            musicTimer = null;
        }

        if (musicControl) {

            musicControl.classList.add(
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
            async () => {

                await unlockAudio();

                if (!musicPlaying) {

                    startMusic();

                } else {

                    stopMusic();

                }

            }
        );
    }


    /* =========================================================
       FIRST TOUCH
       
       Unlocks Web Audio on Android/Chrome.
       ========================================================= */

    document.addEventListener(
        "pointerdown",
        async () => {

            await unlockAudio();

            /*
             * Start the BGM only after the visitor
             * has interacted with the website.
             */

            if (!musicPlaying) {
                startMusic();
            }

        },
        {
            once: true,
            passive: true
        }
    );


    /* =========================================================
       LOADING SCREEN
       ========================================================= */

    setTimeout(() => {

        if (loadingScreen) {

            loadingScreen.classList.add(
                "hide"
            );

        }

    }, 1500);


    /* =========================================================
       SCREEN TRANSITIONS
       ========================================================= */

    function showScreen(screenToShow) {

        const screens = [
            giftScreen,
            entranceScreen,
            passwordScreen
        ];

        screens.forEach(
            screen => {

                if (screen) {

                    screen.classList.remove(
                        "active"
                    );

                }

            }
        );

        setTimeout(() => {

            if (screenToShow) {

                screenToShow.classList.add(
                    "active"
                );

            }

        }, 120);
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

            const size =
                5 + Math.random() * 5;

            piece.style.left =
                left + "%";

            piece.style.top =
                Math.random() * 12 + "%";

            piece.style.width =
                size + "px";

            piece.style.height =
                size * 1.5 + "px";

            piece.style.transform =
                `rotate(${rotation}deg)`;

            piece.style.animationDelay =
                delay + "s";

            confettiLayer.appendChild(
                piece
            );

            setTimeout(
                () => {

                    piece.remove();

                },
                2300
            );
        }
    }


    /* =========================================================
       OPEN ENVELOPE
       ========================================================= */

    let envelopeOpened = false;

    function openGift() {

        if (
            !envelope ||
            envelopeOpened
        ) {
            return;
        }

        envelopeOpened = true;

        unlockAudio();

        /*
         * Envelope gets its OWN sound.
         */

        playEnvelopeSound();

        envelope.classList.add(
            "opening"
        );

        if (openGiftButton) {

            openGiftButton.disabled =
                true;
        }

        createConfetti(28);

        /*
         * BGM begins here as well.
         */

        startMusic();

        setTimeout(
            () => {

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
            event => {

                event.stopPropagation();

                openGift();

            }
        );
    }


    if (envelope) {

        envelope.addEventListener(
            "click",
            () => {

                openGift();

            }
        );
    }


    /* =========================================================
       ENTRANCE → PASSWORD
       ========================================================= */

    if (curiousButton) {

        curiousButton.addEventListener(
            "click",
            async () => {

                await unlockAudio();

                playClick();

                showScreen(
                    passwordScreen
                );

                setTimeout(
                    () => {

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
       PASSWORD INPUT
       ========================================================= */

    if (passwordInput) {

        passwordInput.addEventListener(
            "keydown",
            event => {

                /*
                 * Number typing sound.
                 */

                if (
                    /^[0-9]$/.test(
                        event.key
                    )
                ) {

                    playKeySound();

                }

                /*
                 * Enter = submit.
                 */

                if (
                    event.key === "Enter"
                ) {

                    checkPassword();

                }

            }
        );


        passwordInput.addEventListener(
            "input",
            () => {

                passwordInput.value =
                    passwordInput.value.replace(
                        /\D/g,
                        ""
                    );

            }
        );
    }


    /* =========================================================
       PASSWORD CHECK
       ========================================================= */

    let passwordLocked = false;

    function checkPassword() {

        if (
            !passwordInput ||
            passwordLocked
        ) {
            return;
        }

        const enteredPassword =
            passwordInput.value.trim();


        /* =====================================================
           CORRECT
           ===================================================== */

        if (
            enteredPassword ===
            correctPassword
        ) {

            passwordLocked = true;

            unlockAudio();

            /*
             * SUCCESS SOUND
             */

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
                () => {

                    if (unlockButton) {

                        unlockButton.textContent =
                            "✓ IT'S HER! ❤️";

                    }

                },
                600
            );

            setTimeout(
                () => {

                    if (successPopup) {

                        successPopup.classList.add(
                            "show"
                        );

                    }

                },
                1100
            );


        }

        /* =====================================================
           WRONG
           ===================================================== */

        else {

            unlockAudio();

            /*
             * WRONG SOUND
             */

            playWrongSound();

            passwordInput.value = "";

            if (wrongPopup) {

                wrongPopup.classList.add(
                    "show"
                );

            }
        }
    }


    /* =========================================================
       UNLOCK BUTTON
       ========================================================= */

    if (unlockButton) {

        unlockButton.addEventListener(
            "click",
            () => {

                playClick();

                checkPassword();

            }
        );
    }


    /* =========================================================
       TRY AGAIN
       ========================================================= */

    if (tryAgainButton) {

        tryAgainButton.addEventListener(
            "click",
            () => {

                playClick();

                if (wrongPopup) {

                    wrongPopup.classList.remove(
                        "show"
                    );
                }

                passwordLocked = false;

                setTimeout(
                    () => {

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
       SUCCESS → PAGE 2
       ========================================================= */

    if (continueButton) {

        continueButton.addEventListener(
            "click",
            async () => {

                await unlockAudio();

                playClick();

                if (successPopup) {

                    successPopup.classList.remove(
                        "show"
                    );
                }

                createConfetti(45);

                /*
                 * IMPORTANT:
                 * Transition sound plays AFTER
                 * the button click sound.
                 */

                setTimeout(
                    () => {

                        playTransitionSound();

                    },
                    80
                );


                /*
                 * Wait for the magical transition.
                 */

                setTimeout(
                    () => {

                        window.location.href =
                            "page2.html";

                    },
                    1050
                );
            }
        );
    }


    /* =========================================================
       POPUP CLOSE
       ========================================================= */

    if (wrongPopup) {

        wrongPopup.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    wrongPopup
                ) {

                    playClick();

                    wrongPopup.classList.remove(
                        "show"
                    );

                    passwordLocked = false;
                }
            }
        );
    }


    if (successPopup) {

        successPopup.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    successPopup
                ) {

                    playClick();

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
        camera => {

            camera.addEventListener(
                "click",
                () => {

                    /*
                     * ONLY ONE CLICK SOUND.
                     */

                    playClick();

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
                     * No extra sound here.
                     */

                    createConfetti(5);

                    setTimeout(
                        () => {

                            message.remove();

                        },
                        1800
                    );
                }
            );
        }
    );

});
