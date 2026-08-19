document.addEventListener("DOMContentLoaded", function () {

    /* =========================================================
       HELPER
    ========================================================= */

    function get(id) {
        return document.getElementById(id);
    }


    /* =========================================================
       AUDIO ENGINE
       CLEAN / SINGLE AUDIO SYSTEM
    ========================================================= */

    let audioContext = null;

    let masterGain = null;
    let musicGain = null;
    let effectGain = null;
    let celebrationGain = null;

    let audioReady = false;

    let musicPlaying = false;
    let musicMuted = false;
    let celebrationPlaying = false;

    let musicTimer = null;
    let celebrationTimer = null;
    let clapTimer = null;
    let cheerTimer = null;

    let musicStep = 0;

    const musicButton = get("music-button");


    /* =========================================================
       AUDIO INITIALIZATION
    ========================================================= */

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

            celebrationGain =
                audioContext.createGain();


            masterGain.gain.value = 0.85;

            musicGain.gain.value = 0.20;

            effectGain.gain.value = 0.32;

            celebrationGain.gain.value = 0.62;


            musicGain.connect(masterGain);

            effectGain.connect(masterGain);

            celebrationGain.connect(masterGain);

            masterGain.connect(
                audioContext.destination
            );

        }


        audioReady = true;

        return true;
    }


    /* =========================================================
       RESUME AUDIO CONTEXT
    ========================================================= */

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


        /*
           IMPORTANT:

           Unlocking audio does NOT change mute state.

           It only starts music if the user has not
           deliberately muted it.
        */

        if (
            !musicMuted &&
            !celebrationPlaying
        ) {

            startCuteBGM();

        }

    }


    /*
       Android / Chrome audio unlock.

       We intentionally use a single global handler.
    */

    let audioUnlockHandled = false;


    function firstUserInteraction() {

        if (audioUnlockHandled) {
            return;
        }

        audioUnlockHandled = true;

        unlockAudio();

    }


    document.addEventListener(
        "pointerdown",
        firstUserInteraction,
        {
            passive: true,
            once: true
        }
    );


    /* =========================================================
       BASIC TONE
    ========================================================= */

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
            start + 0.018
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


    /* =========================================================
       UI CLICK
    ========================================================= */

    function uiClickSound() {

        if (!initAudio()) {
            return;
        }


        tone(
            620,
            0.065,
            0.032,
            "sine",
            effectGain
        );


        tone(
            850,
            0.045,
            0.018,
            "sine",
            effectGain,
            0.035
        );

    }


    /* =========================================================
       MAGICAL CHIME
    ========================================================= */

    function magicalChime() {

        if (!initAudio()) {
            return;
        }


        tone(
            523.25,
            0.28,
            0.055,
            "sine",
            effectGain
        );


        tone(
            659.25,
            0.32,
            0.042,
            "sine",
            effectGain,
            0.08
        );


        tone(
            783.99,
            0.42,
            0.032,
            "triangle",
            effectGain,
            0.16
        );

    }


    /* =========================================================
       CANDLE SOUND
    ========================================================= */

    function candleFlick() {

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
            "triangle";


        oscillator.frequency.setValueAtTime(
            430,
            start
        );


        oscillator.frequency.exponentialRampToValueAtTime(
            190,
            start + 0.11
        );


        gain.gain.setValueAtTime(
            0.0001,
            start
        );


        gain.gain.exponentialRampToValueAtTime(
            0.055,
            start + 0.015
        );


        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            start + 0.14
        );


        oscillator.connect(gain);

        gain.connect(effectGain);


        oscillator.start(start);

        oscillator.stop(
            start + 0.17
        );

    }


    /* =========================================================
       FINAL CANDLE
    ========================================================= */

    function finalCandleSound() {

        if (!initAudio()) {
            return;
        }


        tone(
            523.25,
            0.30,
            0.055,
            "sine",
            effectGain
        );


        tone(
            659.25,
            0.35,
            0.050,
            "sine",
            effectGain,
            0.10
        );


        tone(
            783.99,
            0.45,
            0.045,
            "triangle",
            effectGain,
            0.20
        );


        tone(
            1046.50,
            0.65,
            0.028,
            "sine",
            effectGain,
            0.32
        );

    }


    /* =========================================================
       CUTE BGM
    ========================================================= */

    function startCuteBGM() {

        /*
           NEVER start normal music while celebration
           music is active.
        */

        if (
            musicPlaying ||
            musicMuted ||
            celebrationPlaying
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


        playMusicLoop();

    }


    function playMusicLoop() {

        if (
            !musicPlaying ||
            musicMuted ||
            celebrationPlaying
        ) {

            return;

        }


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


        const note =
            melody[musicStep];


        tone(
            note,
            0.42,
            0.022,
            "sine",
            musicGain
        );


        /*
           Soft harmony every fourth note.
        */

        if (
            musicStep % 4 === 0
        ) {

            tone(
                note / 2,
                0.62,
                0.009,
                "triangle",
                musicGain
            );

        }


        musicStep++;


        if (
            musicStep >= melody.length
        ) {

            musicStep = 0;

        }


        musicTimer =
            setTimeout(
                playMusicLoop,
                390
            );

    }


    /* =========================================================
       STOP NORMAL BGM
    ========================================================= */

    function stopCuteBGM() {

        musicPlaying = false;


        if (musicTimer) {

            clearTimeout(
                musicTimer
            );

            musicTimer = null;

        }

    }


    /* =========================================================
       MUSIC BUTTON
    ========================================================= */

    if (musicButton) {

        musicButton.addEventListener(
            "pointerdown",
            function (event) {

                event.stopPropagation();

                initAudio();


                if (musicMuted) {

                    /*
                       USER IS TURNING MUSIC ON.
                    */

                    musicMuted = false;

                    if (
                        !celebrationPlaying
                    ) {

                        startCuteBGM();

                    }


                } else {

                    /*
                       USER IS TURNING MUSIC OFF.
                    */

                    musicMuted = true;

                    stopCuteBGM();


                    musicButton.textContent =
                        "🔇";

                }

            }
        );

    }


    /* =========================================================
       CELEBRATION CLAP
    ========================================================= */

    function createClap() {

        if (
            !audioContext ||
            !celebrationPlaying
        ) {
            return;
        }


        const duration = 0.055;


        const buffer =
            audioContext.createBuffer(
                1,
                audioContext.sampleRate *
                duration,
                audioContext.sampleRate
            );


        const data =
            buffer.getChannelData(0);


        for (
            let i = 0;
            i < data.length;
            i++
        ) {

            data[i] =
                (
                    Math.random() * 2 - 1
                ) *
                Math.exp(
                    -i /
                    (
                        data.length * 0.10
                    )
                );

        }


        const source =
            audioContext.createBufferSource();


        const gain =
            audioContext.createGain();


        source.buffer =
            buffer;


        gain.gain.value =
            0.13;


        source.connect(gain);

        gain.connect(
            celebrationGain
        );


        source.start();

    }


    /* =========================================================
       CHEER
    ========================================================= */

    function createCheer() {

        if (
            !audioContext ||
            !celebrationPlaying
        ) {
            return;
        }


        const duration = 0.7;


        const buffer =
            audioContext.createBuffer(
                1,
                audioContext.sampleRate *
                duration,
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


            const envelope =
                Math.sin(
                    Math.PI *
                    i /
                    data.length
                );


            data[i] =
                noise *
                envelope *
                0.15;

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
            1250;


        filter.Q.value =
            0.7;


        gain.gain.value =
            0.075;


        source.connect(filter);

        filter.connect(gain);

        gain.connect(
            celebrationGain
        );


        source.start();

    }


    /* =========================================================
       CELEBRATION MUSIC
       10 SECONDS
    ========================================================= */

    function celebrationMelody() {

        if (
            !celebrationPlaying
        ) {
            return;
        }


        const notes = [

            523.25,
            523.25,
            587.33,
            523.25,

            698.46,
            659.25,

            523.25,
            523.25,
            587.33,
            523.25,

            783.99,
            698.46

        ];


        notes.forEach(
            function (
                note,
                index
            ) {

                tone(
                    note,
                    0.32,
                    0.035,
                    "sine",
                    celebrationGain,
                    index * 0.36
                );

            }
        );

    }


    /* =========================================================
       START 10 SECOND CELEBRATION
    ========================================================= */

    function startCelebrationAudio() {

        if (
            celebrationPlaying
        ) {
            return;
        }


        if (!initAudio()) {
            return;
        }


        celebrationPlaying = true;


        /*
           STOP NORMAL BGM FIRST.
        */

        stopCuteBGM();


        /*
           Celebration melody.
        */

        celebrationMelody();


        /*
           Initial warm chord.
        */

        tone(
            523.25,
            0.45,
            0.045,
            "triangle",
            celebrationGain
        );


        tone(
            659.25,
            0.50,
            0.035,
            "triangle",
            celebrationGain,
            0.08
        );


        tone(
            783.99,
            0.60,
            0.030,
            "triangle",
            celebrationGain,
            0.16
        );


        /*
           CLAPPING

           Not too frequent.
        */

        clapTimer =
            setInterval(
                function () {

                    if (
                        !celebrationPlaying
                    ) {
                        return;
                    }


                    createClap();


                    /*
                       Occasional double clap.
                    */

                    if (
                        Math.random() < 0.30
                    ) {

                        setTimeout(
                            function () {

                                if (
                                    celebrationPlaying
                                ) {

                                    createClap();

                                }

                            },
                            110
                        );

                    }

                },
                650
            );


        /*
           CHEERS

           Less frequent than clapping
           so the sound stays pleasant.
        */

        cheerTimer =
            setInterval(
                function () {

                    if (
                        celebrationPlaying
                    ) {

                        createCheer();

                    }

                },
                1900
            );


        /*
           EXACTLY 10 SECONDS.
        */

        celebrationTimer =
            setTimeout(
                function () {

                    stopCelebrationAudio();

                },
                10000
            );

    }


    /* =========================================================
       STOP CELEBRATION
    ========================================================= */

    function stopCelebrationAudio() {

        if (
            !celebrationPlaying
        ) {
            return;
        }


        celebrationPlaying = false;


        if (celebrationTimer) {

            clearTimeout(
                celebrationTimer
            );

            celebrationTimer = null;

        }


        if (clapTimer) {

            clearInterval(
                clapTimer
            );

            clapTimer = null;

        }


        if (cheerTimer) {

            clearInterval(
                cheerTimer
            );

            cheerTimer = null;

        }


        /*
           Return to normal BGM.

           Respect user's mute state.
        */

        if (!musicMuted) {

            setTimeout(
                function () {

                    startCuteBGM();

                },
                180
            );

        }

    }


    /* =========================================================
       SECTION SWITCH
    ========================================================= */

    function showSection(id) {

        document
            .querySelectorAll(
                ".party-section"
            )
            .forEach(
                function (section) {

                    section.classList.remove(
                        "active"
                    );

                }
            );


        const target =
            get(id);


        if (!target) {
            return;
        }


        setTimeout(
            function () {

                target.classList.add(
                    "active"
                );

            },
            50
        );

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


    welcomeButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    unlockAudio();

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

        }
    );


    /* =========================================================
       ENTER CAKE
    ========================================================= */

    const startCake =
        get("start-cake");


    if (startCake) {

        startCake.addEventListener(
            "click",
            function () {

                unlockAudio();

                uiClickSound();


                showSection(
                    "cake-section"
                );


                setTimeout(
                    function () {

                        magicalChime();

                    },
                    180
                );

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


    candles.forEach(
        function (candle) {

            candle.addEventListener(
                "click",
                function () {

                    unlockAudio();


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


                    candleFlick();


                    createSmallSparkle(
                        candle
                    );


                    const remaining =
                        candles.length -
                        candlesOff;


                    if (
                        remaining > 0
                    ) {

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


                        finalCandleSound();


                        setTimeout(
                            function () {

                                startMegaCelebration();

                            },
                            180
                        );

                    }

                }
            );

        }
    );


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


        for (
            let i = 0;
            i < 8;
            i++
        ) {

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
                ) +
                "px";


            sparkle.style.top =
                rect.top +
                "px";


            sparkle.style.fontSize =
                (
                    12 +
                    Math.random() * 10
                ) +
                "px";


            document.body.appendChild(
                sparkle
            );


            const x =
                (
                    Math.random() - 0.5
                ) *
                120;


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

        if (
            celebrationStarted
        ) {
            return;
        }


        celebrationStarted = true;


        if (
            celebrationLayer
        ) {

            celebrationLayer.classList.add(
                "active"
            );

        }


        /*
           AUDIO STARTS HERE.
        */

        startCelebrationAudio();


        createMegaBurst();

        createBalloonBurst();

        createPopperBurst();

        createFirework();


        const celebrationStart =
            Date.now();


        const celebrationDuration =
            10000;


        const celebrationVisualTimer =
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
                            celebrationVisualTimer
                        );


                        finishCelebration();

                        return;

                    }


                    /*
                       VISUALS ONLY.

                       No sound is triggered here.
                    */

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


        for (
            let i = 0;
            i < 55;
            i++
        ) {

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
                        Math.random() *
                        1000,

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


        for (
            let i = 0;
            i < 15;
            i++
        ) {

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
                Math.random() *
                100 +
                "%";


            particle.style.top =
                Math.random() *
                100 +
                "%";


            particle.style.fontSize =
                (
                    12 +
                    Math.random() *
                    25
                ) +
                "px";


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
                        Math.random() *
                        800
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


        for (
            let i = 0;
            i < 18;
            i++
        ) {

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
                x +
                "px";


            piece.style.top =
                y +
                "px";


            document.body.appendChild(
                piece
            );


            const moveX =
                (
                    Math.random() -
                    0.5
                ) *
                350;


            const moveY =
                250 +
                Math.random() *
                500;


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
                        Math.random() *
                        900,

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
       BALLOON BURST
       VISUAL ONLY
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
            x +
            "px";


        particle.style.top =
            y +
            "px";


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
       PARTY POPPER
       VISUAL ONLY
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
                Math.random() *
                0.3
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
            x +
            "px";


        popper.style.top =
            y +
            "px";


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


        for (
            let i = 0;
            i < 12;
            i++
        ) {

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
                        Math.random() *
                        4
                    )
                ];


            piece.style.left =
                x +
                "px";


            piece.style.top =
                y +
                "px";


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
                    Math.random() *
                    250
                );


            const moveY =
                (
                    Math.random() -
                    0.5
                ) *
                250;


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
                        Math.random() *
                        700,

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
       FIREWORK
       VISUAL ONLY
    ========================================================= */

    function createFirework() {

        const x =
            10 +
            Math.random() *
            80;


        const y =
            15 +
            Math.random() *
            45;


        const firework =
            document.createElement(
                "div"
            );


        firework.className =
            "celebration-particle crackle";


        firework.textContent =
            "💥";


        firework.style.left =
            x +
            "%";


        firework.style.top =
            y +
            "%";


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


        for (
            let i = 0;
            i < 20;
            i++
        ) {

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
                        Math.random() *
                        3
                    )
                ];


            spark.style.left =
                x +
                "%";


            spark.style.top =
                y +
                "%";


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
                        Math.random() *
                        500,

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

        /*
           Audio is stopped by its own
           10-second timer.

           This is just a safety call.
        */

        stopCelebrationAudio();


        createMegaBurst();


        setTimeout(
            function () {

                if (
                    celebrationLayer
                ) {

                    celebrationLayer.classList.remove(
                        "active"
                    );

                }


                if (
                    birthdayPopup
                ) {

                    birthdayPopup.classList.add(
                        "show"
                    );

                }


                if (
                    cakeInstruction
                ) {

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

                unlockAudio();

                uiClickSound();


                setTimeout(
                    function () {

                        window.location.href =
                            "page3.html";

                    },
                    120
                );

            }
        );

    }


    /* =========================================================
       INITIAL MUSIC BUTTON STATE
    ========================================================= */

    if (musicButton) {

        /*
           IMPORTANT:
           Do NOT claim music is playing before
           the browser has allowed audio.
        */

        musicButton.textContent =
            "🔇";

    }

});
