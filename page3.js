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
           AUDIO ENGINE
           Android / Chrome friendly
           No external audio files required
        ====================================================== */

        let audioContext = null;

        let masterGain = null;
        let musicGain = null;
        let effectGain = null;
        let drunkGain = null;

        let audioReady = false;
        let musicPlaying = false;
        let musicMuted = false;
        let drunkMode = false;

        let musicTimer = null;
        let musicStep = 0;

        const musicButton =
            get("music-button");


        /* =====================================================
           INITIALIZE AUDIO
        ====================================================== */

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

                drunkGain =
                    audioContext.createGain();


                masterGain.gain.value = 0.85;

                /* Soft romantic background level */
                musicGain.gain.value = 0.14;

                effectGain.gain.value = 0.42;

                drunkGain.gain.value = 0.30;


                musicGain.connect(masterGain);

                effectGain.connect(masterGain);

                drunkGain.connect(masterGain);

                masterGain.connect(
                    audioContext.destination
                );

            }


            audioReady = true;

            return true;
        }


        /* =====================================================
           UNLOCK AUDIO
        ====================================================== */

        function unlockAudio() {

            if (!initAudio()) {
                return;
            }


            if (
                audioContext.state === "suspended"
            ) {

                audioContext.resume()
                    .catch(function () {});

            }


            if (
                !musicMuted &&
                !drunkMode
            ) {

                startRomanticBGM();

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
           BASIC TONE
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
                start +
                duration +
                0.05
            );

        }


        /* =====================================================
           SOFT UI CLICK
        ====================================================== */

        function uiClick() {

            tone(
                620,
                0.07,
                0.035,
                "sine"
            );


            tone(
                880,
                0.08,
                0.022,
                "sine",
                effectGain,
                0.04
            );

        }


        /* =====================================================
           ROMANTIC CHIME
        ====================================================== */

        function romanticChime() {

            tone(
                523.25,
                0.32,
                0.055,
                "sine"
            );


            tone(
                659.25,
                0.38,
                0.045,
                "sine",
                effectGain,
                0.09
            );


            tone(
                783.99,
                0.50,
                0.035,
                "triangle",
                effectGain,
                0.18
            );

        }


        /* =====================================================
           MAGICAL REVEAL
        ====================================================== */

        function magicalReveal() {

            tone(
                659.25,
                0.25,
                0.045,
                "sine"
            );


            tone(
                783.99,
                0.35,
                0.045,
                "sine",
                effectGain,
                0.08
            );


            tone(
                1046.50,
                0.60,
                0.028,
                "triangle",
                effectGain,
                0.18
            );

        }


        /* =====================================================
           SOFT SENSUAL DINNER-DATE PIANO BGM
           
           No strumming.
           No cute music-box melody.
           Slow, warm, intimate piano chords.
        ====================================================== */

        function startRomanticBGM() {

            if (
                musicPlaying ||
                musicMuted ||
                drunkMode
            ) {
                return;
            }


            if (!initAudio()) {
                return;
            }


            musicPlaying = true;

            musicStep = 0;


            if (musicButton) {
                musicButton.textContent = "♫";
            }


            playRomanticLoop();

        }


        function playRomanticLoop() {

            if (
                !musicPlaying ||
                musicMuted ||
                drunkMode
            ) {
                return;
            }


            /*
               Slow sensual dinner-date progression.

               These are chord tones rather than
               a bright melody, which keeps the music
               soft and intimate.
            */

            const chords = [

                [261.63, 329.63, 392.00],

                [220.00, 277.18, 329.63],

                [246.94, 293.66, 369.99],

                [196.00, 246.94, 293.66],

                [261.63, 329.63, 392.00],

                [233.08, 293.66, 349.23],

                [220.00, 277.18, 329.63],

                [196.00, 246.94, 329.63]

            ];


            const chord =
                chords[musicStep];


            /*
               Deep soft bass note.
            */

            tone(
                chord[0] / 2,
                1.55,
                0.010,
                "sine",
                musicGain
            );


            /*
               Main warm piano chord.
            */

            tone(
                chord[0],
                1.35,
                0.014,
                "triangle",
                musicGain
            );


            tone(
                chord[1],
                1.25,
                0.011,
                "triangle",
                musicGain,
                0.08
            );


            tone(
                chord[2],
                1.20,
                0.009,
                "sine",
                musicGain,
                0.16
            );


            /*
               Very subtle high piano note.
               This keeps it romantic without
               becoming cute or playful.
            */

            if (musicStep % 2 === 1) {

                tone(
                    chord[2] * 2,
                    0.65,
                    0.004,
                    "sine",
                    musicGain,
                    0.35
                );

            }


            musicStep++;

            if (
                musicStep >= chords.length
            ) {

                musicStep = 0;

            }


            /*
               Slow tempo.
            */

            musicTimer =
                setTimeout(
                    playRomanticLoop,
                    1550
                );

        }


        /* =====================================================
           STOP MUSIC
        ====================================================== */

        function stopRomanticBGM() {

            musicPlaying = false;


            if (musicTimer) {

                clearTimeout(
                    musicTimer
                );

                musicTimer = null;

            }


            if (musicButton) {
                musicButton.textContent = "🔇";
            }

        }


        /* =====================================================
           MUSIC BUTTON
        ====================================================== */

        if (musicButton) {

            musicButton.textContent = "♫";


            musicButton.addEventListener(
                "click",
                function (event) {

                    event.stopPropagation();

                    initAudio();


                    if (musicMuted) {

                        musicMuted = false;

                        startRomanticBGM();

                    } else {

                        musicMuted = true;

                        stopRomanticBGM();

                    }

                }
            );

        }


        /* =====================================================
           COUNTDOWN CHIME
        ====================================================== */

        function countdownChime(number) {

            if (number === 3) {

                tone(
                    523.25,
                    0.20,
                    0.045,
                    "sine"
                );

            }


            if (number === 2) {

                tone(
                    659.25,
                    0.20,
                    0.050,
                    "sine"
                );

            }


            if (number === 1) {

                tone(
                    783.99,
                    0.25,
                    0.055,
                    "triangle"
                );

            }

        }


        /* =====================================================
           CAMERA SHUTTER
        ====================================================== */

        function cameraShutter() {

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
                "square";


            oscillator.frequency.setValueAtTime(
                1800,
                start
            );


            oscillator.frequency.exponentialRampToValueAtTime(
                420,
                start + 0.08
            );


            gain.gain.setValueAtTime(
                0.0001,
                start
            );


            gain.gain.exponentialRampToValueAtTime(
                0.12,
                start + 0.008
            );


            gain.gain.exponentialRampToValueAtTime(
                0.0001,
                start + 0.12
            );


            oscillator.connect(gain);

            gain.connect(effectGain);


            oscillator.start(start);

            oscillator.stop(
                start + 0.15
            );


            tone(
                1100,
                0.08,
                0.045,
                "sine",
                effectGain,
                0.025
            );

        }


        /* =====================================================
           PHOTO REVEAL
           Existing magical reveal + NEW WHISTLE
        ====================================================== */

        function photoReveal() {

            /*
               Existing reveal sound
            */

            tone(
                783.99,
                0.30,
                0.045,
                "sine"
            );


            tone(
                1046.50,
                0.50,
                0.035,
                "sine",
                effectGain,
                0.10
            );


            tone(
                1318.51,
                0.60,
                0.020,
                "triangle",
                effectGain,
                0.20
            );


            /*
               NEW:
               Soft playful whistle when
               her photo appears.
            */

            if (!initAudio()) {
                return;
            }


            const start =
                audioContext.currentTime + 0.18;


            const oscillator =
                audioContext.createOscillator();

            const gain =
                audioContext.createGain();


            oscillator.type =
                "sine";


            /*
               Rising whistle
            */

            oscillator.frequency.setValueAtTime(
                900,
                start
            );


            oscillator.frequency.exponentialRampToValueAtTime(
                1450,
                start + 0.32
            );


            oscillator.frequency.exponentialRampToValueAtTime(
                1150,
                start + 0.55
            );


            gain.gain.setValueAtTime(
                0.0001,
                start
            );


            gain.gain.exponentialRampToValueAtTime(
                0.055,
                start + 0.06
            );


            gain.gain.exponentialRampToValueAtTime(
                0.0001,
                start + 0.62
            );


            oscillator.connect(gain);

            gain.connect(effectGain);


            oscillator.start(start);

            oscillator.stop(
                start + 0.68
            );

        }


        /* =====================================================
           FLOWER / BOUQUET SOUND
        ====================================================== */

        function flowerMagic() {

            tone(
                523.25,
                0.28,
                0.045,
                "sine"
            );


            tone(
                659.25,
                0.35,
                0.040,
                "sine",
                effectGain,
                0.07
            );


            tone(
                987.77,
                0.55,
                0.030,
                "triangle",
                effectGain,
                0.16
            );


            tone(
                1318.51,
                0.45,
                0.018,
                "sine",
                effectGain,
                0.28
            );

        }


        /* =====================================================
           ENVELOPE PAGE TURN SOUND
           
           New realistic-style page flip
           using filtered noise + soft paper movement.
        ====================================================== */

        function envelopePageTurnSound() {

            if (!initAudio()) {
                return;
            }


            const start =
                audioContext.currentTime;


            const duration = 0.65;


            /*
               Create soft paper noise.
            */

            const buffer =
                audioContext.createBuffer(
                    1,
                    Math.floor(
                        audioContext.sampleRate *
                        duration
                    ),
                    audioContext.sampleRate
                );


            const data =
                buffer.getChannelData(0);


            for (
                let i = 0;
                i < data.length;
                i++
            ) {

                const progress =
                    i / data.length;


                const envelope =
                    Math.sin(
                        Math.PI *
                        progress
                    );


                data[i] =
                    (
                        Math.random() * 2 - 1
                    ) *
                    envelope;

            }


            const source =
                audioContext.createBufferSource();


            const filter =
                audioContext.createBiquadFilter();


            const gain =
                audioContext.createGain();


            source.buffer =
                buffer;


            filter.type =
                "bandpass";


            filter.frequency.value =
                1800;


            filter.Q.value =
                0.65;


            gain.gain.value =
                0.045;


            source.connect(filter);

            filter.connect(gain);

            gain.connect(effectGain);


            source.start(start);


            /*
               Small paper movement accents.
            */

            tone(
                420,
                0.12,
                0.018,
                "triangle",
                effectGain
            );


            tone(
                620,
                0.15,
                0.015,
                "triangle",
                effectGain,
                0.16
            );


            tone(
                840,
                0.18,
                0.012,
                "sine",
                effectGain,
                0.30
            );

        }


        /* =====================================================
           ENVELOPE OPEN
           
           Original envelope sound +
           NEW PAGE TURN EFFECT
        ====================================================== */

        function envelopeOpenSound() {

            /*
               Original opening tones
            */

            tone(
                392.00,
                0.18,
                0.030,
                "triangle"
            );


            tone(
                523.25,
                0.25,
                0.040,
                "sine",
                effectGain,
                0.08
            );


            tone(
                783.99,
                0.45,
                0.030,
                "sine",
                effectGain,
                0.17
            );


            /*
               NEW PAGE-TURN SOUND
            */

            envelopePageTurnSound();

        }


        /* =====================================================
           WINE POUR SOUND
           Procedural soft liquid effect
        ====================================================== */

        function winePourSound() {

            if (!initAudio()) {
                return;
            }


            const start =
                audioContext.currentTime;


            const duration = 0.75;


            const buffer =
                audioContext.createBuffer(
                    1,
                    Math.floor(
                        audioContext.sampleRate *
                        duration
                    ),
                    audioContext.sampleRate
                );


            const data =
                buffer.getChannelData(0);


            for (
                let i = 0;
                i < data.length;
                i++
            ) {

                const noise =
                    Math.random() * 2 - 1;


                const wave =
                    Math.sin(
                        i * 0.045
                    );


                const envelope =
                    Math.sin(
                        Math.PI *
                        i /
                        data.length
                    );


                data[i] =
                    (
                        noise * 0.38 +
                        wave * 0.12
                    ) *
                    envelope;

            }


            const source =
                audioContext.createBufferSource();


            const filter =
                audioContext.createBiquadFilter();


            const gain =
                audioContext.createGain();


            source.buffer =
                buffer;


            filter.type =
                "lowpass";


            filter.frequency.value =
                1100;


            filter.Q.value =
                0.7;


            gain.gain.value =
                0.055;


            source.connect(filter);

            filter.connect(gain);

            gain.connect(effectGain);


            source.start(start);

        }


        /* =====================================================
           WINE COMPLETION
        ====================================================== */

        function wineComplete() {

            tone(
                523.25,
                0.25,
                0.045,
                "sine"
            );


            tone(
                659.25,
                0.30,
                0.045,
                "sine",
                effectGain,
                0.08
            );


            tone(
                783.99,
                0.45,
                0.040,
                "triangle",
                effectGain,
                0.16
            );


            tone(
                1046.50,
                0.65,
                0.030,
                "sine",
                effectGain,
                0.28
            );

        }


        /* =====================================================
           GLASS CLINK
        ====================================================== */

        function glassClink() {

            tone(
                1760,
                0.18,
                0.060,
                "sine"
            );


            tone(
                2349.32,
                0.22,
                0.045,
                "sine",
                effectGain,
                0.035
            );


            tone(
                2793.83,
                0.28,
                0.025,
                "triangle",
                effectGain,
                0.08
            );

        }


        /* =====================================================
           DRUNK / DIZZY SOUND
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


            oscillator.frequency.setValueAtTime(
                220,
                start
            );


            oscillator.frequency.exponentialRampToValueAtTime(
                440,
                start + 1.4
            );


            oscillator.frequency.exponentialRampToValueAtTime(
                180,
                start + 2.8
            );


            gain.gain.setValueAtTime(
                0.0001,
                start
            );


            gain.gain.exponentialRampToValueAtTime(
                0.055,
                start + 0.15
            );


            gain.gain.exponentialRampToValueAtTime(
                0.0001,
                start + 3
            );


            oscillator.connect(gain);

            gain.connect(drunkGain);


            oscillator.start(start);

            oscillator.stop(
                start + 3.1
            );

        }


        /* =====================================================
           DRUNK POPUP CHIME
        ====================================================== */

        function drunkPopupSound() {

            tone(
                392,
                0.20,
                0.040,
                "sine"
            );


            tone(
                493.88,
                0.25,
                0.040,
                "sine",
                effectGain,
                0.08
            );


            tone(
                587.33,
                0.40,
                0.035,
                "triangle",
                effectGain,
                0.16
            );

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

                        uiClick();


                        if (
                            introCards[introIndex]
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

                                    romanticChime();

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

                    uiClick();

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

                    unlockAudio();


                    if (cameraUsed) {
                        return;
                    }


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


                countdownChime(
                    Number(
                        numbers[index]
                    )
                );


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


            cameraShutter();


            flash.classList.add(
                "active"
            );


            setTimeout(
                function () {

                    photoResult.classList.add(
                        "show"
                    );

                    /*
                       Existing photo reveal +
                       NEW whistle.
                    */

                    photoReveal();

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

                    uiClick();


                    photoResult.classList.remove(
                        "show"
                    );


                    setTimeout(
                        function () {

                            showSection(
                                "bouquet-section"
                            );

                            romanticChime();

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

                    unlockAudio();


                    if (bouquetClicked) {
                        return;
                    }


                    bouquetClicked = true;


                    bouquet.classList.add(
                        "glowing"
                    );


                    flowerMagic();


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

                            magicalReveal();

                        },
                        3000
                    );

                }
            );

        }


        /* =====================================================
           BOUQUET SPARKLES
        ====================================================== */

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
                        Math.random() *
                        50
                    ) +
                    "%";


                sparkle.style.top =
                    (
                        25 +
                        Math.random() *
                        40
                    ) +
                    "%";


                sparkle.style.fontSize =
                    (
                        12 +
                        Math.random() *
                        15
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
                        Math.random() -
                        0.5
                    ) *
                    180;


                const y =
                    -(
                        40 +
                        Math.random() *
                        140
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
                            Math.random() *
                            700,

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

                    unlockAudio();


                    if (envelopeOpened) {
                        return;
                    }


                    envelopeOpened = true;


                    envelope.classList.add(
                        "open"
                    );


                    envelopeText.textContent =
                        "Open it... it's just for you. ❤️";


                    /*
                       Envelope opening sound
                       + page-turn effect.
                    */

                    envelopeOpenSound();


                    setTimeout(
                        function () {

                            postcard.classList.add(
                                "show"
                            );


                            magicalReveal();

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

                    uiClick();


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

                            romanticChime();

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
                       AWESOME WINE POUR / WOOSH
                       KEPT UNCHANGED.
                    */

                    winePourSound();


                    const bottleLevel =
                        100 -
                        (
                            pourCount *
                            20
                        );


                    bottleLiquid.style.height =
                        bottleLevel +
                        "%";


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


                        wineComplete();

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


                            uiClick();

                            return;

                        }


                        /*
                           AWESOME GLASS CLINK
                           KEPT UNCHANGED.
                        */

                        glassClink();


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

            unlockAudio();


            const overlay =
                get("drunk-overlay");


            if (overlay) {

                overlay.classList.add(
                    "active"
                );

            }


            drunkMode = true;

            stopRomanticBGM();


            /*
               ORIGINAL DIZZY SOUND
               KEPT UNCHANGED.
            */

            dizzySound();


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


                    drunkPopupSound();

                },
                4200
            );


            setTimeout(
                function () {

                    drunkMode = false;


                    if (!musicMuted) {

                        startRomanticBGM();

                    }

                },
                6500
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

                    uiClick();


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
           START IN SILENCE
           Audio begins safely after interaction.
        ====================================================== */

        if (musicButton) {
            musicButton.textContent = "♫";
        }

    }
);
