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

    const musicControl = document.getElementById("music-control");
    const confettiLayer = document.getElementById("confetti-layer");


    /* =========================================================
       PASSWORD
    ========================================================= */

    const correctPassword = "0309";


    /* =========================================================
       AUDIO ENGINE
       
       Everything below is generated using Web Audio API.
       NO AUDIO FILES ARE REQUIRED.
    ========================================================= */

    let audioContext = null;
    let masterGain = null;
    let musicGain = null;
    let musicStarted = false;
    let audioUnlocked = false;

    let musicTimer = null;
    let musicStep = 0;

    let lastClickTime = 0;
    let lastTypingTime = 0;
    let lastCameraTime = 0;

    let musicMuted = false;


    /* =========================================================
       CREATE AUDIO ENGINE
    ========================================================= */

    function createAudioEngine() {

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

        musicGain =
            audioContext.createGain();

        masterGain.gain.value = 0.55;
        musicGain.gain.value = 0.16;

        musicGain.connect(masterGain);
        masterGain.connect(audioContext.destination);

        audioUnlocked = true;
    }


    /* =========================================================
       RESUME AUDIO
    ========================================================= */

    function unlockAudio() {

        createAudioEngine();

        if (!audioContext) {
            return;
        }

        if (audioContext.state === "suspended") {
            audioContext.resume();
        }

        audioUnlocked = true;

        if (!musicStarted) {
            startCodedMusic();
        }
    }


    /* =========================================================
       MASTER SOUND
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
        oscillator.stop(now + duration + 0.03);
    }


    /* =========================================================
       SOFT CLICK
    ========================================================= */

    function clickSound() {

        const now =
            performance.now();

        if (now - lastClickTime < 90) {
            return;
        }

        lastClickTime = now;

        playTone(
            650,
            0.055,
            0.045,
            "sine"
        );

        playTone(
            920,
            0.035,
            0.018,
            "sine",
            0.018
        );
    }


    /* =========================================================
       PASSWORD TYPING
    ========================================================= */

    function typingSound() {

        const now =
            performance.now();

        if (now - lastTypingTime < 75) {
            return;
        }

        lastTypingTime = now;

        playTone(
            720,
            0.045,
            0.035,
            "sine"
        );
    }


    /* =========================================================
       WRONG PASSWORD
    ========================================================= */

    function wrongPasswordSound() {

        if (!audioContext) {
            return;
        }

        playTone(
            330,
            0.13,
            0.075,
            "sine"
        );

        playTone(
            245,
            0.18,
            0.065,
            "sine",
            0.10
        );

        playTone(
            180,
            0.22,
            0.045,
            "sine",
            0.21
        );
    }


    /* =========================================================
       CORRECT PASSWORD
    ========================================================= */

    function successSound() {

        if (!audioContext) {
            return;
        }

        playTone(
            523.25,
            0.16,
            0.065,
            "sine"
        );

        playTone(
            659.25,
            0.16,
            0.065,
            "sine",
            0.09
        );

        playTone(
            783.99,
            0.20,
            0.075,
            "sine",
            0.18
        );

        playTone(
            1046.50,
            0.35,
            0.055,
            "sine",
            0.30
        );
    }


    /* =========================================================
       ENVELOPE OPEN SOUND
    ========================================================= */

    function envelopeSound() {

        if (!audioContext) {
            return;
        }

        playTone(
            392,
            0.18,
            0.035,
            "sine"
        );

        playTone(
            523.25,
            0.20,
            0.04,
            "sine",
            0.10
        );

        playTone(
            659.25,
            0.25,
            0.045,
            "sine",
            0.20
        );

        playTone(
            783.99,
            0.35,
            0.035,
            "sine",
            0.31
        );
    }


    /* =========================================================
       PAGE TRANSITION SOUND
    ========================================================= */

    function transitionSound() {

        if (!audioContext) {
            return;
        }

        const oscillator =
            audioContext.createOscillator();

        const gain =
            audioContext.createGain();

        const now =
            audioContext.currentTime;

        oscillator.type = "sine";

        oscillator.frequency.setValueAtTime(
            280,
            now
        );

        oscillator.frequency.exponentialRampToValueAtTime(
            950,
            now + 0.55
        );

        gain.gain.setValueAtTime(
            0.0001,
            now
        );

        gain.gain.exponentialRampToValueAtTime(
            0.055,
            now + 0.08
        );

        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            now + 0.62
        );

        oscillator.connect(gain);
        gain.connect(masterGain);

        oscillator.start(now);
        oscillator.stop(now + 0.65);
    }


    /* =========================================================
       CAMERA CLICK
    ========================================================= */

    function cameraSound() {

        const now =
            performance.now();

        if (now - lastCameraTime < 500) {
            return;
        }

        lastCameraTime = now;

        playTone(
            1100,
            0.045,
            0.055,
            "square"
        );

        playTone(
            600,
            0.08,
            0.035,
            "sine",
            0.045
        );
    }


    /* =========================================================
       CUTE BGM
       
       Very soft repeating melody.
       It intentionally stays in the background.
    ========================================================= */

    const melody = [

        523.25,
        659.25,
        783.99,
        659.25,

        587.33,
        659.25,
        698.46,
        587.33,

        523.25,
        659.25,
        783.99,
        880.00,

        783.99,
        659.25,
        587.33,
        523.25

    ];


    function playMusicNote(frequency) {

        if (
            !audioContext ||
            !musicGain ||
            musicMuted
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
            frequency,
            now
        );

        gain.gain.setValueAtTime(
            0.0001,
            now
        );

        gain.gain.exponentialRampToValueAtTime(
            0.045,
            now + 0.08
        );

        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            now + 0.55
        );

        oscillator.connect(gain);
        gain.connect(musicGain);

        oscillator.start(now);
        oscillator.stop(now + 0.60);
    }


    function startCodedMusic() {

        if (musicStarted) {
            return;
        }

        if (!audioContext) {
            return;
        }

        musicStarted = true;

        musicStep = 0;

        playMusicLoop();
    }


    function playMusicLoop() {

        if (!musicStarted) {
            return;
        }

        if (!musicMuted) {

            playMusicNote(
                melody[musicStep]
            );

            musicStep++;

            if (
                musicStep >=
                melody.length
            ) {
                musicStep = 0;
            }

        }

        musicTimer =
            setTimeout(
                playMusicLoop,
                650
            );
    }


    /* =========================================================
       MUSIC BUTTON
    ========================================================= */

    function updateMusicButton() {

        if (!musicControl) {
            return;
        }

        musicControl.classList.add(
            "visible"
        );

        if (musicMuted) {

            musicControl.classList.add(
                "muted"
            );

            musicControl.textContent = "🔇";

        } else {

            musicControl.classList.remove(
                "muted"
            );

            musicControl.textContent = "♫";
        }
    }


    if (musicControl) {

        musicControl.addEventListener(
            "click",
            function () {

                unlockAudio();

                musicMuted =
                    !musicMuted;

                if (musicMuted) {

                    if (musicGain) {

                        musicGain.gain.setTargetAtTime(
                            0,
                            audioContext.currentTime,
                            0.08
                        );
                    }

                } else {

                    if (musicGain) {

                        musicGain.gain.setTargetAtTime(
                            0.16,
                            audioContext.currentTime,
                            0.08
                        );
                    }
                }

                updateMusicButton();

            }
        );
    }


    /* =========================================================
       GLOBAL AUDIO UNLOCK
       
       Browsers require a user gesture before audio.
    ========================================================= */

    document.addEventListener(
        "pointerdown",
        function () {

            unlockAudio();

        },
        {
            once: true
        }
    );


    /* =========================================================
       BUTTON CLICK SOUNDS
    ========================================================= */

    const interactiveButtons =
        document.querySelectorAll(
            "button"
        );

    interactiveButtons.forEach(
        function (button) {

            if (
                button.id ===
                "music-control"
            ) {
                return;
            }

            button.addEventListener(
                "click",
                function () {

                    unlockAudio();
                    clickSound();

                }
            );

        }
    );


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

    function createConfetti(
        amount
    ) {

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

        unlockAudio();

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

        envelope.classList.add(
            "opening"
        );

        if (openGiftButton) {

            openGiftButton.disabled =
                true;
        }

        envelopeSound();

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
       ENTRANCE → PASSWORD
    ========================================================= */

    if (curiousButton) {

        curiousButton.addEventListener(
            "click",
            function () {

                unlockAudio();

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
       PASSWORD TYPING
    ========================================================= */

    if (passwordInput) {

        passwordInput.addEventListener(
            "input",
            function () {

                unlockAudio();

                const oldValue =
                    passwordInput.value;

                const cleanValue =
                    oldValue.replace(
                        /\D/g,
                        ""
                    );

                passwordInput.value =
                    cleanValue;

                if (
                    cleanValue.length >
                    0
                ) {

                    typingSound();

                }

            }
        );


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

    }


    /* =========================================================
       PASSWORD CHECK
    ========================================================= */

    function checkPassword() {

        unlockAudio();

        if (!passwordInput) {
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


        /* =====================================================
           WRONG
        ===================================================== */

        else {

            passwordInput.value = "";

            wrongPasswordSound();

            if (wrongPopup) {

                wrongPopup.classList.add(
                    "show"
                );

            }

        }
    }


    /* =========================================================
       TRY AGAIN
    ========================================================= */

    if (tryAgainButton) {

        tryAgainButton.addEventListener(
            "click",
            function () {

                unlockAudio();

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

                unlockAudio();

                if (successPopup) {

                    successPopup.classList.remove(
                        "show"
                    );

                }

                createConfetti(45);

                transitionSound();

                setTimeout(
                    function () {

                        window.location.href =
                            "page2.html";

                    },
                    700
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
                        rect.top - 45 + "px";

                    document.body.appendChild(
                        message
                    );

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
