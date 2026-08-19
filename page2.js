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

    let musicManuallyMuted = false;
    let birthdayMode = false;

    let celebrationMusicTimer = null;

    let musicWasPlaying = false;


    /* =========================================================
       WEB AUDIO INITIALIZATION
    ========================================================= */

    function initAudioContext() {

        if (!audioContext) {

            try {

                const AudioContext =
                    window.AudioContext ||
                    window.webkitAudioContext;

                if (!AudioContext) {
                    return null;
                }

                audioContext =
                    new AudioContext();

            } catch (error) {

                console.log(
                    "Web Audio unavailable:",
                    error
                );

                return null;
            }
        }


        if (
            audioContext.state ===
            "suspended"
        ) {

            audioContext.resume()
                .catch(function () {});

        }


        return audioContext;

    }


    /* =========================================================
       NORMAL BGM
    ========================================================= */

    function startNormalMusic() {

        if (!music) {
            return;
        }

        if (musicManuallyMuted) {
            return;
        }

        if (birthdayMode) {
            return;
        }


        try {

            music.volume = 0.30;


            const promise =
                music.play();


            if (promise) {

                promise
                    .then(function () {

                        updateMusicButton(true);

                    })
                    .catch(function (error) {

                        /*
                           IMPORTANT:

                           Do NOT set musicManuallyMuted here.

                           Browser autoplay blocking is NOT
                           the same thing as the user muting
                           the music.
                        */

                        console.log(
                            "BGM waiting for user interaction."
                        );

                        updateMusicButton(false);

                    });

            }

        } catch (error) {

            console.log(
                "BGM error:",
                error
            );

        }

    }


    /* =========================================================
       STOP NORMAL BGM
    ========================================================= */

    function stopNormalMusic() {

        if (!music) {
            return;
        }


        try {

            musicWasPlaying =
                !music.paused;


            music.pause();

        } catch (error) {

            console.log(
                "Music stop error:",
                error
            );

        }

    }


    /* =========================================================
       MUSIC BUTTON DISPLAY
    ========================================================= */

    function updateMusicButton(isPlaying) {

        if (!musicButton) {
            return;
        }


        musicButton.textContent =
            isPlaying
                ? "♫"
                : "🔇";

    }


    /* =========================================================
       MUSIC BUTTON
    ========================================================= */

    if (musicButton) {

        musicButton.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();


                initAudioContext();


                if (!music) {
                    return;
                }


                if (birthdayMode) {
                    return;
                }


                if (!music.paused) {

                    /*
                       USER intentionally muted music.
                    */

                    music.pause();

                    musicManuallyMuted =
                        true;

                    updateMusicButton(false);

                } else {

                    /*
                       USER intentionally turned music
                       back on.
                    */

                    musicManuallyMuted =
                        false;


                    music.volume =
                        0.30;


                    music.play()
                        .then(function () {

                            updateMusicButton(true);

                        })
                        .catch(function () {

                            updateMusicButton(false);

                        });

                }

            }
        );

    }


    /* =========================================================
       UNLOCK AUDIO ON FIRST USER INTERACTION
       ========================================================= */

    function unlockAudio() {

        initAudioContext();


        /*
           Only attempt BGM if the user has not
           intentionally muted it.
        */

        if (
            !musicManuallyMuted &&
            !birthdayMode
        ) {

            startNormalMusic();

        }

    }


    document.addEventListener(
        "pointerdown",
        unlockAudio,
        {
            once: true
        }
    );


    /* =========================================================
       INITIAL BGM ATTEMPT
       ========================================================= */

    /*
       This may work on some browsers.

       If the browser blocks it, the first tap
       will start it automatically.
    */

    startNormalMusic();


    /* =========================================================
       SIMPLE AUDIO FILE SOUND EFFECT
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
                    : 0.30;


            const promise =
                audio.play();


            if (promise) {

                promise.catch(
                    function () {}
                );

            }

        } catch (error) {

            console.log(
                "Sound effect error:",
                error
            );

        }

    }


    /* =========================================================
       CUTE UI CLICK SOUND
    ========================================================= */

    function uiClickSound() {

        const ctx =
            initAudioContext();


        if (!ctx) {
            return;
        }


        const now =
            ctx.currentTime;


        const oscillator =
            ctx.createOscillator();


        const gain =
            ctx.createGain();


        oscillator.type =
            "sine";


        oscillator.frequency.setValueAtTime(
            650,
            now
        );


        oscillator.frequency.exponentialRampToValueAtTime(
            900,
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
            ctx.destination
        );


        oscillator.start(now);

        oscillator.stop(
            now + 0.08
        );

    }


    /* =========================================================
       10 SECOND BIRTHDAY CELEBRATION MUSIC
    ========================================================= */

    function startBirthdayCelebrationMusic() {

        if (birthdayMode) {
            return;
        }


        birthdayMode = true;


        /*
           STOP NORMAL BGM.
        */

        stopNormalMusic();


        const ctx =
            initAudioContext();


        if (!ctx) {

            /*
               Even if Web Audio isn't available,
               return to normal music after 10 sec.
            */

            celebrationMusicTimer =
                setTimeout(
                    function () {

                        stopBirthdayCelebrationMusic();

                    },
                    10000
                );

            return;

        }


        const start =
            ctx.currentTime + 0.05;


        /*
           HAPPY BIRTHDAY MELODY

           "Happy Birthday to You"
        */

        const notes = [

            [261.63, 0.45],
            [261.63, 0.45],
            [293.66, 0.85],
            [261.63, 0.85],
            [349.23, 0.85],
            [329.63, 1.10],

            [261.63, 0.45],
            [261.63, 0.45],
            [293.66, 0.85],
            [261.63, 0.85],
            [392.00, 0.85],
            [349.23, 1.10]

        ];


        let time =
            start;


        notes.forEach(
            function (note) {

                const frequency =
                    note[0];

                const duration =
                    note[1];


                const oscillator =
                    ctx.createOscillator();


                const gain =
                    ctx.createGain();


                oscillator.type =
                    "triangle";


                oscillator.frequency.value =
                    frequency;


                gain.gain.setValueAtTime(
                    0.0001,
                    time
                );


                gain.gain.exponentialRampToValueAtTime(
                    0.13,
                    time + 0.035
                );


                gain.gain.exponentialRampToValueAtTime(
                    0.0001,
                    time +
                    duration -
                    0.04
                );


                oscillator.connect(gain);

                gain.connect(
                    ctx.destination
                );


                oscillator.start(time);


                oscillator.stop(
                    time + duration
                );


                time +=
                    duration + 0.04;

            }
        );


        /*
           SOFT CELEBRATION CHORD
        */

        const chord = [
            261.63,
            329.63,
            392.00
        ];


        chord.forEach(
            function (frequency) {

                const oscillator =
                    ctx.createOscillator();


                const gain =
                    ctx.createGain();


                oscillator.type =
                    "sine";


                oscillator.frequency.value =
                    frequency;


                gain.gain.setValueAtTime(
                    0.0001,
                    start
                );


                gain.gain.exponentialRampToValueAtTime(
                    0.025,
                    start + 0.5
                );


                gain.gain.exponentialRampToValueAtTime(
                    0.0001,
                    start + 9.5
                );


                oscillator.connect(gain);

                gain.connect(
                    ctx.destination
                );


                oscillator.start(start);

                oscillator.stop(
                    start + 9.7
                );

            }
        );


        /*
           10 SECOND TIMER
        */

        celebrationMusicTimer =
            setTimeout(
                function () {

                    stopBirthdayCelebrationMusic();

                },
                10000
            );

    }


    /* =========================================================
       STOP CELEBRATION MUSIC
    ========================================================= */

    function stopBirthdayCelebrationMusic() {

        birthdayMode = false;


        if (celebrationMusicTimer) {

            clearTimeout(
                celebrationMusicTimer
            );

            celebrationMusicTimer =
                null;

        }


        /*
           RETURN TO ORIGINAL BGM.
        */

        if (
            music &&
            !musicManuallyMuted
        ) {

            setTimeout(
                function () {

                    startNormalMusic();

                },
                150
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

                    uiClickSound();


                    /*
                       THIS IS THE FIRST USER
                       INTERACTION.

                       Start BGM here.
                    */

                    if (
                        !musicManuallyMuted &&
                        !birthdayMode
                    ) {

                        startNormalMusic();

                    }


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

                uiClickSound();


                if (
                    !musicManuallyMuted &&
                    !birthdayMode
                ) {

                    startNormalMusic();

                }


                showSection(
                    "cake-section"
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

    let celebrationStarted =
        false;


    candles.forEach(
        function (candle) {

            candle.addEventListener(
                "click",
                function () {

                    /*
                       Make absolutely sure audio
                       is unlocked.
                    */

                    initAudioContext();


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
                       CANDLE SOUND
                    */

                    playSound(
                        candleSound,
                        0.28
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
                           START THE 10-SECOND
                           BIRTHDAY MUSIC.
                        */

                        startBirthdayCelebrationMusic();


                        /*
                           START VISUAL CELEBRATION.
                        */

                        startMegaCelebration();

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
                    Math.random() -
                    0.5
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


        celebrationStarted =
            true;


        if (celebrationLayer) {

            celebrationLayer.classList.add(
                "active"
            );

        }


        createMegaBurst();

        createBalloonBurst();

        createPopperBurst();

        createFirework();


        const startTime =
            Date.now();


        const duration =
            10000;


        const timer =
            setInterval(
                function () {

                    const elapsed =
                        Date.now() -
                        startTime;


                    if (
                        elapsed >=
                        duration
                    ) {

                        clearInterval(
                            timer
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
                    Math.random() -
                    0.5
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


        playSound(
            balloonSound,
            0.18
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


        playSound(
            popperSound,
            0.20
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
                    Math.random() -
                    0.5
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


        playSound(
            crackleSound,
            0.16
        );


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
                Math.random() * 170;


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


        /*
           Make sure celebration BGM
           has finished before normal BGM.
        */

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

                uiClickSound();


                window.location.href =
                    "page3.html";

            }
        );

    }

});
