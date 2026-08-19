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
       ========================================================= */

    let audioContext = null;

    let masterGain = null;

    let musicGain = null;

    let sfxGain = null;

    let audioStarted = false;

    let musicEnabled = true;

    let musicTimer = null;

    let musicStep = 0;

    let lastTypingSound = 0;

    let lastClickSound = 0;


    /*
     * Create AudioContext only when needed.
     * This avoids autoplay problems on Chrome/Android.
     */

    function createAudioEngine() {

        if (audioContext) {
            return true;
        }

        try {

            const AudioContext =
                window.AudioContext ||
                window.webkitAudioContext;

            if (!AudioContext) {
                return false;
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
             * BGM is intentionally quiet.
             */

            musicGain.gain.value = 0.16;

            /*
             * Effects slightly louder than music.
             */

            sfxGain.gain.value = 0.55;


            musicGain.connect(masterGain);

            sfxGain.connect(masterGain);

            masterGain.connect(
                audioContext.destination
            );


            return true;

        } catch (error) {

            console.warn(
                "Audio engine could not start:",
                error
            );

            return false;
        }
    }


    /*
     * Resume audio after a real user interaction.
     */

    async function unlockAudio() {

        if (!createAudioEngine()) {
            return false;
        }

        try {

            if (
                audioContext.state === "suspended"
            ) {

                await audioContext.resume();

            }

            audioStarted = true;

            return true;

        } catch (error) {

            console.warn(
                "Audio resume failed:",
                error
            );

            return false;
        }
    }


    /* =========================================================
       GENERIC OSCILLATOR
    ========================================================= */

    function playTone(
        frequency,
        duration,
        type,
        volume,
        destination,
        delay = 0
    ) {

        if (!audioContext) {
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
            0.0001,
            now
        );

        gain.gain.exponentialRampToValueAtTime(
            Math.max(volume, 0.0001),
            now + 0.015
        );

        gain.gain.exponentialRampToValueAtTime(
            0.0001,
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
       SOFT UI CLICK
    ========================================================= */

    function playClick() {

        const now =
            performance.now();

        /*
         * Prevent accidental double clicks
         * from producing a harsh repeated sound.
         */

        if (
            now - lastClickSound < 90
        ) {
            return;
        }

        lastClickSound = now;

        if (!audioStarted) {
            return;
        }

        playTone(
            880,
            0.055,
            "sine",
            0.075,
            sfxGain
        );

        playTone(
            1320,
            0.035,
            "sine",
            0.025,
            sfxGain,
            0.015
        );
    }


    /* =========================================================
       ENVELOPE OPENING SOUND
    ========================================================= */

    function playEnvelopeOpen() {

        if (!audioStarted) {
            return;
        }

        if (!audioContext) {
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
            320,
            now
        );

        oscillator.frequency.exponentialRampToValueAtTime(
            760,
            now + 0.55
        );

        gain.gain.setValueAtTime(
            0.0001,
            now
        );

        gain.gain.exponentialRampToValueAtTime(
            0.10,
            now + 0.08
        );

        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            now + 0.65
        );

        oscillator.connect(gain);

        gain.connect(sfxGain);

        oscillator.start(now);

        oscillator.stop(
            now + 0.7
        );


        /*
         * Tiny sparkle at the end.
         */

        playTone(
            1174,
            0.22,
            "sine",
            0.035,
            sfxGain,
            0.42
        );

        playTone(
            1568,
            0.26,
            "sine",
            0.025,
            sfxGain,
            0.50
        );
    }


    /* =========================================================
       PASSWORD TYPING SOUND
    ========================================================= */

    function playTypingSound() {

        if (!audioStarted) {
            return;
        }

        const now =
            performance.now();

        /*
         * IMPORTANT:
         *
         * Do NOT make a sound for every single
         * keypress. This throttle makes typing
         * feel tactile without becoming annoying.
         */

        if (
            now - lastTypingSound < 95
        ) {
            return;
        }

        lastTypingSound = now;

        const notes = [
            740,
            830,
            780,
            900
        ];

        const frequency =
            notes[
                Math.floor(
                    Math.random() *
                    notes.length
                )
            ];

        playTone(
            frequency,
            0.045,
            "sine",
            0.035,
            sfxGain
        );
    }


    /* =========================================================
       WRONG PASSWORD
    ========================================================= */

    function playWrongSound() {

        if (!audioStarted) {
            return;
        }

        if (!audioContext) {
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
            330,
            now
        );

        oscillator.frequency.exponentialRampToValueAtTime(
            180,
            now + 0.22
        );


        gain.gain.setValueAtTime(
            0.0001,
            now
        );

        gain.gain.exponentialRampToValueAtTime(
            0.12,
            now + 0.025
        );

        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            now + 0.30
        );


        oscillator.connect(gain);

        gain.connect(sfxGain);

        oscillator.start(now);

        oscillator.stop(
            now + 0.34
        );
    }


    /* =========================================================
       SUCCESS SOUND
    ========================================================= */

    function playSuccessSound() {

        if (!audioStarted) {
            return;
        }

        /*
         * Soft magical three-note progression.
         */

        playTone(
            523.25,
            0.30,
            "sine",
            0.075,
            sfxGain
        );

        playTone(
            659.25,
            0.32,
            "sine",
            0.065,
            sfxGain,
            0.10
        );

        playTone(
            783.99,
            0.50,
            "sine",
            0.075,
            sfxGain,
            0.20
        );


        /*
         * Tiny sparkle.
         */

        playTone(
            1046.50,
            0.30,
            "sine",
            0.035,
            sfxGain,
            0.38
        );

        playTone(
            1318.51,
            0.34,
            "sine",
            0.025,
            sfxGain,
            0.48
        );
    }


    /* =========================================================
       PAGE TRANSITION SOUND
    ========================================================= */

    function playTransitionSound() {

        if (!audioStarted) {
            return;
        }

        if (!audioContext) {
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
            220,
            now
        );

        oscillator.frequency.exponentialRampToValueAtTime(
            880,
            now + 0.85
        );


        gain.gain.setValueAtTime(
            0.0001,
            now
        );

        gain.gain.exponentialRampToValueAtTime(
            0.10,
            now + 0.15
        );

        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            now + 1.05
        );


        oscillator.connect(gain);

        gain.connect(sfxGain);

        oscillator.start(now);

        oscillator.stop(
            now + 1.1
        );


        /*
         * Sparkle at transition peak.
         */

        playTone(
            1174,
            0.28,
            "sine",
            0.035,
            sfxGain,
            0.65
        );

        playTone(
            1568,
            0.32,
            "sine",
            0.025,
            sfxGain,
            0.76
        );
    }


    /* =========================================================
       BGM — SYNTHESIZED ROMANTIC MUSIC BOX
    ========================================================= */

    const melody = [

        523.25,
        659.25,
        783.99,
        659.25,

        587.33,
        698.46,
        880.00,
        698.46,

        523.25,
        659.25,
        783.99,
        987.77,

        880.00,
        783.99,
        659.25,
        587.33

    ];


    const bassNotes = [

        261.63,
        293.66,
        220.00,
        246.94

    ];


    function playMusicNote(
        frequency,
        duration,
        volume
    ) {

        if (!audioContext) {
            return;
        }

        const now =
            audioContext.currentTime;

        const oscillator =
            audioContext.createOscillator();

        const gain =
            audioContext.createGain();


        oscillator.type = "triangle";

        oscillator.frequency.setValueAtTime(
            frequency,
            now
        );


        gain.gain.setValueAtTime(
            0.0001,
            now
        );

        gain.gain.exponentialRampToValueAtTime(
            volume,
            now + 0.035
        );

        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            now + duration
        );


        oscillator.connect(gain);

        gain.connect(musicGain);

        oscillator.start(now);

        oscillator.stop(
            now + duration + 0.05
        );
    }


    function playBassNote(
        frequency,
        duration
    ) {

        if (!audioContext) {
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
            frequency,
            now
        );


        gain.gain.setValueAtTime(
            0.0001,
            now
        );

        gain.gain.exponentialRampToValueAtTime(
            0.035,
            now + 0.08
        );

        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            now + duration
        );


        oscillator.connect(gain);

        gain.connect(musicGain);

        oscillator.start(now);

        oscillator.stop(
            now + duration + 0.05
        );
    }


    function musicLoop() {

        if (!audioStarted) {
            return;
        }

        if (!musicEnabled) {
            return;
        }

        const note =
            melody[musicStep % melody.length];

        const bass =
            bassNotes[
                Math.floor(
                    musicStep / 4
                ) %
                bassNotes.length
            ];


        playMusicNote(
            note,
            0.62,
            0.045
        );


        /*
         * Bass only every fourth note.
         */

        if (
            musicStep % 4 === 0
        ) {

            playBassNote(
                bass,
                1.8
            );

        }


        /*
         * Very occasional high sparkle.
         */

        if (
            musicStep % 8 === 6
        ) {

            playMusicNote(
                note * 2,
                0.22,
                0.018
            );

        }


        musicStep++;


        musicTimer =
            setTimeout(
                musicLoop,
                650
            );
    }


    function startMusic() {

        if (!audioStarted) {
            return;
        }

        if (!musicEnabled) {
            return;
        }

        if (musicTimer) {
            return;
        }

        musicStep = 0;

        musicLoop();

        if (musicControl) {

            musicControl.classList.add(
                "visible"
            );

            musicControl.classList.remove(
                "muted"
            );
        }
    }


    function stopMusic() {

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


    function toggleMusic() {

        if (!audioStarted) {
            return;
        }

        musicEnabled =
            !musicEnabled;

        if (musicEnabled) {

            startMusic();

        } else {

            stopMusic();

        }
    }


    /* =========================================================
       START AUDIO AFTER USER INTERACTION
    ========================================================= */

    async function startAudioFromInteraction() {

        const started =
            await unlockAudio();

        if (!started) {
            return;
        }

        /*
         * Start the gentle BGM only once.
         */

        startMusic();
    }


    /* =========================================================
       LOADING SCREEN
    ========================================================= */

    setTimeout(function () {

        if (loadingScreen) {

            loadingScreen.classList.add(
                "hide"
            );

        }

    }, 1500);


    /* =========================================================
       SCREEN TRANSITION
    ========================================================= */

    function showScreen(
        screenToShow
    ) {

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

    async function openGift() {

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


        /*
         * This click is a genuine user gesture.
         * Unlock audio here.
         */

        await startAudioFromInteraction();


        envelope.classList.add(
            "opening"
        );


        if (openGiftButton) {

            openGiftButton.disabled =
                true;

        }


        /*
         * Only TWO audio events here:
         *
         * 1. subtle click
         * 2. envelope opening
         *
         * No unnecessary confetti sound.
         */

        playClick();

        setTimeout(
            function () {

                playEnvelopeOpen();

            },
            90
        );


        createConfetti(28);


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


    /* =========================================================
       ENTRANCE BUTTON
    ========================================================= */

    if (curiousButton) {

        curiousButton.addEventListener(
            "click",
            async function () {

                await startAudioFromInteraction();

                playClick();

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

    async function checkPassword() {

        if (!passwordInput) {
            return;
        }


        await startAudioFromInteraction();


        const enteredPassword =
            passwordInput.value.trim();


        if (
            enteredPassword ===
            correctPassword
        ) {


            /*
             * Button click is intentionally
             * not played again here.
             *
             * The success sound takes over.
             */

            if (unlockButton) {

                unlockButton.disabled =
                    true;

                unlockButton.textContent =
                    "CHECKING... 👀";

            }


            passwordInput.classList.add(
                "unlock-success"
            );


            playSuccessSound();

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


            /*
             * Wrong password gets ONE sound only.
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


    if (unlockButton) {

        unlockButton.addEventListener(
            "click",
            async function () {

                await startAudioFromInteraction();

                /*
                 * Don't add normal click sound here.
                 * Password result sound replaces it.
                 */

                checkPassword();

            }
        );

    }


    /* =========================================================
       PASSWORD ENTER KEY
    ========================================================= */

    if (passwordInput) {


        passwordInput.addEventListener(
            "keydown",
            async function (event) {

                await startAudioFromInteraction();


                if (
                    event.key === "Enter"
                ) {

                    checkPassword();

                }

            }
        );


        /*
         * Password typing.
         */

        passwordInput.addEventListener(
            "input",
            function () {

                const oldValue =
                    passwordInput.value;


                passwordInput.value =
                    passwordInput.value.replace(
                        /\D/g,
                        ""
                    );


                if (
                    passwordInput.value !==
                    oldValue
                ) {
                    return;
                }


                playTypingSound();

            }
        );
    }


    /* =========================================================
       TRY AGAIN
    ========================================================= */

    if (tryAgainButton) {

        tryAgainButton.addEventListener(
            "click",
            async function () {

                await startAudioFromInteraction();

                playClick();


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
            async function () {

                await startAudioFromInteraction();


                if (successPopup) {

                    successPopup.classList.remove(
                        "show"
                    );

                }


                /*
                 * Page transition gets its own
                 * sound sequence.
                 */

                playTransitionSound();


                createConfetti(45);


                /*
                 * Give the transition sound
                 * a moment before leaving.
                 */

                setTimeout(
                    function () {

                        /*
                         * Stop our synthesized BGM.
                         */

                        stopMusic();


                        /*
                         * Page 2 filename.
                         */

                        window.location.href =
                            "page2.html";

                    },
                    850
                );

            }
        );
    }


    /* =========================================================
       MUSIC CONTROL
    ========================================================= */

    if (musicControl) {

        musicControl.addEventListener(
            "click",
            async function () {

                await startAudioFromInteraction();

                toggleMusic();

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
       INTENTIONALLY SILENT
    ========================================================= */

    const cameras =
        document.querySelectorAll(
            ".camera"
        );


    cameras.forEach(
        function (camera) {

            camera.addEventListener(
                "click",
                async function () {

                    /*
                     * Unlock audio if needed,
                     * but DO NOT play a sound.
                     */

                    await startAudioFromInteraction();


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


                    /*
                     * Visual confetti only.
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


    /* =========================================================
       GLOBAL BUTTON CLICK SOUND
       ONLY FOR BUTTONS NOT ALREADY
       HANDLED BY SPECIAL AUDIO
    ========================================================= */

    const ordinaryButtons =
        document.querySelectorAll(
            "button"
        );


    ordinaryButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    /*
                     * Special buttons already
                     * have their own sound.
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
                            button
                        )
                    ) {

                        return;

                    }


                    playClick();

                }
            );

        }
    );


    /* =========================================================
       CLEANUP WHEN PAGE IS HIDDEN
    ========================================================= */

    document.addEventListener(
        "visibilitychange",
        function () {

            if (!audioContext) {
                return;
            }


            if (
                document.hidden
            ) {

                if (
                    audioContext.state ===
                    "running"
                ) {

                    audioContext.suspend();

                }

            } else {

                if (
                    audioStarted &&
                    musicEnabled
                ) {

                    audioContext
                        .resume()
                        .catch(
                            function () {}
                        );

                }

            }

        }
    );


});
