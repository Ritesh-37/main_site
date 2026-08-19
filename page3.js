document.addEventListener(
    "DOMContentLoaded",
    function () {

        /* =====================================================
           HELPERS
        ====================================================== */

        function get(id) {
            return document.getElementById(id);
        }


        function showSection(id) {

            document
                .querySelectorAll(".page-section")
                .forEach(function (section) {

                    section.classList.remove("active");

                });

            setTimeout(function () {

                const section = get(id);

                if (section) {
                    section.classList.add("active");
                }

            }, 80);
        }


        /* =====================================================
           AUDIO ELEMENTS
        ====================================================== */

        const cameraSound =
            get("camera-sound");

        const wineSound =
            get("wine-sound");

        const glassSound =
            get("glass-sound");


        /* =====================================================
           WEB AUDIO ENGINE
           Used for custom sounds + JAZZ BGM
        ====================================================== */

        let audioContext = null;
        let masterGain = null;
        let musicGain = null;
        let effectGain = null;

        let audioUnlocked = false;
        let jazzPlaying = false;
        let jazzMuted = false;

        let jazzTimer = null;
        let jazzStep = 0;


        function initAudio() {

            if (!audioContext) {

                try {

                    audioContext =
                        new (
                            window.AudioContext ||
                            window.webkitAudioContext
                        )();

                } catch (error) {

                    console.log(
                        "Web Audio is not supported."
                    );

                    return false;
                }
            }


            if (
                audioContext.state === "suspended"
            ) {

                audioContext.resume()
                    .catch(function () {});

            }


            if (!masterGain) {

                masterGain =
                    audioContext.createGain();

                musicGain =
                    audioContext.createGain();

                effectGain =
                    audioContext.createGain();


                masterGain.gain.value =
                    0.78;

                musicGain.gain.value =
                    0.12;

                effectGain.gain.value =
                    0.30;


                musicGain.connect(
                    masterGain
                );

                effectGain.connect(
                    masterGain
                );

                masterGain.connect(
                    audioContext.destination
                );

            }


            audioUnlocked = true;

            return true;
        }


        function unlockAudio() {

            initAudio();

            if (
                audioContext &&
                audioContext.state === "suspended"
            ) {

                audioContext.resume()
                    .catch(function () {});

            }


            if (!jazzMuted) {
                startJazzBGM();
            }

        }


        document.addEventListener(
            "click",
            unlockAudio,
            {
                once: true
            }
        );


        document.addEventListener(
            "touchstart",
            unlockAudio,
            {
                once: true,
                passive: true
            }
        );


        /* =====================================================
           BASIC SYNTH TONE
        ====================================================== */

        function tone(
            frequency,
            duration,
            volume,
            type,
            destination,
            delay
        ) {

            if (!initAudio()) {
                return;
            }


            const start =
                audioContext.currentTime +
                (delay || 0);


            const oscillator =
                audioContext.createOscillator();

            const gain =
                audioContext.createGain();


            oscillator.type =
                type || "sine";


            oscillator.frequency.setValueAtTime(
                frequency,
                start
            );


            gain.gain.setValueAtTime(
                0.0001,
                start
            );


            gain.gain.exponentialRampToValueAtTime(
                volume,
                start + 0.025
            );


            gain.gain.exponentialRampToValueAtTime(
                0.0001,
                start + duration
            );


            oscillator.connect(gain);

            gain.connect(
                destination || effectGain
            );


            oscillator.start(start);

            oscillator.stop(
                start + duration + 0.04
            );

        }


        /* =====================================================
           GENERIC AUDIO FILE PLAYER
        ====================================================== */

        function playSound(
            audio,
            volume
        ) {

            if (!audio) {
                return;
            }

            try {

                audio.pause();

                audio.currentTime = 0;

                audio.volume =
                    volume || 0.5;

                const promise =
                    audio.play();

                if (promise) {
                    promise.catch(
                        function () {}
                    );
                }

            } catch (error) {

                console.log(
                    "Audio error:",
                    error
                );

            }

        }


        /* =====================================================
           SOFT UI CLICK
        ====================================================== */

        function uiClickSound() {

            tone(
                660,
                0.07,
                0.025,
                "sine"
            );

            tone(
                880,
                0.06,
                0.018,
                "sine",
                effectGain,
                0.035
            );

        }


        /* =====================================================
           CAMERA COUNTDOWN SOUND
        ====================================================== */

        function countdownBeep() {

            tone(
                520,
                0.12,
                0.055,
                "sine"
            );

            tone(
                780,
                0.08,
                0.025,
                "triangle",
                effectGain,
                0.04
            );

        }


        /* =====================================================
           CAMERA READY / SHUTTER SOUND
        ====================================================== */

        function cameraReadySound() {

            tone(
                880,
                0.08,
                0.035,
                "sine"
            );

            tone(
                1174,
                0.14,
                0.045,
                "triangle",
                effectGain,
                0.06
            );

        }


        /* =====================================================
           BOUQUET SHIMMER
        ====================================================== */

        function bouquetShimmerSound() {

            tone(
                659.25,
                0.25,
                0.035,
                "sine"
            );

            tone(
                783.99,
                0.30,
                0.032,
                "sine",
                effectGain,
                0.08
            );

            tone(
                1046.50,
                0.42,
                0.025,
                "triangle",
                effectGain,
                0.17
            );

            tone(
                1318.51,
                0.45,
                0.018,
                "sine",
                effectGain,
                0.26
            );

        }


        /* =====================================================
           ENVELOPE OPENING SOUND
        ====================================================== */

        function envelopeOpenSound() {

            tone(
                392,
                0.25,
                0.025,
                "sine"
            );

            tone(
                523.25,
                0.30,
                0.030,
                "sine",
                effectGain,
                0.08
            );

            tone(
                659.25,
                0.38,
                0.035,
                "triangle",
                effectGain,
                0.16
            );

            tone(
                783.99,
                0.50,
                0.025,
                "sine",
                effectGain,
                0.26
            );

        }


        /* =====================================================
           WINE POUR
           EXISTING MP3 + SOFT SYNTH LAYER
        ====================================================== */

        function winePourEffect() {

            playSound(
                wineSound,
                0.55
            );


            /*
               Tiny musical sparkle on top
               of the real pouring sound.
            */

            tone(
                392,
                0.16,
                0.018,
                "sine"
            );

            tone(
                523.25,
                0.18,
                0.020,
                "sine",
                effectGain,
                0.08
            );

        }


        /* =====================================================
           GLASS CLINK
           EXISTING MP3 + SMALL CHIME
        ====================================================== */

        function glassClinkEffect() {

            playSound(
                glassSound,
                0.65
            );


            tone(
                1046.50,
                0.20,
                0.030,
                "sine"
            );

            tone(
                1318.51,
                0.28,
                0.020,
                "triangle",
                effectGain,
                0.07
            );

        }


        /* =====================================================
           DIZZY / DRUNK SOUND
           PROCEDURAL
        ====================================================== */

        function dizzySound() {

            if (!initAudio()) {
                return;
            }


            const start =
                audioContext.currentTime;


            const oscillator =
                audioContext.createOscillator();

            const gain =
                audioContext.createGain();


            oscillator.type =
                "sine";


            /*
               Slow pitch wobble.
               This gives the "woooooo"
               dizzy feeling.
            */

            oscillator.frequency.setValueAtTime(
                220,
                start
            );


            oscillator.frequency.exponentialRampToValueAtTime(
                110,
                start + 0.8
            );


            oscillator.frequency.exponentialRampToValueAtTime(
                180,
                start + 1.5
            );


            oscillator.frequency.exponentialRampToValueAtTime(
                95,
                start + 2.3
            );


            oscillator.frequency.exponentialRampToValueAtTime(
                140,
                start + 3.2
            );


            gain.gain.setValueAtTime(
                0.0001,
                start
            );


            gain.gain.exponentialRampToValueAtTime(
                0.07,
                start + 0.15
            );


            gain.gain.exponentialRampToValueAtTime(
                0.0001,
                start + 3.3
            );


            oscillator.connect(gain);

            gain.connect(
                effectGain
            );


            oscillator.start(start);

            oscillator.stop(
                start + 3.4
            );


            /*
               High dreamy wobble.
            */

            tone(
                440,
                1.2,
                0.018,
                "triangle",
                effectGain,
                0.2
            );

            tone(
                330,
                1.5,
                0.014,
                "sine",
                effectGain,
                0.9
            );

        }


        /* =====================================================
           JAZZ BGM
           Cute / romantic / classy
        ====================================================== */

        function startJazzBGM() {

            if (
                jazzPlaying ||
                jazzMuted
            ) {
                return;
            }


            if (!initAudio()) {
                return;
            }


            jazzPlaying = true;

            jazzStep = 0;

            playJazzLoop();

        }


        function playJazzLoop() {

            if (
                !jazzPlaying ||
                jazzMuted
            ) {
                return;
            }


            /*
               C major / Am7 inspired
               cute lounge-jazz melody.
            */

            const melody = [

                523.25,
                659.25,
                783.99,
                659.25,

                587.33,
                698.46,
                880.00,
                698.46,

                659.25,
                783.99,
                987.77,
                783.99,

                698.46,
                659.25,
                587.33,
                523.25

            ];


            const note =
                melody[jazzStep];


            tone(
                note,
                0.55,
                0.018,
                "sine",
                musicGain
            );


            /*
               Soft jazz chord tones.
            */

            if (
                jazzStep % 4 === 0
            ) {

                tone(
                    note / 2,
                    0.75,
                    0.009,
                    "triangle",
                    musicGain
                );

            }


            jazzStep++;

            if (
                jazzStep >=
                melody.length
            ) {

                jazzStep = 0;

            }


            jazzTimer =
                setTimeout(
                    playJazzLoop,
                    430
                );

        }


        function stopJazzBGM() {

            jazzPlaying = false;


            if (jazzTimer) {

                clearTimeout(
                    jazzTimer
                );

                jazzTimer = null;

            }

        }


        /* =====================================================
           INTRO POPUPS
        ====================================================== */

        const introCards =
            document.querySelectorAll(
                ".intro-card"
            );

        let introIndex = 0;


        document
            .querySelectorAll(".intro-next")
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        unlockAudio();

                        uiClickSound();


                        if (
                            introCards[
                                introIndex
                            ]
                        ) {

                            introCards[
                                introIndex
                            ].classList.remove(
                                "active"
                            );

                        }


                        introIndex++;


                        setTimeout(
                            function () {

                                if (
                                    introCards[
                                        introIndex
                                    ]
                                ) {

                                    introCards[
                                        introIndex
                                    ].classList.add(
                                        "active"
                                    );

                                }

                            },
                            120
                        );

                    }
                );

            });


        /* =====================================================
           CAMERA START
        ====================================================== */

        const startCamera =
            get("start-camera");


        if (startCamera) {

            startCamera.addEventListener(
                "click",
                function () {

                    unlockAudio();

                    uiClickSound();

                    showSection(
                        "camera-section"
                    );

                }
            );

        }


        /* =====================================================
           CAMERA
        ====================================================== */

        const camera =
            get("camera");

        const countdown =
            get("countdown");

        const countdownNumber =
            get("countdown-number");

        const flash =
            get("flash");

        const photoResult =
            get("photo-result");


        let cameraUsed = false;


        if (camera) {

            camera.addEventListener(
                "click",
                function () {

                    if (cameraUsed) {
                        return;
                    }

                    unlockAudio();

                    cameraUsed = true;

                    startCountdown();

                }
            );

        }


        function startCountdown() {

            countdown.classList.add(
                "active"
            );


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
                    "countdownPop .9s ease";


                countdownBeep();


                if (
                    index <
                    numbers.length - 1
                ) {

                    index++;


                    setTimeout(
                        showNumber,
                        900
                    );

                } else {

                    setTimeout(
                        takePhoto,
                        900
                    );

                }

            }


            showNumber();

        }


        /* =====================================================
           TAKE PHOTO
        ====================================================== */

        function takePhoto() {

            countdown.classList.remove(
                "active"
            );


            cameraReadySound();


            playSound(
                cameraSound,
                0.7
            );


            flash.classList.add(
                "active"
            );


            setTimeout(
                function () {

                    photoResult.classList.add(
                        "show"
                    );

                },
                400
            );


            setTimeout(
                function () {

                    flash.classList.remove(
                        "active"
                    );

                },
                900
            );

        }


        /* =====================================================
           PHOTO → BOUQUET
        ====================================================== */

        const photoContinue =
            get("photo-continue");


        if (photoContinue) {

            photoContinue.addEventListener(
                "click",
                function () {

                    unlockAudio();

                    uiClickSound();


                    photoResult.classList.remove(
                        "show"
                    );


                    setTimeout(
                        function () {

                            showSection(
                                "bouquet-section"
                            );

                        },
                        300
                    );

                }
            );

        }


        /* =====================================================
           BOUQUET
        ====================================================== */

        const bouquet =
            get("bouquet");

        const bouquetText =
            get("bouquet-text");


        let bouquetClicked = false;


        if (bouquet) {

            bouquet.addEventListener(
                "click",
                function () {

                    if (bouquetClicked) {
                        return;
                    }


                    unlockAudio();

                    bouquetClicked = true;


                    bouquet.classList.add(
                        "glowing"
                    );


                    bouquetShimmerSound();


                    bouquetText.textContent =
                        "For the prettiest girl I know... ❤️";


                    createBouquetSparkles();


                    setTimeout(
                        function () {

                            bouquetText.textContent =
                                "I have something else for you... ✦";

                        },
                        1700
                    );


                    setTimeout(
                        function () {

                            showSection(
                                "letter-section"
                            );

                        },
                        3000
                    );

                }
            );

        }


        function createBouquetSparkles() {

            const symbols = [
                "✦",
                "✧",
                "✨",
                "♥"
            ];


            for (
                let i = 0;
                i < 22;
                i++
            ) {

                const sparkle =
                    document.createElement(
                        "span"
                    );


                sparkle.textContent =
                    symbols[
                        Math.floor(
                            Math.random() *
                            symbols.length
                        )
                    ];


                sparkle.style.position =
                    "fixed";


                sparkle.style.left =
                    (
                        25 +
                        Math.random() * 50
                    ) + "%";


                sparkle.style.top =
                    (
                        25 +
                        Math.random() * 40
                    ) + "%";


                sparkle.style.fontSize =
                    (
                        12 +
                        Math.random() * 15
                    ) + "px";


                sparkle.style.color =
                    "#b52d51";


                sparkle.style.pointerEvents =
                    "none";


                sparkle.style.zIndex =
                    "300";


                document.body.appendChild(
                    sparkle
                );


                const x =
                    (
                        Math.random() - .5
                    ) * 180;


                const y =
                    -(
                        40 +
                        Math.random() * 140
                    );


                sparkle.animate(
                    [
                        {
                            transform:
                                "translate(0,0) scale(.3)",
                            opacity: 0
                        },
                        {
                            transform:
                                "translate(0,0) scale(1)",
                            opacity: 1
                        },
                        {
                            transform:
                                "translate(" +
                                x +
                                "px," +
                                y +
                                "px) scale(.2)",
                            opacity: 0
                        }
                    ],
                    {
                        duration:
                            1000 +
                            Math.random() * 700,

                        easing:
                            "ease-out"
                    }
                );


                setTimeout(
                    function () {

                        sparkle.remove();

                    },
                    1900
                );

            }

        }


        /* =====================================================
           ENVELOPE
        ====================================================== */

        const envelope =
            get("envelope");

        const postcard =
            get("postcard");

        const envelopeText =
            get("envelope-text");


        let envelopeOpened = false;


        if (envelope) {

            envelope.addEventListener(
                "click",
                function () {

                    if (envelopeOpened) {
                        return;
                    }


                    unlockAudio();

                    envelopeOpened = true;


                    envelope.classList.add(
                        "open"
                    );


                    envelopeOpenSound();


                    envelopeText.textContent =
                        "Open it... it's just for you. ❤️";


                    setTimeout(
                        function () {

                            postcard.classList.add(
                                "show"
                            );

                        },
                        900
                    );

                }
            );

        }


        /* =====================================================
           POSTCARD → WINE
        ====================================================== */

        const wineContinue =
            get("wine-continue");


        if (wineContinue) {

            wineContinue.addEventListener(
                "click",
                function () {

                    unlockAudio();

                    uiClickSound();


                    postcard.classList.remove(
                        "show"
                    );


                    envelope.classList.remove(
                        "open"
                    );


                    setTimeout(
                        function () {

                            showSection(
                                "wine-section"
                            );

                        },
                        400
                    );

                }
            );

        }


        /* =====================================================
           WINE
        ====================================================== */

        const bottle =
            get("wine-bottle");

        const glasses =
            document.querySelectorAll(
                ".wine-glass"
            );

        const bottleLiquid =
            document.querySelector(
                ".bottle-liquid"
            );

        const glassWine =
            document.querySelectorAll(
                ".glass-wine"
            );

        const wineCounter =
            get("wine-counter");

        const wineInstruction =
            get("wine-instruction");


        let pourCount = 0;

        const maximumPours = 5;

        let glassesFilled = false;

        let wineFinished = false;


        /* =====================================================
           BOTTLE CLICK
        ====================================================== */

        if (bottle) {

            bottle.addEventListener(
                "click",
                function () {

                    unlockAudio();


                    if (wineFinished) {
                        return;
                    }


                    if (glassesFilled) {

                        wineInstruction.textContent =
                            "Now click either glass... 🍷";

                        return;

                    }


                    if (
                        pourCount >=
                        maximumPours
                    ) {

                        return;

                    }


                    pourCount++;


                    /*
                       RESTORED WINE POUR SOUND
                    */

                    winePourEffect();


                    const bottleLevel =
                        100 -
                        (
                            pourCount *
                            20
                        );


                    bottleLiquid.style.height =
                        bottleLevel + "%";


                    const glassLevel =
                        pourCount * 20;


                    glassWine.forEach(
                        function (wine) {

                            wine.style.height =
                                glassLevel + "%";

                        }
                    );


                    wineCounter.textContent =
                        "POUR " +
                        pourCount +
                        " / 5";


                    if (
                        pourCount <
                        maximumPours
                    ) {

                        wineInstruction.textContent =
                            "A little more... 🍷❤️";

                    } else {

                        glassesFilled = true;


                        wineInstruction.textContent =
                            "Cheers, sweetheart... now drink. 🍷";


                        wineCounter.textContent =
                            "CHEERS ❤️";

                    }

                }
            );

        }


        /* =====================================================
           GLASS CLICK
        ====================================================== */

        glasses.forEach(
            function (glass) {

                glass.addEventListener(
                    "click",
                    function () {

                        unlockAudio();


                        if (wineFinished) {
                            return;
                        }


                        if (!glassesFilled) {

                            wineInstruction.textContent =
                                "Pour the wine first, sweetheart. ❤️";

                            return;

                        }


                        /*
                           RESTORED GLASS CLINK
                        */

                        glassClinkEffect();


                        glassWine.forEach(
                            function (wine) {

                                wine.style.height =
                                    "0%";

                            }
                        );


                        glassesFilled = false;


                        if (
                            pourCount >=
                            maximumPours
                        ) {

                            wineFinished = true;


                            wineInstruction.textContent =
                                "Well... that was quick. 😂";


                            wineCounter.textContent =
                                "EMPTY";


                            setTimeout(
                                startDrunkEnding,
                                1000
                            );

                        }

                    }
                );

            }
        );


        /* =====================================================
           DRUNK ENDING
        ====================================================== */

        function startDrunkEnding() {

            const overlay =
                get("drunk-overlay");


            /*
               RESTORED DIZZY SOUND
            */

            dizzySound();


            if (overlay) {

                overlay.classList.add(
                    "active"
                );

            }


            /*
               Slow page sway.
            */

            document.body.animate(
                [
                    {
                        transform:
                            "rotate(0deg) scale(1)"
                    },
                    {
                        transform:
                            "rotate(-1deg) scale(1.02)"
                    },
                    {
                        transform:
                            "rotate(1deg) scale(1.04)"
                    },
                    {
                        transform:
                            "rotate(-1deg) scale(1.06)"
                    },
                    {
                        transform:
                            "rotate(1deg) scale(1.08)"
                    },
                    {
                        transform:
                            "rotate(0deg) scale(1.1)"
                    }
                ],
                {
                    duration: 5000,
                    easing: "ease-in-out",
                    fill: "forwards"
                }
            );


            setTimeout(
                function () {

                    const popup =
                        get("drunk-popup");


                    if (popup) {

                        popup.classList.add(
                            "show"
                        );

                    }

                },
                4200
            );

        }


        /* =====================================================
           NEXT PAGE
        ====================================================== */

        const nextPage =
            get("next-page");


        if (nextPage) {

            nextPage.addEventListener(
                "click",
                function () {

                    unlockAudio();

                    uiClickSound();


                    setTimeout(
                        function () {

                            window.location.href =
                                "page4.html";

                        },
                        120
                    );

                }
            );

        }


        /* =====================================================
           START JAZZ
        ====================================================== */

        /*
           Do not force autoplay.
           First user interaction unlocks it.
        */

    }
);
