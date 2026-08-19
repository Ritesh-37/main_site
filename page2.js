document.addEventListener("DOMContentLoaded", function () {

    /* =========================================================
       HELPER
    ========================================================= */

    function get(id) {
        return document.getElementById(id);
    }


    /* =========================================================
       AUDIO ENGINE
       ========================================================= */

    const music = get("birthday-music");
    const musicButton = get("music-button");

    const candleSound = get("candle-sound");
    const balloonSound = get("balloon-pop-sound");
    const popperSound = get("popper-sound");
    const crackleSound = get("crackle-sound");


    /*
       IMPORTANT:

       birthday-music = your normal cute BGM.

       The 10-second birthday celebration music is generated
       by the browser using Web Audio.

       Therefore you don't need another audio file.
    */


    let musicStarted = false;
    let musicMuted = false;

    let audioContext = null;
    let birthdayCelebrationPlaying = false;

    let celebrationMusicTimer = null;


    /* =========================================================
       NORMAL BGM
    ========================================================= */

    function startNormalMusic() {

        if (!music || musicMuted) {
            return;
        }

        if (birthdayCelebrationPlaying) {
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

                    /*
                       Browser blocked autoplay.

                       We will try again on the next user
                       interaction.
                    */

                    musicStarted = false;

                    if (musicButton) {
                        musicButton.textContent = "🔇";
                    }

                });
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
            function () {

                if (!music) {
                    return;
                }


                if (!music.paused) {

                    music.pause();

                    musicMuted = true;

                    musicButton.textContent = "🔇";

                } else {

                    musicMuted = false;

                    if (!birthdayCelebrationPlaying) {

                        music.play()
                            .then(function () {

                                musicStarted = true;

                                musicButton.textContent = "♫";

                            })
                            .catch(function () {});

                    }

                }

            }
        );

    }


    /* =========================================================
       AUTOPLAY ATTEMPT
       ========================================================= */

    /*
       Try immediately when Page 2 loads.
    */

    startNormalMusic();


    /*
       Android/Chrome may block autoplay.

       Any first interaction will unlock the music.
    */

    function unlockMusic() {

        if (!musicStarted && !musicMuted) {
            startNormalMusic();
        }

        /*
           Also unlock Web Audio.
        */

        initAudioContext();

    }


    document.addEventListener(
        "touchstart",
        unlockMusic,
        {
            once: true,
            passive: true
        }
    );


    document.addEventListener(
        "click",
        unlockMusic,
        {
            once: true
        }
    );


    /* =========================================================
       WEB AUDIO ENGINE
    ========================================================= */

    function initAudioContext() {

        if (!audioContext) {

            try {

                audioContext =
                    new (
                        window.AudioContext ||
                        window.webkitAudioContext
                    )();

            } catch (error) {

                console.log(
                    "Web Audio unavailable"
                );

                return;
            }
        }


        if (
            audioContext.state ===
            "suspended"
        ) {

            audioContext.resume()
                .catch(function () {});

        }

    }


    /* =========================================================
       CLEAN SOUND EFFECT
    ========================================================= */

    function playSound(audio, volume) {

        if (!audio) {
            return;
        }


        /*
           Never allow a sound effect to restart
           excessively quickly.
        */

        try {

            audio.pause();

            audio.currentTime = 0;

            audio.volume =
                volume !== undefined
                    ? volume
                    : 0.35;

            const promise =
                audio.play();

            if (promise) {
                promise.catch(function () {});
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

        initAudioContext();

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
            650,
            now
        );

        oscillator.frequency.exponentialRampToValueAtTime(
            900,
            now + 0.07
        );


        gain.gain.setValueAtTime(
            0.0001,
            now
        );

        gain.gain.exponentialRampToValueAtTime(
            0.07,
            now + 0.01
        );

        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            now + 0.08
        );


        oscillator.connect(gain);

        gain.connect(
            audioContext.destination
        );


        oscillator.start(now);

        oscillator.stop(
            now + 0.09
        );

    }


    /* =========================================================
       10 SECOND BIRTHDAY MUSIC
    ========================================================= */

    function startBirthdayCelebrationMusic() {

        if (birthdayCelebrationPlaying) {
            return;
        }


        birthdayCelebrationPlaying = true;


        /*
           Stop normal BGM FIRST.

           This is extremely important because it prevents
           two music tracks from playing together.
        */

        stopNormalMusic();


        initAudioContext();


        if (!audioContext) {
            return;
        }


        /*
           Happy birthday melody.

           Notes are deliberately soft and simple.
        */

        const melody = [
            [261.63, 0.35],
            [261.63, 0.35],
            [293.66, 0.70],

            [261.63, 0.70],
            [349.23, 0.70],
            [329.63, 1.00],

            [261.63, 0.35],
            [261.63, 0.35],
            [293.66, 0.70],

            [261.63, 0.70],
            [392.00, 0.70],
            [349.23, 1.00]
        ];


        const startTime =
            audioContext.currentTime + 0.05;


        let currentTime =
            startTime;


        melody.forEach(function (note) {

            const frequency =
                note[0];

            const duration =
                note[1];


            const oscillator =
                audioContext.createOscillator();

            const gain =
                audioContext.createGain();


            oscillator.type =
                "sine";


            oscillator.frequency.setValueAtTime(
                frequency,
                currentTime
            );


            gain.gain.setValueAtTime(
                0.0001,
                currentTime
            );


            gain.gain.exponentialRampToValueAtTime(
                0.14,
                currentTime + 0.04
            );


            gain.gain.exponentialRampToValueAtTime(
                0.0001,
                currentTime + duration - 0.04
            );


            oscillator.connect(gain);

            gain.connect(
                audioContext.destination
            );


            oscillator.start(
                currentTime
            );

            oscillator.stop(
                currentTime + duration
            );


            currentTime += duration + 0.03;

        });


        /*
           Soft sparkle chord underneath.
        */

        const chordNotes = [
            261.63,
            329.63,
            392.00
        ];


        chordNotes.forEach(function (frequency) {

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
                startTime
            );


            gain.gain.exponentialRampToValueAtTime(
                0.025,
                startTime + 0.5
            );


            gain.gain.exponentialRampToValueAtTime(
                0.0001,
                startTime + 9.5
            );


            oscillator.connect(gain);

            gain.connect(
                audioContext.destination
            );


            oscillator.start(
                startTime
            );

            oscillator.stop(
                startTime + 9.7
            );

        });


        /*
           EXACTLY 10 SECONDS.
        */

        celebrationMusicTimer =
            setTimeout(function () {

                stopBirthdayCelebrationMusic();

            }, 10000);

    }


    /* =========================================================
       STOP 10 SECOND BIRTHDAY MUSIC
    ========================================================= */

    function stopBirthdayCelebrationMusic() {

        if (!birthdayCelebrationPlaying) {
            return;
        }


        birthdayCelebrationPlaying =
            false;


        if (celebrationMusicTimer) {

            clearTimeout(
                celebrationMusicTimer
            );

            celebrationMusicTimer =
                null;

        }


        /*
           Resume original BGM.
        */

        if (!musicMuted) {

            setTimeout(function () {

                startNormalMusic();

            }, 100);

        }

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

                uiClickSound();

                showSection(
                    "cake-section"
                );


                /*
                   If autoplay was blocked,
                   this click unlocks the BGM.
                */

                musicMuted = false;

                startNormalMusic();

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


    candles.forEach(function (candle) {

        candle.addEventListener(
            "click",
            function () {

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
                   Candle sound only once.
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
                       Start birthday music
                       exactly when the last candle
                       is extinguished.
                    */

                    startBirthdayCelebrationMusic();


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
           Lower volume.
        */

        playSound(
            balloonSound,
            0.20
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
            0.22
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
           Very soft crackle.
        */

        playSound(
            crackleSound,
            0.18
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


        /*
           The 10-second birthday music has already
           finished at this point and the normal BGM
           will resume automatically.
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
