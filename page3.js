document.addEventListener("DOMContentLoaded", function () {

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
       Android-friendly Web Audio
    ====================================================== */

    let audioContext = null;

    let masterGain = null;
    let musicGain = null;
    let effectGain = null;

    let audioUnlocked = false;
    let musicPlaying = false;
    let musicMuted = false;

    let musicTimer = null;
    let musicStep = 0;

    const musicButton = get("music-button");


    function initAudio() {

        if (!audioContext) {

            try {

                audioContext = new (
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


            masterGain.gain.value = 0.82;

            musicGain.gain.value = 0.18;

            effectGain.gain.value = 0.45;


            musicGain.connect(masterGain);

            effectGain.connect(masterGain);

            masterGain.connect(
                audioContext.destination
            );
        }


        audioUnlocked = true;

        return true;
    }


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


        audioUnlocked = true;


        if (!musicMuted) {
            startJazz();
        }
    }


    document.addEventListener(
        "click",
        unlockAudio,
        { once: true }
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
       GENERIC TONE
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
            start + duration + 0.05
        );
    }


    /* =====================================================
       AUDIO DUCKING
    ====================================================== */

    function duckMusic(amount, duration) {

        if (!musicGain || !audioContext) {
            return;
        }


        const now =
            audioContext.currentTime;


        musicGain.gain.cancelScheduledValues(
            now
        );


        musicGain.gain.setValueAtTime(
            musicGain.gain.value,
            now
        );


        musicGain.gain.linearRampToValueAtTime(
            amount,
            now + 0.08
        );


        setTimeout(function () {

            if (!musicGain) {
                return;
            }


            const current =
                audioContext.currentTime;


            musicGain.gain.cancelScheduledValues(
                current
            );


            musicGain.gain.linearRampToValueAtTime(
                musicMuted ? 0 : 0.18,
                current + 0.35
            );

        }, duration);
    }


    /* =====================================================
       SOFT BUTTON SOUND
    ====================================================== */

    function buttonSound() {

        tone(
            520,
            0.07,
            0.025,
            "sine"
        );

        tone(
            760,
            0.08,
            0.018,
            "sine",
            effectGain,
            0.04
        );
    }


    /* =====================================================
       ROMANTIC JAZZ BGM
    ====================================================== */

    function startJazz() {

        if (
            musicPlaying ||
            musicMuted
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


        playJazzLoop();
    }


    function playJazzLoop() {

        if (
            !musicPlaying ||
            musicMuted
        ) {
            return;
        }


        /*
           Soft romantic jazz progression.

           Cmaj7 → Am7 → Dm7 → G7
        */

        const melody = [

            261.63,
            329.63,
            392.00,
            493.88,

            440.00,
            523.25,
            659.25,
            523.25,

            293.66,
            349.23,
            440.00,
            523.25,

            392.00,
            493.88,
            587.33,
            493.88

        ];


        const note =
            melody[musicStep];


        /*
           Main piano-like melody.
        */

        tone(
            note,
            0.65,
            0.018,
            "triangle",
            musicGain
        );


        /*
           Warm bass.
        */

        if (
            musicStep % 4 === 0
        ) {

            tone(
                note / 2,
                0.85,
                0.010,
                "sine",
                musicGain
            );
        }


        /*
           Soft jazz chord shimmer.
        */

        if (
            musicStep % 4 === 2
        ) {

            tone(
                note * 1.5,
                0.45,
                0.007,
                "sine",
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
                playJazzLoop,
                560
            );
    }


    function stopJazz() {

        musicPlaying = false;


        if (musicTimer) {

            clearTimeout(
                musicTimer
            );

            musicTimer = null;
        }


        if (musicGain && audioContext) {

            musicGain.gain.cancelScheduledValues(
                audioContext.currentTime
            );

            musicGain.gain.linearRampToValueAtTime(
                0,
                audioContext.currentTime + 0.25
            );
        }


        if (musicButton) {
            musicButton.textContent = "🔇";
        }
    }


    /* =====================================================
       MUSIC BUTTON
    ====================================================== */

    if (musicButton) {

        musicButton.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

                initAudio();


                if (musicMuted) {

                    musicMuted = false;

                    if (musicGain) {
                        musicGain.gain.value = 0.18;
                    }

                    startJazz();

                } else {

                    musicMuted = true;

                    stopJazz();
                }
            }
        );
    }


    /* =====================================================
       COUNTDOWN TICK
    ====================================================== */

    function countdownTick(number) {

        duckMusic(
            0.07,
            600
        );


        const frequencies = {
            3: 440,
            2: 523.25,
            1: 659.25
        };


        tone(
            frequencies[number] || 440,
            0.16,
            0.055,
            "triangle"
        );


        tone(
            frequencies[number] * 2,
            0.12,
            0.018,
            "sine",
            effectGain,
            0.04
        );
    }


    /* =====================================================
       FINAL COUNTDOWN CHIME
    ====================================================== */

    function finalCountdownChime() {

        duckMusic(
            0.05,
            700
        );


        tone(
            523.25,
            0.28,
            0.055,
            "sine"
        );


        tone(
            659.25,
            0.34,
            0.050,
            "sine",
            effectGain,
            0.08
        );


        tone(
            783.99,
            0.50,
            0.045,
            "triangle",
            effectGain,
            0.16
        );
    }


    /* =====================================================
       CAMERA SHUTTER
       ====================================================== */

    function cameraShutter() {

        duckMusic(
            0.035,
            900
        );


        if (!audioContext) {
            return;
        }


        const now =
            audioContext.currentTime;


        /*
           First mechanical click.
        */

        tone(
            900,
            0.045,
            0.075,
            "square",
            effectGain
        );


        tone(
            1450,
            0.055,
            0.055,
            "square",
            effectGain,
            0.055
        );


        /*
           Camera body snap.
        */

        tone(
            220,
            0.12,
            0.065,
            "triangle",
            effectGain,
            0.10
        );


        /*
           Tiny flash sparkle.
        */

        tone(
            1800,
            0.10,
            0.025,
            "sine",
            effectGain,
            0.04
        );
    }


    /* =====================================================
       BOUQUET SHIMMER
    ====================================================== */

    function bouquetShimmer() {

        duckMusic(
            0.08,
            1200
        );


        const notes = [
            783.99,
            987.77,
            1174.66,
            1567.98
        ];


        notes.forEach(
            function (note, index) {

                tone(
                    note,
                    0.65,
                    0.035,
                    "sine",
                    effectGain,
                    index * 0.10
                );
            }
        );


        tone(
            1318.51,
            0.90,
            0.018,
            "triangle",
            effectGain,
            0.30
        );
    }


    /* =====================================================
       ENVELOPE PAPER SOUND
    ====================================================== */

    function envelopeOpenSound() {

        duckMusic(
            0.07,
            1400
        );


        /*
           Soft paper-like noise.
        */

        if (audioContext) {

            const buffer =
                audioContext.createBuffer(
                    1,
                    audioContext.sampleRate * 0.32,
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
                    (
                        1 - i / data.length
                    ) *
                    0.16;
            }


            const source =
                audioContext.createBufferSource();


            const filter =
                audioContext.createBiquadFilter();


            const gain =
                audioContext.createGain();


            source.buffer = buffer;

            filter.type = "bandpass";

            filter.frequency.value = 2200;

            filter.Q.value = 0.7;

            gain.gain.value = 0.18;


            source.connect(filter);

            filter.connect(gain);

            gain.connect(effectGain);


            source.start();
        }


        /*
           Soft opening chime.
        */

        tone(
            659.25,
            0.40,
            0.035,
            "sine",
            effectGain,
            0.25
        );


        tone(
            987.77,
            0.55,
            0.028,
            "sine",
            effectGain,
            0.35
        );
    }


    /* =====================================================
       POSTCARD REVEAL
    ====================================================== */

    function postcardRevealSound() {

        tone(
            783.99,
            0.30,
            0.035,
            "sine"
        );


        tone(
            1046.50,
            0.55,
            0.025,
            "triangle",
            effectGain,
            0.12
        );
    }


    /* =====================================================
       WINE SOUND
    ====================================================== */

    const wineSound =
        get("wine-sound");

    const glassSound =
        get("glass-sound");


    function playAudioElement(
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


    function playWineSound() {

        duckMusic(
            0.12,
            900
        );


        playAudioElement(
            wineSound,
            0.55
        );
    }


    function playGlassSound() {

        duckMusic(
            0.06,
            900
        );


        playAudioElement(
            glassSound,
            0.65
        );


        tone(
            1046.50,
            0.25,
            0.025,
            "sine",
            effectGain,
            0.05
        );
    }


    /* =====================================================
       DRUNK ENDING AUDIO
    ====================================================== */

    function drunkSound() {

        duckMusic(
            0.025,
            4500
        );


        tone(
            392,
            0.55,
            0.045,
            "sine"
        );


        tone(
            349.23,
            0.65,
            0.040,
            "sine",
            effectGain,
            0.12
        );


        tone(
            293.66,
            0.80,
            0.035,
            "triangle",
            effectGain,
            0.24
        );


        tone(
            261.63,
            1.00,
            0.025,
            "sine",
            effectGain,
            0.38
        );
    }


    /* =====================================================
       INTRO
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

                    buttonSound();


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

                buttonSound();

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


            countdownTick(
                Number(numbers[index])
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

                finalCountdownChime();


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


        /*
           Show photo slightly after
           flash begins.
        */

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

                buttonSound();


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

                unlockAudio();


                if (bouquetClicked) {
                    return;
                }


                bouquetClicked = true;


                bouquet.classList.add(
                    "glowing"
                );


                bouquetShimmer();


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
            "♥",
            "💫"
        ];


        for (
            let i = 0;
            i < 30;
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
                    Math.random() * 18
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
                    Math.random() - 0.5
                ) *
                220;


            const y =
                -(
                    40 +
                    Math.random() * 160
                );


            sparkle.animate(
                [
                    {
                        transform:
                            "translate(0,0) scale(.2)",
                        opacity: 0
                    },
                    {
                        transform:
                            "translate(0,0) scale(1.15)",
                        opacity: 1
                    },
                    {
                        transform:
                            "translate(" +
                            x +
                            "px," +
                            y +
                            "px) scale(.1)",
                        opacity: 0
                    }
                ],
                {
                    duration:
                        1100 +
                        Math.random() * 800,

                    easing:
                        "ease-out"
                }
            );


            setTimeout(
                function () {

                    sparkle.remove();

                },
                2100
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


                envelopeOpenSound();


                envelopeText.textContent =
                    "Open it... it's just for you. ❤️";


                setTimeout(
                    function () {

                        postcard.classList.add(
                            "show"
                        );


                        postcardRevealSound();

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

                buttonSound();


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


                playWineSound();


                /*
                   Gradual bottle movement.
                */

                bottle.animate(
                    [
                        {
                            transform:
                                "rotate(0deg)"
                        },
                        {
                            transform:
                                "rotate(-10deg) translateY(-3px)"
                        },
                        {
                            transform:
                                "rotate(0deg)"
                        }
                    ],
                    {
                        duration: 700,
                        easing: "ease-in-out"
                    }
                );


                /*
                   Bottle level.
                */

                const bottleLevel =
                    100 -
                    (
                        pourCount *
                        20
                    );


                bottleLiquid.style.height =
                    bottleLevel + "%";


                /*
                   Gradual glass filling.
                */

                const glassLevel =
                    pourCount * 20;


                glassWine.forEach(
                    function (wine) {

                        const currentHeight =
                            parseFloat(
                                wine.style.height
                            ) || 0;


                        wine.animate(
                            [
                                {
                                    height:
                                        currentHeight +
                                        "%"
                                },
                                {
                                    height:
                                        glassLevel +
                                        "%"
                                }
                            ],
                            {
                                duration: 650,
                                fill: "forwards",
                                easing: "ease-out"
                            }
                        );

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

                        buttonSound();

                        return;
                    }


                    playGlassSound();


                    /*
                       Tiny toast animation.
                    */

                    glasses.forEach(
                        function (item) {

                            item.animate(
                                [
                                    {
                                        transform:
                                            "translateY(0) rotate(0deg)"
                                    },
                                    {
                                        transform:
                                            "translateY(-8px) rotate(-4deg)"
                                    },
                                    {
                                        transform:
                                            "translateY(0) rotate(0deg)"
                                    }
                                ],
                                {
                                    duration: 450,
                                    easing: "ease-out"
                                }
                            );
                        }
                    );


                    /*
                       Empty both glasses.
                    */

                    glassWine.forEach(
                        function (wine) {

                            wine.animate(
                                [
                                    {
                                        height:
                                            wine.style.height
                                    },
                                    {
                                        height:
                                            "0%"
                                    }
                                ],
                                {
                                    duration: 450,
                                    fill: "forwards",
                                    easing: "ease-in"
                                }
                            );


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

        drunkSound();


        const overlay =
            get("drunk-overlay");


        if (overlay) {

            overlay.classList.add(
                "active"
            );
        }


        /*
           Progressive sway.
        */

        document.body.animate(
            [
                {
                    transform:
                        "rotate(0deg) scale(1)"
                },
                {
                    transform:
                        "rotate(-0.5deg) scale(1.01)"
                },
                {
                    transform:
                        "rotate(0.7deg) scale(1.025)"
                },
                {
                    transform:
                        "rotate(-1deg) scale(1.045)"
                },
                {
                    transform:
                        "rotate(1.2deg) scale(1.07)"
                },
                {
                    transform:
                        "rotate(-1.4deg) scale(1.09)"
                },
                {
                    transform:
                        "rotate(1deg) scale(1.10)"
                },
                {
                    transform:
                        "rotate(0deg) scale(1.10)"
                }
            ],
            {
                duration: 5000,
                easing: "ease-in-out",
                fill: "forwards"
            }
        );


        /*
           Show popup after dizziness
           builds.
        */

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

                buttonSound();


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
       INITIAL STATE
    ====================================================== */

    if (musicButton) {
        musicButton.textContent = "♫";
    }

});
