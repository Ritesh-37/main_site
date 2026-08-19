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
       AUDIO SYSTEM
       
       IMPORTANT:
       Only ONE sound effect is allowed at
       a time. This prevents clutter.
    ========================================== */

    let audioUnlocked = false;
    let musicStarted = false;
    let effectBusy = false;

    let currentEffect = null;


    /* =========================================
       AUDIO SETTINGS
    ========================================== */

    if (backgroundMusic) {

        backgroundMusic.volume = 0.22;

    }


    /* =========================================
       CREATE SIMPLE AUDIO EFFECTS
       
       These use the browser's Web Audio API.
       No extra sound files are required.
    ========================================== */

    let audioContext = null;


    function getAudioContext() {

        if (!audioContext) {

            const AudioContext =
                window.AudioContext ||
                window.webkitAudioContext;

            if (!AudioContext) {
                return null;
            }

            audioContext =
                new AudioContext();

        }

        return audioContext;

    }


    /* =========================================
       SOFT CLICK
       
       Used very rarely.
    ========================================== */

    function softClick() {

        if (!audioUnlocked) {
            return;
        }

        const ctx =
            getAudioContext();

        if (!ctx) {
            return;
        }

        if (ctx.state === "suspended") {
            ctx.resume();
        }

        const oscillator =
            ctx.createOscillator();

        const gain =
            ctx.createGain();

        oscillator.type = "sine";

        oscillator.frequency.setValueAtTime(
            520,
            ctx.currentTime
        );

        oscillator.frequency.exponentialRampToValueAtTime(
            390,
            ctx.currentTime + 0.07
        );

        gain.gain.setValueAtTime(
            0.0001,
            ctx.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
            0.045,
            ctx.currentTime + 0.008
        );

        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            ctx.currentTime + 0.08
        );

        oscillator.connect(gain);
        gain.connect(ctx.destination);

        oscillator.start();
        oscillator.stop(
            ctx.currentTime + 0.09
        );

    }


    /* =========================================
       ENVELOPE SOUND
       
       Soft magical "whoosh/chime".
    ========================================== */

    function envelopeSound() {

        if (!audioUnlocked) {
            return;
        }

        const ctx =
            getAudioContext();

        if (!ctx) {
            return;
        }

        if (ctx.state === "suspended") {
            ctx.resume();
        }

        const oscillator =
            ctx.createOscillator();

        const gain =
            ctx.createGain();

        oscillator.type = "sine";

        oscillator.frequency.setValueAtTime(
            330,
            ctx.currentTime
        );

        oscillator.frequency.exponentialRampToValueAtTime(
            660,
            ctx.currentTime + 0.28
        );

        gain.gain.setValueAtTime(
            0.0001,
            ctx.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
            0.06,
            ctx.currentTime + 0.04
        );

        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            ctx.currentTime + 0.38
        );

        oscillator.connect(gain);
        gain.connect(ctx.destination);

        oscillator.start();

        oscillator.stop(
            ctx.currentTime + 0.4
        );

    }


    /* =========================================
       WRONG PASSWORD
       
       Very short, soft "boop".
    ========================================== */

    function wrongSound() {

        if (!audioUnlocked) {
            return;
        }

        const ctx =
            getAudioContext();

        if (!ctx) {
            return;
        }

        if (ctx.state === "suspended") {
            ctx.resume();
        }

        const oscillator =
            ctx.createOscillator();

        const gain =
            ctx.createGain();

        oscillator.type = "sine";

        oscillator.frequency.setValueAtTime(
            240,
            ctx.currentTime
        );

        oscillator.frequency.exponentialRampToValueAtTime(
            170,
            ctx.currentTime + 0.13
        );

        gain.gain.setValueAtTime(
            0.0001,
            ctx.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
            0.045,
            ctx.currentTime + 0.01
        );

        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            ctx.currentTime + 0.16
        );

        oscillator.connect(gain);
        gain.connect(ctx.destination);

        oscillator.start();

        oscillator.stop(
            ctx.currentTime + 0.18
        );

    }


    /* =========================================
       SUCCESS SOUND
       
       Two-note soft magical chime.
    ========================================== */

    function successSound() {

        if (!audioUnlocked) {
            return;
        }

        const ctx =
            getAudioContext();

        if (!ctx) {
            return;
        }

        if (ctx.state === "suspended") {
            ctx.resume();
        }

        const notes = [
            {
                frequency: 523.25,
                delay: 0
            },
            {
                frequency: 659.25,
                delay: 0.13
            }
        ];

        notes.forEach(function (note) {

            const oscillator =
                ctx.createOscillator();

            const gain =
                ctx.createGain();

            oscillator.type = "sine";

            oscillator.frequency.value =
                note.frequency;

            const start =
                ctx.currentTime +
                note.delay;

            gain.gain.setValueAtTime(
                0.0001,
                start
            );

            gain.gain.exponentialRampToValueAtTime(
                0.055,
                start + 0.025
            );

            gain.gain.exponentialRampToValueAtTime(
                0.0001,
                start + 0.45
            );

            oscillator.connect(gain);
            gain.connect(ctx.destination);

            oscillator.start(start);

            oscillator.stop(
                start + 0.48
            );

        });

    }


    /* =========================================
       CAMERA SHUTTER
       
       Kept extremely subtle.
    ========================================== */

    function cameraSound() {

        if (!audioUnlocked) {
            return;
        }

        const ctx =
            getAudioContext();

        if (!ctx) {
            return;
        }

        if (ctx.state === "suspended") {
            ctx.resume();
        }

        const oscillator =
            ctx.createOscillator();

        const gain =
            ctx.createGain();

        oscillator.type = "triangle";

        oscillator.frequency.setValueAtTime(
            900,
            ctx.currentTime
        );

        oscillator.frequency.exponentialRampToValueAtTime(
            420,
            ctx.currentTime + 0.07
        );

        gain.gain.setValueAtTime(
            0.0001,
            ctx.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
            0.035,
            ctx.currentTime + 0.005
        );

        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            ctx.currentTime + 0.09
        );

        oscillator.connect(gain);
        gain.connect(ctx.destination);

        oscillator.start();

        oscillator.stop(
            ctx.currentTime + 0.1
        );

    }


    /* =========================================
       AUDIO UNLOCK
       
       Browser allows audio after the user's
       first real interaction.
    ========================================== */

    function unlockAudio() {

        if (audioUnlocked) {
            return;
        }

        audioUnlocked = true;

        const ctx =
            getAudioContext();

        if (ctx && ctx.state === "suspended") {
            ctx.resume();
        }

        startMusic();

    }


    /* =========================================
       START BGM
       
       Only ONE BGM instance.
    ========================================== */

    function startMusic() {

        if (!backgroundMusic) {
            return;
        }

        if (musicStarted) {
            return;
        }

        backgroundMusic.volume = 0.22;

        const promise =
            backgroundMusic.play();

        if (promise !== undefined) {

            promise
                .then(function () {

                    musicStarted = true;

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
       FIRST USER INTERACTION
    ========================================== */

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


    /* =========================================
       MUSIC CONTROL
    ========================================== */

    if (musicControl) {

        musicControl.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

                unlockAudio();

                if (!backgroundMusic) {
                    return;
                }

                if (backgroundMusic.paused) {

                    backgroundMusic
                        .play()
                        .then(function () {

                            musicStarted = true;

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
       LOADING SCREEN
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
       CONFETTI
       
       VISUAL ONLY.
       NO SOUND.
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
       
       ONE sound only.
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

        unlockAudio();

        envelope.classList.add("opening");

        if (openGiftButton) {

            openGiftButton.disabled = true;

        }

        createConfetti(28);

        envelopeSound();

        setTimeout(function () {

            showScreen(
                entranceScreen
            );

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
       ENTRANCE BUTTON
       
       NO SOUND.
       Keep the experience calm.
    ========================================== */

    if (curiousButton) {

        curiousButton.addEventListener(
            "click",
            function () {

                unlockAudio();

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


    /* =========================================
       PASSWORD CHECK
    ========================================== */

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

            createConfetti(35);

            /* ONE success sound */

            successSound();


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


        }

        /* =====================================
           WRONG PASSWORD
        ===================================== */

        else {

            passwordInput.value = "";

            /* ONE wrong sound */

            wrongSound();

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
       
       NO SOUND.
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
       
       ONE soft click.
    ========================================== */

    if (continueButton) {

        continueButton.addEventListener(
            "click",
            function () {

                unlockAudio();

                softClick();

                if (successPopup) {

                    successPopup.classList.remove(
                        "show"
                    );

                }

                createConfetti(45);

                setTimeout(function () {

                    window.location.href =
                        "page2.html";

                }, 700);

            }
        );

    }


    /* =========================================
       CLOSE POPUPS
       
       NO SOUND.
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
       
       Sound is intentionally subtle.
    ========================================== */

    const cameras =
        document.querySelectorAll(
            ".camera"
        );


    cameras.forEach(function (camera) {

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
                    (rect.top - 45) + "px";


                document.body.appendChild(
                    message
                );


                /*
                 * Visual confetti only.
                 * No additional sound.
                 */

                createConfetti(8);


                setTimeout(function () {

                    message.remove();

                }, 1800);

            }
        );

    });

});
