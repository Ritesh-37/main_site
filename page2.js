document.addEventListener("DOMContentLoaded", function () {

    function get(id) {
        return document.getElementById(id);
    }


    /* =========================================================
       AUDIO ENGINE
       ========================================================= */

    const music = get("birthday-music");
    const musicButton = get("music-button");
document.addEventListener("DOMContentLoaded", function () {

    /* =========================================================
       HELPER
    ========================================================= */

    function get(id) {
        return document.getElementById(id);
    }


    /* =========================================================
       AUDIO ELEMENTS
    ========================================================= */

    const music = get("birthday-music");
    const musicButton = get("music-button");

    const candleSound = get("candle-sound");
    const balloonSound = get("balloon-pop-sound");
    const popperSound = get("popper-sound");
    const crackleSound = get("crackle-sound");


    /* =========================================================
       AUDIO STATE
    ========================================================= */

    let audioContext = null;

    let musicStarted = false;
    let musicMuted = false;

    let celebrationPlaying = false;

    let celebrationTimer = null;

    let audioUnlocked = false;


    /* =========================================================
       AUDIO CONTEXT
    ========================================================= */

    function initAudio() {

        if (!audioContext) {

            try {

                audioContext = new (
                    window.AudioContext ||
                    window.webkitAudioContext
                )();

            } catch (error) {

                console.log("Web Audio unavailable.");

                return false;
            }
        }


        if (audioContext.state === "suspended") {

            audioContext.resume().catch(function () {});

        }


        audioUnlocked = true;

        return true;
    }


    /* =========================================================
       ORIGINAL BGM
    ========================================================= */

    function startNormalMusic() {

        if (!music) {
            return;
        }

        if (musicMuted) {
            return;
        }

        if (celebrationPlaying) {
            return;
        }


        music.volume = 0.30;


        const promise = music.play();


        if (promise) {

            promise
                .then(function () {

                    musicStarted = true;

                    if (musicButton) {
                        musicButton.textContent = "♫";
                    }

                })
                .catch(function () {

                    musicStarted = false;

                    if (musicButton) {
                        musicButton.textContent = "🔇";
                    }

                });

        }

    }


    /* =========================================================
       STOP ORIGINAL BGM
    ========================================================= */

    function stopNormalMusic() {

        if (!music) {
            return;
        }

        try {

            music.pause();

        } catch (error) {

            console.log(error);

        }

    }


    /* =========================================================
       MUSIC BUTTON
    ========================================================= */

    if (musicButton) {

        musicButton.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

                initAudio();


                if (!music) {
                    return;
                }


                if (music.paused) {

                    musicMuted = false;


                    if (!celebrationPlaying) {

                        music.play()
                            .then(function () {

                                musicStarted = true;

                                musicButton.textContent = "♫";

                            })
                            .catch(function () {});

                    }

                } else {

                    music.pause();

                    musicMuted = true;

                    musicButton.textContent = "🔇";

                }

            }
        );

    }


    /* =========================================================
       FIRST INTERACTION UNLOCK
    ========================================================= */

    function firstInteraction() {

        initAudio();


        if (!musicStarted && !musicMuted) {

            startNormalMusic();

        }

    }


    document.addEventListener(
        "pointerdown",
        firstInteraction,
        {
            once: true
        }
    );


    /* =========================================================
       CLEAN AUDIO EFFECT
    ========================================================= */

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
                    : 0.25;


            const promise = audio.play();


            if (promise) {

                promise.catch(function () {});

            }

        } catch (error) {

            console.log("Sound effect error:", error);

        }

    }


    /* =========================================================
       CUTE CLICK
    ========================================================= */

    function uiClickSound() {

        if (!initAudio()) {
            return;
        }


        const now = audioContext.currentTime;


        const oscillator =
            audioContext.createOscillator();

        const gain =
            audioContext.createGain();


        oscillator.type = "sine";


        oscillator.frequency.setValueAtTime(
            620,
            now
        );


        oscillator.frequency.exponentialRampToValueAtTime(
            820,
            now + 0.06
        );


        gain.gain.setValueAtTime(
            0.0001,
            now
        );


        gain.gain.exponentialRampToValueAtTime(
            0.045,
            now + 0.01
        );


        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            now + 0.07
        );


        oscillator.connect(gain);

        gain.connect(
            audioContext.destination
        );


        oscillator.start(now);

        oscillator.stop(
            now + 0.08
        );

    }


    /* =========================================================
       10 SECOND BIRTHDAY CELEBRATION AUDIO
       
       Happy Birthday
       + gentle clapping
       + soft cheering
       
       EVERYTHING IS GENERATED HERE.
       NO EXTRA AUDIO FILE REQUIRED.
    ========================================================= */

    function startBirthdayCelebrationMusic() {

        if (celebrationPlaying) {
            return;
        }


        if (!initAudio()) {
            return;
        }


        celebrationPlaying = true;


        /* -----------------------------------------
           STOP ORIGINAL MUSIC
        ----------------------------------------- */

        stopNormalMusic();


        /*
           Cancel previous timer if somehow present.
        */

        if (celebrationTimer) {

            clearTimeout(
                celebrationTimer
            );

            celebrationTimer = null;

        }


        const start =
            audioContext.currentTime + 0.08;


        /* -----------------------------------------
           MASTER CELEBRATION VOLUME
        ----------------------------------------- */

        const master =
            audioContext.createGain();


        master.gain.setValueAtTime(
            0.0001,
            start
        );


        master.gain.linearRampToValueAtTime(
            0.55,
            start + 0.35
        );


        master.gain.setValueAtTime(
            0.55,
            start + 9.3
        );


        master.gain.linearRampToValueAtTime(
            0.0001,
            start + 10
        );


        master.connect(
            audioContext.destination
        );


        /* -----------------------------------------
           HAPPY BIRTHDAY MELODY
        ----------------------------------------- */

        const melody = [

            [261.63, 0.45],
            [261.63, 0.45],
            [293.66, 0.80],
            [261.63, 0.80],
            [349.23, 0.80],
            [329.63, 1.10],

            [261.63, 0.45],
            [261.63, 0.45],
            [293.66, 0.80],
            [261.63, 0.80],
            [392.00, 0.80],
            [349.23, 1.10],

            [261.63, 0.45],
            [261.63, 0.45],
            [523.25, 0.80],
            [440.00, 0.80],
            [349.23, 0.80],
            [329.63, 0.80],
            [293.66, 1.10],

            [466.16, 0.45],
            [466.16, 0.45],
            [440.00, 0.80],
            [349.23, 0.80],
            [392.00, 0.80],
            [349.23, 1.20]

        ];


        let time = start;


        melody.forEach(function (note) {

            const frequency = note[0];
            const duration = note[1];


            const oscillator =
                audioContext.createOscillator();


            const gain =
                audioContext.createGain();


            oscillator.type = "triangle";


            oscillator.frequency.setValueAtTime(
                frequency,
                time
            );


            gain.gain.setValueAtTime(
                0.0001,
                time
            );


            gain.gain.linearRampToValueAtTime(
                0.32,
                time + 0.035
            );


            gain.gain.linearRampToValueAtTime(
                0.0001,
                time + duration - 0.05
            );


            oscillator.connect(gain);

            gain.connect(master);


            oscillator.start(time);

            oscillator.stop(
                time + duration
            );


            time += duration + 0.035;

        });


        /* -----------------------------------------
           SOFT CHORD
        ----------------------------------------- */

        const chords = [

            [261.63, 329.63, 392.00],
            [293.66, 369.99, 440.00],
            [261.63, 329.63, 392.00]

        ];


        const chordTimes = [
            start,
            start + 2.7,
            start + 5.4
        ];


        chords.forEach(function (chord, index) {

            chord.forEach(function (frequency) {

                const oscillator =
                    audioContext.createOscillator();


                const gain =
                    audioContext.createGain();


                oscillator.type = "sine";


                oscillator.frequency.value =
                    frequency;


                gain.gain.setValueAtTime(
                    0.0001,
                    chordTimes[index]
                );


                gain.gain.linearRampToValueAtTime(
                    0.07,
                    chordTimes[index] + 0.25
                );


                gain.gain.linearRampToValueAtTime(
                    0.0001,
                    chordTimes[index] + 2.4
                );


                oscillator.connect(gain);

                gain.connect(master);


                oscillator.start(
                    chordTimes[index]
                );


                oscillator.stop(
                    chordTimes[index] + 2.5
                );

            });

        });


        /* -----------------------------------------
           GENTLE CLAPPING
        ----------------------------------------- */

        function createClap(when, volume) {

            const bufferSize =
                audioContext.sampleRate * 0.12;


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
                    (
                        Math.random() * 2 - 1
                    ) *
                    Math.pow(
                        1 - i / bufferSize,
                        4
                    );

            }


            const source =
                audioContext.createBufferSource();


            const filter =
                audioContext.createBiquadFilter();


            const gain =
                audioContext.createGain();


            source.buffer = buffer;


            filter.type =
                "bandpass";


            filter.frequency.value =
                1300;


            filter.Q.value =
                0.8;


            gain.gain.setValueAtTime(
                volume,
                when
            );


            gain.gain.exponentialRampToValueAtTime(
                0.0001,
                when + 0.12
            );


            source.connect(filter);

            filter.connect(gain);

            gain.connect(master);


            source.start(when);

        }


        /*
           Clap rhythm begins after the melody starts.
           It stays subtle so it doesn't become irritating.
        */

        const clapStart =
            start + 1.2;


        for (
            let t = clapStart;
            t < start + 9.2;
            t += 0.65
        ) {

            createClap(
                t,
                0.055
            );


            /*
               occasional second clap
            */

            if (
                Math.random() > 0.55
            ) {

                createClap(
                    t + 0.16,
                    0.045
                );

            }

        }


        /* -----------------------------------------
           SOFT CHEERING
        ----------------------------------------- */

        function createCheerTone(
            frequency,
            when,
            duration
        ) {

            const oscillator =
                audioContext.createOscillator();


            const gain =
                audioContext.createGain();


            oscillator.type =
                "sine";


            oscillator.frequency.setValueAtTime(
                frequency,
                when
            );


            oscillator.frequency.linearRampToValueAtTime(
                frequency * 1.12,
                when + duration
            );


            gain.gain.setValueAtTime(
                0.0001,
                when
            );


            gain.gain.linearRampToValueAtTime(
                0.035,
                when + 0.15
            );


            gain.gain.linearRampToValueAtTime(
                0.0001,
                when + duration
            );


            oscillator.connect(gain);

            gain.connect(master);


            oscillator.start(when);

            oscillator.stop(
                when + duration
            );

        }


        /*
           Small celebratory "woo!" style tones.
        */

        createCheerTone(
            392,
            start + 2.0,
            0.8
        );


        createCheerTone(
            493.88,
            start + 2.2,
            0.8
        );


        createCheerTone(
            587.33,
            start + 2.4,
            0.9
        );


        createCheerTone(
            392,
            start + 6.0,
            0.8
        );


        createCheerTone(
            523.25,
            start + 6.2,
            0.8
        );


        createCheerTone(
            659.25,
            start + 6.4,
            1.0
        );


        /* -----------------------------------------
           FINAL CELEBRATION CHIME
        ----------------------------------------- */

        const finalNotes = [
            523.25,
            659.25,
            783.99
        ];


        finalNotes.forEach(function (
            frequency,
            index
        ) {

            const when =
                start +
                8.7 +
                index * 0.18;


            const oscillator =
                audioContext.createOscillator();


            const gain =
                audioContext.createGain();


            oscillator.type =
                "triangle";


            oscillator.frequency.value =
                frequency;


            gain.gain.setValueAtTime(
                0.0001,
                when
            );


            gain.gain.linearRampToValueAtTime(
                0.20,
                when + 0.05
            );


            gain.gain.exponentialRampToValueAtTime(
                0.0001,
                when + 0.8
            );


            oscillator.connect(gain);

            gain.connect(master);


            oscillator.start(when);

            oscillator.stop(
                when + 0.85
            );

        });


        /* -----------------------------------------
           EXACTLY 10 SECONDS
        ----------------------------------------- */

        celebrationTimer =
            setTimeout(function () {

                stopBirthdayCelebrationMusic();

            }, 10000);

    }


    /* =========================================================
       STOP CELEBRATION AUDIO
    ========================================================= */

    function stopBirthdayCelebrationMusic() {

        if (!celebrationPlaying) {
            return;
        }


        celebrationPlaying = false;


        if (celebrationTimer) {

            clearTimeout(
                celebrationTimer
            );

            celebrationTimer = null;

        }


        /*
           Give the final note a tiny moment,
           then return to the original BGM.
        */

        setTimeout(function () {

            if (
                !musicMuted &&
                !celebrationPlaying
            ) {

                startNormalMusic();

            }

        }, 120);

    }


    /* =========================================================
       SECTION SWITCH
    ========================================================= */

    function showSection(id) {

        document
            .querySelectorAll(".party-section")
            .forEach(function (section) {

                section.classList.remove(
                    "active"
                );

            });


        const target = get(id);


        if (!target) {
            return;
        }


        setTimeout(function () {

            target.classList.add(
                "active"
            );

        }, 50);

    }


    /* =========================================================
       WELCOME
    ========================================================= */

    const welcomeSteps =
        document.querySelectorAll(
            ".welcome-step"
        );


    const welcomeButtons =
        document.querySelectorAll(
            ".welcome-next"
        );


    welcomeButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                initAudio();

                uiClickSound();


                const next =
                    button.getAttribute(
                        "data-next"
                    );


                welcomeSteps.forEach(
                    function (step) {

                        step.classList.remove(
                            "active"
                        );

                    }
                );


                const nextStep =
                    get(
                        "welcome-step-" +
                        next
                    );


                if (nextStep) {

                    setTimeout(
                        function () {

                            nextStep.classList.add(
                                "active"
                            );

                        },
                        100
                    );

                }

            }
        );

    });


    /* =========================================================
       ENTER CAKE
    ========================================================= */

    const startCake =
        get("start-cake");


    if (startCake) {

        startCake.addEventListener(
            "click",
            function () {

                initAudio();

                uiClickSound();


                showSection(
                    "cake-section"
                );


                /*
                   This is now guaranteed to be
                   the user's interaction that unlocks
                   the original BGM.
                */

                if (!musicMuted) {

                    startNormalMusic();

                }

            }
        );

    }


    /* =========================================================
       CANDLES
    ========================================================= */

    const candles =
        document.querySelectorAll(
            ".candle"
        );


    const cakeInstruction =
        get("cake-instruction");


    const celebrationLayer =
        get("celebration-layer");


    const birthdayPopup =
        get("birthday-popup");


    let candlesOff = 0;

    let celebrationStarted = false;


    candles.forEach(function (candle) {

        candle.addEventListener(
            "click",
            function () {

                initAudio();


                if (
                    candle.classList.contains(
                        "off"
                    )
                ) {

                    return;

                }


                candle.classList.add(
                    "off"
                );


                candlesOff++;


                /*
                   VERY SOFT candle sound.
                */

                playSound(
                    candleSound,
                    0.22
                );


                createSmallSparkle(
                    candle
                );


                const remaining =
                    candles.length -
                    candlesOff;


                if (remaining > 0) {

                    cakeInstruction.textContent =
                        remaining +
                        " candle" +
                        (
                            remaining === 1
                                ? ""
                                : "s"
                        ) +
                        " left, sweetheart... 🕯️❤️";

                }


                /* -------------------------------------
                   LAST CANDLE
                ------------------------------------- */

                if (
                    candlesOff ===
                    candles.length
                ) {

                    cakeInstruction.textContent =
                        "MAKE A WISH, BEAUTIFUL GIRL... ❤️✨";


                    /*
                       IMPORTANT:

                       Start the birthday audio FIRST.
                       Normal BGM stops automatically.
                    */

                    startBirthdayCelebrationMusic();


                    /*
                       Then start the visual celebration.
                    */

                    startMegaCelebration();

                }

            }
        );

    });


    /* =========================================================
       SMALL SPARKLES
    ========================================================= */

    function createSmallSparkle(candle) {

        const rect =
            candle.getBoundingClientRect();


        const symbols = [
            "✦",
            "✧",
            "✨",
            "♥"
        ];


        for (let i = 0; i < 8; i++) {

            const sparkle =
                document.createElement(
                    "div"
                );


            sparkle.className =
                "celebration-particle sparkle";


            sparkle.textContent =
                symbols[
                    Math.floor(
                        Math.random() *
                        symbols.length
                    )
                ];


            sparkle.style.left =
                (
                    rect.left +
                    rect.width / 2
                ) + "px";


            sparkle.style.top =
                rect.top + "px";


            sparkle.style.fontSize =
                (
                    12 +
                    Math.random() * 10
                ) + "px";


            document.body.appendChild(
                sparkle
            );


            const x =
                (
                    Math.random() - 0.5
                ) * 120;


            const y =
                -(
                    30 +
                    Math.random() * 100
                );


            sparkle.animate(
                [
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
                            "px) scale(0)",
                        opacity: 0
                    }
                ],
                {
                    duration:
                        600 +
                        Math.random() * 400,

                    easing:
                        "ease-out"
                }
            );


            setTimeout(
                function () {

                    sparkle.remove();

                },
                1200
            );

        }

    }


    /* =========================================================
       10 SECOND VISUAL CELEBRATION
    ========================================================= */

    function startMegaCelebration() {

        if (celebrationStarted) {
            return;
        }


        celebrationStarted = true;


        if (celebrationLayer) {

            celebrationLayer.classList.add(
                "active"
            );

        }


        createMegaBurst();

        createBalloonBurst();

        createPopperBurst();

        createFirework();


        const celebrationStart =
            Date.now();


        const celebrationDuration =
            10000;


        const celebrationTimer =
            setInterval(
                function () {

                    const elapsed =
                        Date.now() -
                        celebrationStart;


                    if (
                        elapsed >=
                        celebrationDuration
                    ) {

                        clearInterval(
                            celebrationTimer
                        );


                        finishCelebration();


                        return;

                    }


                    createSparkleWave();

                    createConfettiBurst();

                    createFirework();

                    createBalloonBurst();

                    createPopperBurst();

                },
                650
            );

    }


    /* =========================================================
       MEGA BURST
    ========================================================= */

    function createMegaBurst() {

        const symbols = [
            "✨",
            "✦",
            "✧",
            "🎉",
            "🎊",
            "❤️",
            "💖"
        ];


        for (let i = 0; i < 55; i++) {

            const particle =
                document.createElement(
                    "div"
                );


            particle.className =
                "celebration-particle sparkle";


            particle.textContent =
                symbols[
                    Math.floor(
                        Math.random() *
                        symbols.length
                    )
                ];


            particle.style.left =
                "50%";


            particle.style.top =
                "50%";


            document.body.appendChild(
                particle
            );


            const angle =
                Math.random() *
                Math.PI *
                2;


            const distance =
                100 +
                Math.random() *
                420;


            const x =
                Math.cos(angle) *
                distance;


            const y =
                Math.sin(angle) *
                distance;


            particle.animate(
                [
                    {
                        transform:
                            "translate(-50%,-50%) scale(.2)",
                        opacity: 0
                    },
                    {
                        transform:
                            "translate(-50%,-50%) scale(1.2)",
                        opacity: 1
                    },
                    {
                        transform:
                            "translate(calc(-50% + " +
                            x +
                            "px), calc(-50% + " +
                            y +
                            "px)) scale(.2)",
                        opacity: 0
                    }
                ],
                {
                    duration:
                        900 +
                        Math.random() * 1000,

                    easing:
                        "cubic-bezier(.2,.8,.2,1)"
                }
            );


            setTimeout(
                function () {

                    particle.remove();

                },
                2200
            );

        }

    }


    /* =========================================================
       SPARKLE WAVE
    ========================================================= */

    function createSparkleWave() {

        const symbols = [
            "✨",
            "✦",
            "✧",
            "⭐",
            "💫"
        ];


        for (let i = 0; i < 15; i++) {

            const particle =
                document.createElement(
                    "div"
                );


            particle.className =
                "celebration-particle sparkle";


            particle.textContent =
                symbols[
                    Math.floor(
                        Math.random() *
                        symbols.length
                    )
                ];


            particle.style.left =
                Math.random() * 100 +
                "%";


            particle.style.top =
                Math.random() * 100 +
                "%";


            particle.style.fontSize =
                (
                    12 +
                    Math.random() * 25
                ) + "px";


            document.body.appendChild(
                particle
            );


            particle.animate(
                [
                    {
                        transform:
                            "scale(.2) rotate(0deg)",
                        opacity: 0
                    },
                    {
                        transform:
                            "scale(1.3) rotate(180deg)",
                        opacity: 1
                    },
                    {
                        transform:
                            "scale(.1) rotate(360deg)",
                        opacity: 0
                    }
                ],
                {
                    duration:
                        900 +
                        Math.random() * 800
                }
            );


            setTimeout(
                function () {

                    particle.remove();

                },
                1800
            );

        }

    }


    /* =========================================================
       CONFETTI
    ========================================================= */

    function createConfettiBurst() {

        const symbols = [
            "🎀",
            "🎊",
            "♥",
            "✦",
            "•",
            "⭐"
        ];


        const x =
            Math.random() *
            window.innerWidth;


        const y =
            window.innerHeight *
            0.1;


        for (let i = 0; i < 18; i++) {

            const piece =
                document.createElement(
                    "div"
                );


            piece.className =
                "celebration-particle confetti";


            piece.textContent =
                symbols[
                    Math.floor(
                        Math.random() *
                        symbols.length
                    )
                ];


            piece.style.left =
                x + "px";


            piece.style.top =
                y + "px";


            document.body.appendChild(
                piece
            );


            const moveX =
                (
                    Math.random() - 0.5
                ) * 350;


            const moveY =
                250 +
                Math.random() * 500;


            piece.animate(
                [
                    {
                        transform:
                            "translate(0,0) rotate(0deg)",
                        opacity: 1
                    },
                    {
                        transform:
                            "translate(" +
                            moveX +
                            "px," +
                            moveY +
                            "px) rotate(" +
                            Math.random() *
                            720 +
                            "deg)",
                        opacity: 0
                    }
                ],
                {
                    duration:
                        1200 +
                        Math.random() * 900,

                    easing:
                        "ease-out"
                }
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
       BALLOON VISUAL
       NO AUDIO DURING REPEATED CELEBRATION WAVES
    ========================================================= */

    function createBalloonBurst() {

        const x =
            Math.random() *
            window.innerWidth;


        const y =
            100 +
            Math.random() *
            (
                window.innerHeight *
                0.45
            );


        const particle =
            document.createElement(
                "div"
            );


        particle.className =
            "celebration-particle";


        particle.textContent =
            "🎈💥";


        particle.style.left =
            x + "px";


        particle.style.top =
            y + "px";


        document.body.appendChild(
            particle
        );


        particle.animate(
            [
                {
                    transform:
                        "scale(.2)",
                    opacity: 0
                },
                {
                    transform:
                        "scale(1.5)",
                    opacity: 1
                },
                {
                    transform:
                        "scale(0)",
                    opacity: 0
                }
            ],
            {
                duration: 650
            }
        );


        setTimeout(
            function () {

                particle.remove();

            },
            900
        );

    }


    /* =========================================================
       PARTY POPPER VISUAL
       NO AUDIO DURING REPEATED WAVES
    ========================================================= */

    function createPopperBurst() {

        const x =
            Math.random() < 0.5
                ? 80
                : window.innerWidth - 80;


        const y =
            window.innerHeight *
            (
                0.35 +
                Math.random() * 0.3
            );


        const popper =
            document.createElement(
                "div"
            );


        popper.className =
            "celebration-particle";


        popper.textContent =
            "🎉";


        popper.style.left =
            x + "px";


        popper.style.top =
            y + "px";


        document.body.appendChild(
            popper
        );


        popper.animate(
            [
                {
                    transform:
                        "scale(.3) rotate(-20deg)",
                    opacity: 0
                },
                {
                    transform:
                        "scale(1.4) rotate(10deg)",
                    opacity: 1
                },
                {
                    transform:
                        "scale(.2) rotate(40deg)",
                    opacity: 0
                }
            ],
            {
                duration: 700
            }
        );


        for (let i = 0; i < 12; i++) {

            const piece =
                document.createElement(
                    "div"
                );


            piece.className =
                "celebration-particle confetti";


            piece.textContent =
                [
                    "✦",
                    "♥",
                    "🎀",
                    "•"
                ][
                    Math.floor(
                        Math.random() * 4
                    )
                ];


            piece.style.left =
                x + "px";


            piece.style.top =
                y + "px";


            document.body.appendChild(
                piece
            );


            const direction =
                x <
                window.innerWidth / 2
                    ? 1
                    : -1;


            const moveX =
                direction *
                (
                    80 +
                    Math.random() * 250
                );


            const moveY =
                (
                    Math.random() - 0.5
                ) * 250;


            piece.animate(
                [
                    {
                        transform:
                            "translate(0,0) scale(1)",
                        opacity: 1
                    },
                    {
                        transform:
                            "translate(" +
                            moveX +
                            "px," +
                            moveY +
                            "px) scale(.2)",
                        opacity: 0
                    }
                ],
                {
                    duration:
                        700 +
                        Math.random() * 700,

                    easing:
                        "ease-out"
                }
            );


            setTimeout(
                function () {

                    piece.remove();

                },
                1700
            );

        }


        setTimeout(
            function () {

                popper.remove();

            },
            1000
        );

    }


    /* =========================================================
       FIREWORK VISUAL
       NO REPEATED AUDIO
    ========================================================= */

    function createFirework() {

        const x =
            10 +
            Math.random() * 80;


        const y =
            15 +
            Math.random() * 45;


        const firework =
            document.createElement(
                "div"
            );


        firework.className =
            "celebration-particle crackle";


        firework.textContent =
            "💥";


        firework.style.left =
            x + "%";


        firework.style.top =
            y + "%";


        document.body.appendChild(
            firework
        );


        firework.animate(
            [
                {
                    transform:
                        "scale(.1)",
                    opacity: 0
                },
                {
                    transform:
                        "scale(1.5)",
                    opacity: 1
                },
                {
                    transform:
                        "scale(.1)",
                    opacity: 0
                }
            ],
            {
                duration: 500
            }
        );


        setTimeout(
            function () {

                firework.remove();

            },
            700
        );


        for (let i = 0; i < 20; i++) {

            const spark =
                document.createElement(
                    "div"
                );


            spark.className =
                "celebration-particle sparkle";


            spark.textContent =
                [
                    "✦",
                    "✧",
                    "✨"
                ][
                    Math.floor(
                        Math.random() * 3
                    )
                ];


            spark.style.left =
                x + "%";


            spark.style.top =
                y + "%";


            document.body.appendChild(
                spark
            );


            const angle =
                Math.random() *
                Math.PI *
                2;


            const distance =
                40 +
                Math.random() *
                170;


            const moveX =
                Math.cos(angle) *
                distance;


            const moveY =
                Math.sin(angle) *
                distance;


            spark.animate(
                [
                    {
                        transform:
                            "translate(0,0) scale(.2)",
                        opacity: 0
                    },
                    {
                        transform:
                            "translate(" +
                            moveX +
                            "px," +
                            moveY +
                            "px) scale(1)",
                        opacity: 1
                    },
                    {
                        transform:
                            "translate(" +
                            moveX * 1.2 +
                            "px," +
                            moveY * 1.2 +
                            "px) scale(.1)",
                        opacity: 0
                    }
                ],
                {
                    duration:
                        600 +
                        Math.random() * 500,

                    easing:
                        "ease-out"
                }
            );


            setTimeout(
                function () {

                    spark.remove();

                },
                1500
            );

        }

    }


    /* =========================================================
       FINISH CELEBRATION
    ========================================================= */

    function finishCelebration() {

        createMegaBurst();


        setTimeout(
            function () {

                if (celebrationLayer) {

                    celebrationLayer.classList.remove(
                        "active"
                    );

                }


                if (birthdayPopup) {

                    birthdayPopup.classList.add(
                        "show"
                    );

                }


                if (cakeInstruction) {

                    cakeInstruction.textContent =
                        "Happy Birthday, beautiful girl. ❤️";

                }

            },
            900
        );

    }


    /* =========================================================
       PAGE 3
    ========================================================= */

    const page3Button =
        get("page3-button");


    if (page3Button) {

        page3Button.addEventListener(
            "click",
            function () {

                initAudio();

                uiClickSound();


                window.location.href =
                    "page3.html";

            }
        );

    }

});
    const candleSound = get("candle-sound");
    const balloonSound = get("balloon-pop-sound");
    const popperSound = get("popper-sound");
    const crackleSound = get("crackle-sound");


    /*
       IMPORTANT:

       The celebration audio is created here instead of depending
       on another HTML <audio> element.

       It uses a real online applause/cheering source.
    */

    const celebrationAudio = new Audio(
        "https://cdn.pixabay.com/audio/2024/09/16/audio_6f9e1e6c9c.mp3"
    );

    celebrationAudio.preload = "auto";
    celebrationAudio.loop = true;


    let musicStarted = false;
    let celebrationAudioPlaying = false;
    let celebrationTimeout = null;


    /* =========================================================
       GENERIC SOUND PLAYER
       ========================================================= */

    function playSound(audio, volume) {

        if (!audio) {
            return;
        }

        try {

            audio.pause();
            audio.currentTime = 0;
            audio.volume = volume || 0.5;

            const promise = audio.play();

            if (promise) {
                promise.catch(function () {});
            }

        } catch (error) {
            console.log("Sound error:", error);
        }
    }


    /* =========================================================
       ORIGINAL PAGE 2 BGM
       ========================================================= */

    function startOriginalMusic() {

        if (!music || musicStarted) {
            return;
        }

        musicStarted = true;

        music.volume = 0.35;

        const promise = music.play();

        if (promise) {

            promise
                .then(function () {

                    if (musicButton) {
                        musicButton.textContent = "♫";
                    }

                })
                .catch(function () {

                    /*
                       Browser autoplay protection may still block
                       audio. That's why this function is triggered
                       by the FIRST user interaction.
                    */

                    musicStarted = false;

                    if (musicButton) {
                        musicButton.textContent = "🔇";
                    }

                });

        }
    }


    /* =========================================================
       FIRST USER INTERACTION
       ========================================================= */

    let firstInteractionDone = false;


    function handleFirstInteraction() {

        if (firstInteractionDone) {
            return;
        }

        firstInteractionDone = true;

        startOriginalMusic();

    }


    /*
       Any first click/touch/key interaction on Page 2
       unlocks the BGM.
    */

    document.addEventListener(
        "click",
        handleFirstInteraction,
        {
            once: true
        }
    );

    document.addEventListener(
        "touchstart",
        handleFirstInteraction,
        {
            once: true,
            passive: true
        }
    );

    document.addEventListener(
        "keydown",
        handleFirstInteraction,
        {
            once: true
        }
    );


    /* =========================================================
       MUSIC BUTTON
       ========================================================= */

    if (musicButton) {

        musicButton.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

                if (!music) {
                    return;
                }


                if (music.paused) {

                    music.play()
                        .then(function () {

                            musicButton.textContent = "♫";
                            musicStarted = true;

                        })
                        .catch(function () {});

                } else {

                    music.pause();

                    musicButton.textContent = "🔇";

                }

            }
        );

    }


    /* =========================================================
       FADE ORIGINAL MUSIC
       ========================================================= */

    function fadeMusicOut(duration) {

        if (!music || music.paused) {
            return;
        }

        const startVolume = music.volume;
        const steps = 20;
        const stepTime = duration / steps;

        let step = 0;


        const fade = setInterval(function () {

            step++;

            music.volume =
                Math.max(
                    0,
                    startVolume * (1 - step / steps)
                );


            if (step >= steps) {

                clearInterval(fade);

                music.pause();

                music.volume = startVolume;

            }

        }, stepTime);

    }


    /* =========================================================
       FADE ORIGINAL MUSIC BACK IN
       ========================================================= */

    function fadeMusicIn() {

        if (!music) {
            return;
        }

        music.volume = 0;

        music.play()
            .then(function () {

                if (musicButton) {
                    musicButton.textContent = "♫";
                }

            })
            .catch(function () {});


        const targetVolume = 0.35;
        const steps = 20;
        const duration = 1200;
        const stepTime = duration / steps;

        let step = 0;


        const fade = setInterval(function () {

            step++;

            music.volume =
                targetVolume *
                (step / steps);


            if (step >= steps) {

                clearInterval(fade);

                music.volume = targetVolume;

            }

        }, stepTime);

    }


    /* =========================================================
       10 SECOND BIRTHDAY CELEBRATION AUDIO
       ========================================================= */

    function startBirthdayCelebrationAudio() {

        if (celebrationAudioPlaying) {
            return;
        }

        celebrationAudioPlaying = true;


        /*
           Stop normal BGM first.
        */

        fadeMusicOut(700);


        /*
           Small delay makes the transition feel intentional.
        */

        setTimeout(function () {

            celebrationAudio.currentTime = 0;
            celebrationAudio.volume = 0.65;


            const promise =
                celebrationAudio.play();


            if (promise) {

                promise.catch(function () {

                    celebrationAudioPlaying = false;

                });

            }


            /*
               EXACTLY 10 SECONDS
            */

            celebrationTimeout =
                setTimeout(function () {

                    stopBirthdayCelebrationAudio();

                }, 10000);


        }, 750);

    }


    /* =========================================================
       STOP CELEBRATION AUDIO
       ========================================================= */

    function stopBirthdayCelebrationAudio() {

        if (!celebrationAudioPlaying) {
            return;
        }


        celebrationAudioPlaying = false;


        if (celebrationTimeout) {

            clearTimeout(
                celebrationTimeout
            );

            celebrationTimeout = null;

        }


        /*
           Fade celebration audio out gently.
        */

        const startVolume =
            celebrationAudio.volume;

        const steps = 15;
        const duration = 500;
        const stepTime = duration / steps;

        let step = 0;


        const fadeOut =
            setInterval(function () {

                step++;

                celebrationAudio.volume =
                    Math.max(
                        0,
                        startVolume *
                        (1 - step / steps)
                    );


                if (step >= steps) {

                    clearInterval(fadeOut);

                    celebrationAudio.pause();

                    celebrationAudio.currentTime = 0;

                    celebrationAudio.volume = 0.65;


                    /*
                       Bring original BGM back.
                    */

                    fadeMusicIn();

                }

            }, stepTime);

    }


    /* =========================================================
       SECTION SWITCH
       ========================================================= */

    function showSection(id) {

        document
            .querySelectorAll(".party-section")
            .forEach(function (section) {

                section.classList.remove("active");

            });


        const target = get(id);

        if (!target) {
            return;
        }


        setTimeout(function () {

            target.classList.add("active");

        }, 50);

    }


    /* =========================================================
       WELCOME
       ========================================================= */

    const welcomeSteps =
        document.querySelectorAll(".welcome-step");

    const welcomeButtons =
        document.querySelectorAll(".welcome-next");


    welcomeButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                handleFirstInteraction();


                const next =
                    button.getAttribute("data-next");


                welcomeSteps.forEach(function (step) {

                    step.classList.remove("active");

                });


                const nextStep =
                    get("welcome-step-" + next);


                if (nextStep) {

                    setTimeout(function () {

                        nextStep.classList.add("active");

                    }, 100);

                }

            }
        );

    });


    /* =========================================================
       ENTER CAKE
       ========================================================= */

    const startCakeButton =
        get("start-cake");


    if (startCakeButton) {

        startCakeButton.addEventListener(
            "click",
            function () {

                handleFirstInteraction();

                showSection("cake-section");

            }
        );

    }


    /* =========================================================
       CAKE / CANDLES
       ========================================================= */

    const candles =
        document.querySelectorAll(".candle");

    const cakeInstruction =
        get("cake-instruction");

    const celebrationLayer =
        get("celebration-layer");

    const birthdayPopup =
        get("birthday-popup");


    let candlesOff = 0;
    let celebrationStarted = false;


    candles.forEach(function (candle) {

        candle.addEventListener(
            "click",
            function () {

                handleFirstInteraction();


                if (
                    candle.classList.contains("off")
                ) {
                    return;
                }


                candle.classList.add("off");

                candlesOff++;


                /*
                   CLEAN CANDLE SOUND
                */

                playSound(
                    candleSound,
                    0.38
                );


                createSmallSparkle(candle);


                const remaining =
                    candles.length -
                    candlesOff;


                if (remaining > 0) {

                    cakeInstruction.textContent =
                        remaining +
                        " candle" +
                        (
                            remaining === 1
                                ? ""
                                : "s"
                        ) +
                        " left, sweetheart... 🕯️❤️";

                }


                /*
                   LAST CANDLE
                */

                if (
                    candlesOff ===
                    candles.length
                ) {

                    cakeInstruction.textContent =
                        "MAKE A WISH, BEAUTIFUL GIRL... ❤️✨";


                    /*
                       START 10 SECOND CELEBRATION
                    */

                    startMegaCelebration();

                }

            }
        );

    });


    /* =========================================================
       SMALL SPARKLES
       ========================================================= */

    function createSmallSparkle(candle) {

        const rect =
            candle.getBoundingClientRect();


        const symbols = [
            "✦",
            "✧",
            "✨",
            "♥"
        ];


        for (let i = 0; i < 8; i++) {

            const sparkle =
                document.createElement("div");


            sparkle.className =
                "celebration-particle sparkle";


            sparkle.textContent =
                symbols[
                    Math.floor(
                        Math.random() *
                        symbols.length
                    )
                ];


            sparkle.style.left =
                (
                    rect.left +
                    rect.width / 2
                ) + "px";


            sparkle.style.top =
                rect.top + "px";


            sparkle.style.fontSize =
                (
                    12 +
                    Math.random() * 10
                ) + "px";


            document.body.appendChild(
                sparkle
            );


            const x =
                (
                    Math.random() - 0.5
                ) * 120;


            const y =
                -(
                    30 +
                    Math.random() * 100
                );


            sparkle.animate(
                [
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
                            "px) scale(0)",
                        opacity: 0
                    }
                ],
                {
                    duration:
                        600 +
                        Math.random() * 400,

                    easing: "ease-out"
                }
            );


            setTimeout(function () {

                sparkle.remove();

            }, 1200);

        }

    }


    /* =========================================================
       10 SECOND VISUAL CELEBRATION
       ========================================================= */

    function startMegaCelebration() {

        if (celebrationStarted) {
            return;
        }


        celebrationStarted = true;


        if (celebrationLayer) {
            celebrationLayer.classList.add("active");
        }


        /*
           AUDIO SWITCH
        */

        startBirthdayCelebrationAudio();


        /*
           INITIAL BIG BURST
        */

        createMegaBurst();
        createBalloonBurst();
        createPopperBurst();
        createFirework();


        const celebrationStart =
            Date.now();


        const celebrationDuration =
            10000;


        const celebrationTimer =
            setInterval(function () {

                const elapsed =
                    Date.now() -
                    celebrationStart;


                if (
                    elapsed >=
                    celebrationDuration
                ) {

                    clearInterval(
                        celebrationTimer
                    );


                    finishCelebration();


                    return;
                }


                /*
                   Visual effects only.
                   No audio is triggered here.
                   This prevents sound clutter.
                */

                createSparkleWave();

                createConfettiBurst();

                createFirework();

                createBalloonBurst();

                createPopperBurst();


            }, 650);

    }


    /* =========================================================
       MEGA BURST
       ========================================================= */

    function createMegaBurst() {

        const symbols = [
            "✨",
            "✦",
            "✧",
            "🎉",
            "🎊",
            "❤️",
            "💖"
        ];


        for (let i = 0; i < 55; i++) {

            const particle =
                document.createElement("div");


            particle.className =
                "celebration-particle sparkle";


            particle.textContent =
                symbols[
                    Math.floor(
                        Math.random() *
                        symbols.length
                    )
                ];


            particle.style.left = "50%";
            particle.style.top = "50%";


            document.body.appendChild(
                particle
            );


            const angle =
                Math.random() *
                Math.PI *
                2;


            const distance =
                100 +
                Math.random() *
                420;


            const x =
                Math.cos(angle) *
                distance;


            const y =
                Math.sin(angle) *
                distance;


            particle.animate(
                [
                    {
                        transform:
                            "translate(-50%,-50%) scale(.2)",
                        opacity: 0
                    },
                    {
                        transform:
                            "translate(-50%,-50%) scale(1.2)",
                        opacity: 1
                    },
                    {
                        transform:
                            "translate(calc(-50% + " +
                            x +
                            "px), calc(-50% + " +
                            y +
                            "px)) scale(.2)",
                        opacity: 0
                    }
                ],
                {
                    duration:
                        900 +
                        Math.random() *
                        1000,

                    easing:
                        "cubic-bezier(.2,.8,.2,1)"
                }
            );


            setTimeout(function () {

                particle.remove();

            }, 2200);

        }

    }


    /* =========================================================
       SPARKLE WAVE
       ========================================================= */

    function createSparkleWave() {

        const symbols = [
            "✨",
            "✦",
            "✧",
            "⭐",
            "💫"
        ];


        for (let i = 0; i < 15; i++) {

            const particle =
                document.createElement("div");


            particle.className =
                "celebration-particle sparkle";


            particle.textContent =
                symbols[
                    Math.floor(
                        Math.random() *
                        symbols.length
                    )
                ];


            particle.style.left =
                Math.random() * 100 + "%";


            particle.style.top =
                Math.random() * 100 + "%";


            particle.style.fontSize =
                (
                    12 +
                    Math.random() * 25
                ) + "px";


            document.body.appendChild(
                particle
            );


            particle.animate(
                [
                    {
                        transform:
                            "scale(.2) rotate(0deg)",
                        opacity: 0
                    },
                    {
                        transform:
                            "scale(1.3) rotate(180deg)",
                        opacity: 1
                    },
                    {
                        transform:
                            "scale(.1) rotate(360deg)",
                        opacity: 0
                    }
                ],
                {
                    duration:
                        900 +
                        Math.random() * 800
                }
            );


            setTimeout(function () {

                particle.remove();

            }, 1800);

        }

    }


    /* =========================================================
       CONFETTI
       ========================================================= */

    function createConfettiBurst() {

        const symbols = [
            "🎀",
            "🎊",
            "♥",
            "✦",
            "•",
            "⭐"
        ];


        const x =
            Math.random() *
            window.innerWidth;


        const y =
            window.innerHeight * 0.1;


        for (let i = 0; i < 18; i++) {

            const piece =
                document.createElement("div");


            piece.className =
                "celebration-particle confetti";


            piece.textContent =
                symbols[
                    Math.floor(
                        Math.random() *
                        symbols.length
                    )
                ];


            piece.style.left =
                x + "px";


            piece.style.top =
                y + "px";


            document.body.appendChild(
                piece
            );


            const moveX =
                (
                    Math.random() - 0.5
                ) * 350;


            const moveY =
                250 +
                Math.random() * 500;


            piece.animate(
                [
                    {
                        transform:
                            "translate(0,0) rotate(0deg)",
                        opacity: 1
                    },
                    {
                        transform:
                            "translate(" +
                            moveX +
                            "px," +
                            moveY +
                            "px) rotate(" +
                            Math.random() *
                            720 +
                            "deg)",
                        opacity: 0
                    }
                ],
                {
                    duration:
                        1200 +
                        Math.random() * 900,

                    easing: "ease-out"
                }
            );


            setTimeout(function () {

                piece.remove();

            }, 2300);

        }

    }


    /* =========================================================
       BALLOON POP
       ========================================================= */

    function createBalloonBurst() {

        const x =
            Math.random() *
            window.innerWidth;


        const y =
            100 +
            Math.random() *
            (
                window.innerHeight *
                0.45
            );


        /*
           IMPORTANT:
           Visual balloon effect only.
           NO SOUND HERE.

           This is what keeps the celebration
           from becoming noisy.
        */


        const particle =
            document.createElement("div");


        particle.className =
            "celebration-particle";


        particle.textContent =
            "🎈💥";


        particle.style.left =
            x + "px";


        particle.style.top =
            y + "px";


        document.body.appendChild(
            particle
        );


        particle.animate(
            [
                {
                    transform: "scale(.2)",
                    opacity: 0
                },
                {
                    transform: "scale(1.5)",
                    opacity: 1
                },
                {
                    transform: "scale(0)",
                    opacity: 0
                }
            ],
            {
                duration: 650
            }
        );


        setTimeout(function () {

            particle.remove();

        }, 900);

    }


    /* =========================================================
       PARTY POPPER
       ========================================================= */

    function createPopperBurst() {

        const x =
            Math.random() < 0.5
                ? 80
                : window.innerWidth - 80;


        const y =
            window.innerHeight *
            (
                0.35 +
                Math.random() * 0.3
            );


        /*
           NO SOUND HERE.
           Celebration audio handles the crowd sound.
        */


        const popper =
            document.createElement("div");


        popper.className =
            "celebration-particle";


        popper.textContent =
            "🎉";


        popper.style.left =
            x + "px";


        popper.style.top =
            y + "px";


        document.body.appendChild(
            popper
        );


        popper.animate(
            [
                {
                    transform:
                        "scale(.3) rotate(-20deg)",
                    opacity: 0
                },
                {
                    transform:
                        "scale(1.4) rotate(10deg)",
                    opacity: 1
                },
                {
                    transform:
                        "scale(.2) rotate(40deg)",
                    opacity: 0
                }
            ],
            {
                duration: 700
            }
        );


        for (let i = 0; i < 12; i++) {

            const piece =
                document.createElement("div");


            piece.className =
                "celebration-particle confetti";


            piece.textContent =
                [
                    "✦",
                    "♥",
                    "🎀",
                    "•"
                ][
                    Math.floor(
                        Math.random() * 4
                    )
                ];


            piece.style.left =
                x + "px";


            piece.style.top =
                y + "px";


            document.body.appendChild(
                piece
            );


            const direction =
                x <
                window.innerWidth / 2
                    ? 1
                    : -1;


            const moveX =
                direction *
                (
                    80 +
                    Math.random() * 250
                );


            const moveY =
                (
                    Math.random() - 0.5
                ) * 250;


            piece.animate(
                [
                    {
                        transform:
                            "translate(0,0) scale(1)",
                        opacity: 1
                    },
                    {
                        transform:
                            "translate(" +
                            moveX +
                            "px," +
                            moveY +
                            "px) scale(.2)",
                        opacity: 0
                    }
                ],
                {
                    duration:
                        700 +
                        Math.random() * 700,

                    easing: "ease-out"
                }
            );


            setTimeout(function () {

                piece.remove();

            }, 1700);

        }


        setTimeout(function () {

            popper.remove();

        }, 1000);

    }


    /* =========================================================
       FIREWORK
       ========================================================= */

    function createFirework() {

        const x =
            10 +
            Math.random() * 80;


        const y =
            15 +
            Math.random() * 45;


        /*
           NO FIREWORK SOUND HERE.

           The 10-second celebration audio is the
           ONLY large celebration sound.
        */


        const firework =
            document.createElement("div");


        firework.className =
            "celebration-particle crackle";


        firework.textContent =
            "💥";


        firework.style.left =
            x + "%";


        firework.style.top =
            y + "%";


        document.body.appendChild(
            firework
        );


        firework.animate(
            [
                {
                    transform:
                        "scale(.1)",
                    opacity: 0
                },
                {
                    transform:
                        "scale(1.5)",
                    opacity: 1
                },
                {
                    transform:
                        "scale(.1)",
                    opacity: 0
                }
            ],
            {
                duration: 500
            }
        );


        setTimeout(function () {

            firework.remove();

        }, 700);


        for (let i = 0; i < 20; i++) {

            const spark =
                document.createElement("div");


            spark.className =
                "celebration-particle sparkle";


            spark.textContent =
                [
                    "✦",
                    "✧",
                    "✨"
                ][
                    Math.floor(
                        Math.random() * 3
                    )
                ];


            spark.style.left =
                x + "%";


            spark.style.top =
                y + "%";


            document.body.appendChild(
                spark
            );


            const angle =
                Math.random() *
                Math.PI *
                2;


            const distance =
                40 +
                Math.random() *
                170;


            const moveX =
                Math.cos(angle) *
                distance;


            const moveY =
                Math.sin(angle) *
                distance;


            spark.animate(
                [
                    {
                        transform:
                            "translate(0,0) scale(.2)",
                        opacity: 0
                    },
                    {
                        transform:
                            "translate(" +
                            moveX +
                            "px," +
                            moveY +
                            "px) scale(1)",
                        opacity: 1
                    },
                    {
                        transform:
                            "translate(" +
                            moveX * 1.2 +
                            "px," +
                            moveY * 1.2 +
                            "px) scale(.1)",
                        opacity: 0
                    }
                ],
                {
                    duration:
                        600 +
                        Math.random() * 500,

                    easing: "ease-out"
                }
            );


            setTimeout(function () {

                spark.remove();

            }, 1500);

        }

    }


    /* =========================================================
       FINISH CELEBRATION
       ========================================================= */

    function finishCelebration() {

        createMegaBurst();


        setTimeout(function () {

            if (celebrationLayer) {

                celebrationLayer.classList.remove(
                    "active"
                );

            }


            if (birthdayPopup) {

                birthdayPopup.classList.add(
                    "show"
                );

            }


            if (cakeInstruction) {

                cakeInstruction.textContent =
                    "Happy Birthday, beautiful girl. ❤️";

            }

        }, 900);

    }


    /* =========================================================
       PAGE 3
       ========================================================= */

    const page3Button =
        get("page3-button");


    if (page3Button) {

        page3Button.addEventListener(
            "click",
            function () {

                window.location.href =
                    "page3.html";

            }
        );

    }

});
