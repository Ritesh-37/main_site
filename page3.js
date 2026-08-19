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
           ORIGINAL AUDIO ELEMENTS
           KEEPING WINE SOUNDS
        ====================================================== */

        const cameraSound =
            get("camera-sound");

        const wineSound =
            get("wine-sound");

        const glassSound =
            get("glass-sound");


        function playSound(audio, volume) {

            if (!audio) {
                return;
            }

            try {

                audio.pause();

                audio.currentTime = 0;

                audio.volume =
                    volume !== undefined
                        ? volume
                        : 0.5;

                const promise =
                    audio.play();

                if (promise) {
                    promise.catch(function () {});
                }

            } catch (error) {

                console.log(
                    "Audio error:",
                    error
                );

            }
        }


        /* =====================================================
           PROCEDURAL AUDIO ENGINE
        ====================================================== */

        let audioContext = null;

        let masterGain = null;

        let jazzGain = null;

        let effectGain = null;

        let jazzPlaying = false;

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

                    return false;

                }

                masterGain =
                    audioContext.createGain();

                jazzGain =
                    audioContext.createGain();

                effectGain =
                    audioContext.createGain();


                masterGain.gain.value =
                    0.72;

                jazzGain.gain.value =
                    0.16;

                effectGain.gain.value =
                    0.35;


                jazzGain.connect(
                    masterGain
                );

                effectGain.connect(
                    masterGain
                );

                masterGain.connect(
                    audioContext.destination
                );

            }


            if (
                audioContext.state ===
                "suspended"
            ) {

                audioContext.resume()
                    .catch(function () {});

            }


            return true;
        }


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
                start +
                duration +
                0.04
            );

        }


        /* =====================================================
           AUDIO UNLOCK
        ====================================================== */

        function unlockAudio() {

            initAudio();

            startJazz();

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
           CAMERA COUNTDOWN SOUND
        ====================================================== */

        function countdownTick() {

            tone(
                880,
                0.11,
                0.045,
                "sine"
            );

            tone(
                1320,
                0.07,
                0.018,
                "triangle",
                effectGain,
                0.025
            );

        }


        function finalCameraBeep() {

            tone(
                1046.5,
                0.16,
                0.055,
                "sine"
            );

            tone(
                1568,
                0.20,
                0.035,
                "triangle",
                effectGain,
                0.07
            );

        }


        /* =====================================================
           BOUQUET SHIMMER
        ====================================================== */

        function bouquetShimmerSound() {

            tone(
                659.25,
                0.28,
                0.045,
                "sine"
            );

            tone(
                783.99,
                0.35,
                0.04,
                "sine",
                effectGain,
                0.07
            );

            tone(
                1046.50,
                0.50,
                0.035,
                "triangle",
                effectGain,
                0.14
            );

            tone(
                1318.51,
                0.60,
                0.022,
                "sine",
                effectGain,
                0.23
            );

        }


        /* =====================================================
           ENVELOPE OPENING SOUND
        ====================================================== */

        function envelopeOpenSound() {

            tone(
                392,
                0.20,
                0.025,
                "triangle"
            );

            tone(
                523.25,
                0.25,
                0.035,
                "sine",
                effectGain,
                0.08
            );

            tone(
                659.25,
                0.35,
                0.04,
                "sine",
                effectGain,
                0.16
            );

            tone(
                783.99,
                0.50,
                0.03,
                "triangle",
                effectGain,
                0.24
            );

        }


        /* =====================================================
           WINE POUR ENHANCEMENT
           
           IMPORTANT:
           YOUR ORIGINAL wine-pour.mp3
           IS STILL USED.
        ====================================================== */

        function winePourEnhancement() {

            tone(
                185,
                0.22,
                0.018,
                "sine",
                effectGain
            );

            tone(
                246.94,
                0.30,
                0.012,
                "triangle",
                effectGain,
                0.05
            );

        }


        /* =====================================================
           GLASS CLINK ENHANCEMENT
           
           ORIGINAL glass-clink.mp3
           IS STILL USED.
        ====================================================== */

        function glassClinkEnhancement() {

            tone(
                1318.51,
                0.25,
                0.035,
                "sine",
                effectGain
            );

            tone(
                1760,
                0.35,
                0.025,
                "triangle",
                effectGain,
                0.035
            );

        }


        /* =====================================================
           DIZZY / DRUNK SOUND
        ====================================================== */

        function startDizzySound() {

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


            oscillator.frequency.setValueAtTime(
                180,
                start
            );


            oscillator.frequency.exponentialRampToValueAtTime(
                75,
                start + 2.5
            );


            oscillator.frequency.exponentialRampToValueAtTime(
                145,
                start + 5
            );


            gain.gain.setValueAtTime(
                0.0001,
                start
            );


            gain.gain.exponentialRampToValueAtTime(
                0.045,
                start + 0.5
            );


            gain.gain.exponentialRampToValueAtTime(
                0.0001,
                start + 5.3
            );


            oscillator.connect(gain);

            gain.connect(
                effectGain
            );


            oscillator.start(start);

            oscillator.stop(
                start + 5.5
            );


            /*
               Little spinning sparkle
               tones inside the dizzy effect.
            */

            for (
                let i = 0;
                i < 8;
                i++
            ) {

                const frequency =
                    420 +
                    (
                        i * 90
                    );


                tone(
                    frequency,
                    0.35,
                    0.012,
                    "sine",
                    effectGain,
                    i * 0.55
                );

            }

        }


        /* =====================================================
           CUTE JAZZ BGM
        ====================================================== */

        function startJazz() {

            if (
                jazzPlaying
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

            if (!jazzPlaying) {
                return;
            }


            const melody = [

                261.63,
                329.63,
                392.00,
                493.88,

                392.00,
                329.63,
                293.66,
                349.23,

                440.00,
                523.25,
                440.00,
                392.00,

                329.63,
                293.66,
                261.63,
                329.63

            ];


            const note =
                melody[jazzStep];


            /*
               Main jazz melody.
            */

            tone(
                note,
                0.62,
                0.018,
                "sine",
                jazzGain
            );


            /*
               Soft jazz chord underneath.
            */

            if (
                jazzStep % 4 === 0
            ) {

                tone(
                    note / 2,
                    0.95,
                    0.009,
                    "triangle",
                    jazzGain
                );

                tone(
                    note * 1.25,
                    0.65,
                    0.006,
                    "sine",
                    jazzGain,
                    0.02
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
                    570
                );

        }


        function stopJazz() {

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

        get("start-camera")
            .addEventListener(
                "click",
                function () {

                    unlockAudio();

                    showSection(
                        "camera-section"
                    );

                }
            );


        /* =====================================================
           CAMERA COUNTDOWN
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


        camera.addEventListener(
            "click",
            function () {

                if (cameraUsed) {
                    return;
                }


                cameraUsed = true;

                unlockAudio();

                startCountdown();

            }
        );


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


                /*
                   NEW COUNTDOWN SOUND
                */

                countdownTick();


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
                        function () {

                            finalCameraBeep();

                            takePhoto();

                        },
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


            /*
               KEEP ORIGINAL CAMERA SOUND
            */

            playSound(
                cameraSound,
                0.7
            );


            /* BIG FLASH */

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

        get("photo-continue")
            .addEventListener(
                "click",
                function () {

                    unlockAudio();


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


        /* =====================================================
           BOUQUET
        ====================================================== */

        const bouquet =
            get("bouquet");

        const bouquetText =
            get("bouquet-text");

        let bouquetClicked = false;


        bouquet.addEventListener(
            "click",
            function () {

                if (bouquetClicked) {
                    return;
                }


                bouquetClicked = true;

                unlockAudio();


                bouquet.classList.add(
                    "glowing"
                );


                /*
                   NEW MAGICAL SHIMMER SOUND
                */

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
                    ) +
                    "%";


                sparkle.style.top =
                    (
                        25 +
                        Math.random() * 40
                    ) +
                    "%";


                sparkle.style.fontSize =
                    (
                        12 +
                        Math.random() * 15
                    ) +
                    "px";


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
                    ) *
                    180;


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


        envelope.addEventListener(
            "click",
            function () {

                if (envelopeOpened) {
                    return;
                }


                envelopeOpened = true;

                unlockAudio();


                envelope.classList.add(
                    "open"
                );


                /*
                   NEW ENVELOPE OPEN SOUND
                */

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


        /* =====================================================
           POSTCARD → WINE
        ====================================================== */

        get("wine-continue")
            .addEventListener(
                "click",
                function () {

                    unlockAudio();


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

        bottle.addEventListener(
            "click",
            function () {

                if (wineFinished) {
                    return;
                }


                unlockAudio();


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
                   KEEP ORIGINAL WINE POUR SOUND
                */

                playSound(
                    wineSound,
                    0.55
                );


                /*
                   ADD VERY SOFT DEPTH
                   WITHOUT REPLACING ORIGINAL.
                */

                winePourEnhancement();


                /* BOTTLE LEVEL */

                const bottleLevel =
                    100 -
                    (
                        pourCount *
                        20
                    );


                bottleLiquid.style.height =
                    bottleLevel +
                    "%";


                /* GLASSES FILL */

                const glassLevel =
                    pourCount *
                    20;


                glassWine.forEach(
                    function (wine) {

                        wine.style.height =
                            glassLevel +
                            "%";

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


        /* =====================================================
           GLASS CLICK
        ====================================================== */

        glasses.forEach(
            function (glass) {

                glass.addEventListener(
                    "click",
                    function () {

                        if (wineFinished) {
                            return;
                        }


                        unlockAudio();


                        if (!glassesFilled) {

                            wineInstruction.textContent =
                                "Pour the wine first, sweetheart. ❤️";

                            return;

                        }


                        /*
                           KEEP ORIGINAL GLASS CLINK
                        */

                        playSound(
                            glassSound,
                            0.65
                        );


                        /*
                           ADD TINY REALISTIC
                           GLASS RESONANCE
                        */

                        glassClinkEnhancement();


                        /* EMPTY BOTH GLASSES */

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
               START DIZZY SOUND
            */

            unlockAudio();

            startDizzySound();


            overlay.classList.add(
                "active"
            );


            /*
                Make the entire page
                slowly sway.
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

                    get("drunk-popup")
                        .classList.add(
                            "show"
                        );

                },
                4200
            );

        }


        /* =====================================================
           NEXT PAGE
        ====================================================== */

        get("next-page")
            .addEventListener(
                "click",
                function () {

                    unlockAudio();


                    window.location.href =
                        "page4.html";

                }
            );

    }
);
