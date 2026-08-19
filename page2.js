document.addEventListener("DOMContentLoaded", function () {

    /* =========================================================
       PAGE 2 - BIRTHDAY CELEBRATION ENGINE
       AUDIO + VISUALS
    ========================================================= */


    /* =========================================================
       HELPER
    ========================================================= */

    function get(id) {
        return document.getElementById(id);
    }


    /* =========================================================
       ELEMENTS
    ========================================================= */

    const musicButton = get("music-button");

    const celebrationLayer =
        get("celebration-layer");

    const birthdayPopup =
        get("birthday-popup");

    const cakeInstruction =
        get("cake-instruction");


    /* =========================================================
       AUDIO ENGINE
       No uploaded audio files required.
    ========================================================= */

    let audioContext = null;

    let masterGain = null;

    let musicGain = null;

    let musicRunning = false;

    let musicTimer = null;

    let musicStep = 0;

    let audioUnlocked = false;

    let celebrationAudioStarted = false;


    /* =========================================================
       AUDIO COOLDOWNS
       Prevents irritating overlapping sounds.
    ========================================================= */

    let lastBalloonSound = 0;

    let lastPopperSound = 0;

    let lastCrackleSound = 0;

    let lastSparkleSound = 0;

    let lastUIClick = 0;


    const COOLDOWN = {

        balloon: 900,

        popper: 750,

        crackle: 700,

        sparkle: 250,

        ui: 100

    };


    /* =========================================================
       CREATE AUDIO CONTEXT
    ========================================================= */

    function setupAudio() {

        if (audioContext) {
            return;
        }


        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;


        if (!AudioContext) {
            return;
        }


        audioContext =
            new AudioContext();


        masterGain =
            audioContext.createGain();


        musicGain =
            audioContext.createGain();


        masterGain.gain.value = 0.72;

        musicGain.gain.value = 0.22;


        musicGain.connect(masterGain);

        masterGain.connect(
            audioContext.destination
        );


        audioUnlocked = true;

    }


    /* =========================================================
       RESUME AUDIO
    ========================================================= */

    async function unlockAudio() {

        setupAudio();


        if (!audioContext) {
            return false;
        }


        if (
            audioContext.state ===
            "suspended"
        ) {

            try {

                await audioContext.resume();

            } catch (error) {

                return false;

            }

        }


        audioUnlocked = true;

        return true;

    }


    /* =========================================================
       OSCILLATOR HELPER
    ========================================================= */

    function createTone(
        frequency,
        duration,
        volume,
        type,
        destination,
        startDelay
    ) {

        if (!audioContext) {
            return;
        }


        const now =
            audioContext.currentTime +
            (startDelay || 0);


        const oscillator =
            audioContext.createOscillator();


        const gain =
            audioContext.createGain();


        oscillator.type =
            type || "sine";


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

        gain.connect(
            destination || masterGain
        );


        oscillator.start(now);

        oscillator.stop(
            now + duration + 0.03
        );

    }


    /* =========================================================
       NOISE HELPER
       Used for pops and crackles.
    ========================================================= */

    function createNoise(
        duration,
        volume,
        filterFrequency
    ) {

        if (!audioContext) {
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


        source.buffer = buffer;


        const filter =
            audioContext.createBiquadFilter();


        filter.type = "highpass";

        filter.frequency.value =
            filterFrequency || 1000;


        const gain =
            audioContext.createGain();


        const now =
            audioContext.currentTime;


        gain.gain.setValueAtTime(
            0.0001,
            now
        );


        gain.gain.exponentialRampToValueAtTime(
            Math.max(volume, 0.0001),
            now + 0.005
        );


        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            now + duration
        );


        source.connect(filter);

        filter.connect(gain);

        gain.connect(masterGain);


        source.start(now);

        source.stop(
            now + duration + 0.02
        );

    }


    /* =========================================================
       UI CLICK
    ========================================================= */

    function playUIClick() {

        if (!audioUnlocked) {
            return;
        }


        const now =
            Date.now();


        if (
            now - lastUIClick <
            COOLDOWN.ui
        ) {
            return;
        }


        lastUIClick = now;


        createTone(
            620,
            0.055,
            0.045,
            "sine"
        );

    }


    /* =========================================================
       SOFT SPARKLE
    ========================================================= */

    function playSparkleSound() {

        if (!audioUnlocked) {
            return;
        }


        const now =
            Date.now();


        if (
            now - lastSparkleSound <
            COOLDOWN.sparkle
        ) {
            return;
        }


        lastSparkleSound = now;


        createTone(
            880,
            0.12,
            0.035,
            "sine"
        );


        createTone(
            1320,
            0.16,
            0.025,
            "sine",
            masterGain,
            0.055
        );

    }


    /* =========================================================
       CANDLE SOUND
    ========================================================= */

    function playCandleSound() {

        if (!audioUnlocked) {
            return;
        }


        createTone(
            540,
            0.12,
            0.055,
            "sine"
        );


        createTone(
            760,
            0.18,
            0.035,
            "sine",
            masterGain,
            0.06
        );

    }


    /* =========================================================
       LAST CANDLE / WISH SOUND
    ========================================================= */

    function playWishSound() {

        if (!audioUnlocked) {
            return;
        }


        createTone(
            392,
            0.35,
            0.055,
            "sine"
        );


        createTone(
            523.25,
            0.42,
            0.05,
            "sine",
            masterGain,
            0.12
        );


        createTone(
            659.25,
            0.5,
            0.045,
            "sine",
            masterGain,
            0.24
        );


        createTone(
            783.99,
            0.7,
            0.04,
            "sine",
            masterGain,
            0.38
        );

    }


    /* =========================================================
       BALLOON POP
    ========================================================= */

    function playBalloonSound() {

        if (!audioUnlocked) {
            return;
        }


        const now =
            Date.now();


        if (
            now - lastBalloonSound <
            COOLDOWN.balloon
        ) {
            return;
        }


        lastBalloonSound = now;


        createNoise(
            0.09,
            0.075,
            900
        );


        createTone(
            130,
            0.12,
            0.045,
            "triangle"
        );

    }


    /* =========================================================
       PARTY POPPER
    ========================================================= */

    function playPopperSound() {

        if (!audioUnlocked) {
            return;
        }


        const now =
            Date.now();


        if (
            now - lastPopperSound <
            COOLDOWN.popper
        ) {
            return;
        }


        lastPopperSound = now;


        createNoise(
            0.12,
            0.065,
            1200
        );


        createTone(
            240,
            0.08,
            0.035,
            "triangle"
        );

    }


    /* =========================================================
       FIREWORK CRACKLE
    ========================================================= */

    function playCrackleSound() {

        if (!audioUnlocked) {
            return;
        }


        const now =
            Date.now();


        if (
            now - lastCrackleSound <
            COOLDOWN.crackle
        ) {
            return;
        }


        lastCrackleSound = now;


        createNoise(
            0.18,
            0.055,
            2200
        );


        createNoise(
            0.11,
            0.035,
            3500
        );


        createTone(
            95,
            0.18,
            0.025,
            "triangle"
        );

    }


    /* =========================================================
       CELEBRATION START SOUND
    ========================================================= */

    function playCelebrationStart() {

        if (!audioUnlocked) {
            return;
        }


        createTone(
            261.63,
            0.45,
            0.05,
            "sine"
        );


        createTone(
            329.63,
            0.5,
            0.045,
            "sine",
            masterGain,
            0.08
        );


        createTone(
            392,
            0.6,
            0.04,
            "sine",
            masterGain,
            0.16
        );


        createTone(
            523.25,
            0.8,
            0.035,
            "sine",
            masterGain,
            0.28
        );

    }


    /* =========================================================
       CELEBRATION END SOUND
    ========================================================= */

    function playCelebrationEnd() {

        if (!audioUnlocked) {
            return;
        }


        createTone(
            659.25,
            0.4,
            0.045,
            "sine"
        );


        createTone(
            783.99,
            0.5,
            0.04,
            "sine",
            masterGain,
            0.1
        );


        createTone(
            1046.5,
            0.85,
            0.035,
            "sine",
            masterGain,
            0.22
        );

    }


    /* =========================================================
       BACKGROUND MUSIC
       Soft romantic birthday atmosphere.
    ========================================================= */

    const melody = [

        523.25,
        659.25,
        783.99,
        659.25,

        587.33,
        698.46,
        880,
        698.46,

        523.25,
        659.25,
        783.99,
        987.77,

        880,
        783.99,
        659.25,
        523.25

    ];


    function playMusicNote() {

        if (
            !audioContext ||
            !musicRunning
        ) {
            return;
        }


        const note =
            melody[
                musicStep %
                melody.length
            ];


        musicStep++;


        createTone(
            note,
            0.72,
            0.028,
            "sine",
            musicGain
        );


        if (
            musicStep % 4 === 0
        ) {

            createTone(
                note / 2,
                0.85,
                0.012,
                "triangle",
                musicGain
            );

        }


        musicTimer =
            setTimeout(
                playMusicNote,
                620
            );

    }


    function startBirthdayMusic() {

        if (!audioUnlocked) {
            return;
        }


        if (musicRunning) {
            return;
        }


        musicRunning = true;

        musicStep = 0;


        if (musicButton) {
            musicButton.textContent =
                "♫";
        }


        playMusicNote();

    }


    function stopBirthdayMusic() {

        musicRunning = false;


        if (musicTimer) {

            clearTimeout(
                musicTimer
            );

            musicTimer = null;

        }


        if (musicButton) {
            musicButton.textContent =
                "🔇";
        }

    }


    /* =========================================================
       MUSIC BUTTON
    ========================================================= */

    if (musicButton) {

        musicButton.addEventListener(
            "click",
            async function () {

                await unlockAudio();

                playUIClick();


                if (musicRunning) {

                    stopBirthdayMusic();

                } else {

                    startBirthdayMusic();

                }

            }
        );

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
                async function () {

                    await unlockAudio();

                    playUIClick();


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
            async function () {

                await unlockAudio();

                playUIClick();


                showSection(
                    "cake-section"
                );


                setTimeout(
                    function () {

                        startBirthdayMusic();

                    },
                    250
                );


                /* Gentle entrance chime */

                createTone(
                    523.25,
                    0.35,
                    0.04,
                    "sine"
                );


                createTone(
                    659.25,
                    0.45,
                    0.035,
                    "sine",
                    masterGain,
                    0.1
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


    let candlesOff = 0;

    let celebrationStarted = false;


    candles.forEach(
        function (candle) {

            candle.addEventListener(
                "click",
                async function () {

                    await unlockAudio();


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


                    playCandleSound();


                    createSmallSparkle(
                        candle
                    );


                    const remaining =
                        candles.length -
                        candlesOff;


                    if (remaining > 0) {

                        if (cakeInstruction) {

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

                    }


                    if (
                        candlesOff ===
                        candles.length
                    ) {

                        if (cakeInstruction) {

                            cakeInstruction.textContent =
                                "MAKE A WISH, BEAUTIFUL GIRL... ❤️✨";

                        }


                        playWishSound();


                        setTimeout(
                            function () {

                                startMegaCelebration();

                            },
                            450
                        );

                    }

                }
            );

        }
    );


    /* =========================================================
       SMALL SPARKLES
    ========================================================= */

    function createSmallSparkle(
        candle
    ) {

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
                    Math.random() - .5
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
       10 SECOND CELEBRATION
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


        startBirthdayMusic();

        playCelebrationStart();


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
                x + "px";


            piece.style.top =
                y + "px";


            document.body.appendChild(
                piece
            );


            const moveX =
                (
                    Math.random() - .5
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
       BALLOON BURST
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
                .45
            );


        /*
         * Sound is throttled separately.
         * Visuals continue freely.
         */

        playBalloonSound();


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
       PARTY POPPER
    ========================================================= */

    function createPopperBurst() {

        const x =
            Math.random() < .5
                ? 80
                : window.innerWidth - 80;


        const y =
            window.innerHeight *
            (
                .35 +
                Math.random() * .3
            );


        playPopperSound();


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
                    Math.random() - .5
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
         * The visual firework can happen frequently,
         * but the crackle sound is independently throttled.
         */

        playCrackleSound();


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


        playCelebrationEnd();


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
            async function () {

                await unlockAudio();

                playUIClick();


                /*
                 * Tiny transition melody
                 */

                createTone(
                    523.25,
                    0.2,
                    0.035,
                    "sine"
                );


                createTone(
                    659.25,
                    0.25,
                    0.03,
                    "sine",
                    masterGain,
                    0.08
                );


                createTone(
                    783.99,
                    0.35,
                    0.025,
                    "sine",
                    masterGain,
                    0.16
                );


                setTimeout(
                    function () {

                        window.location.href =
                            "page3.html";

                    },
                    350
                );

            }
        );

    }


    /* =========================================================
       OPTIONAL GLOBAL BUTTON SOUND
       Gives other buttons a subtle click automatically.
    ========================================================= */

    document
        .querySelectorAll(
            "button:not(#music-button)"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        /*
                         * Don't add an extra click if
                         * the button already has its own
                         * dedicated audio event.
                         */

                        const id =
                            button.id;


                        if (
                            id === "start-cake" ||
                            id === "page3-button"
                        ) {
                            return;
                        }


                        playUIClick();

                    }
                );

            }
        );


    /* =========================================================
       SAFETY:
       If user touches/clicks anywhere first,
       prepare the audio engine.
    ========================================================= */

    document.addEventListener(
        "pointerdown",
        function () {

            if (!audioUnlocked) {
                unlockAudio();
            }

        },
        {
            once: true
        }
    );


});
