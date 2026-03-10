<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>ผลงานของคุณ - Code Canvas</title>

    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@300;400;500;600;700&display=swap"
        rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Sriracha&display=swap" rel="stylesheet">

    <script src="https://code.iconify.design/3/3.1.1/iconify.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gifshot/0.3.2/gifshot.min.js"></script>
    <style>
        html,
        body {
            width: 100%;
            max-width: 100vw;
            overflow-x: hidden;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            user-select: none;
            -webkit-user-drag: none;
            -webkit-user-drag: none;
        }

        #touch-board {
            touch-action: none;
        }

        body {
            font-family: 'IBM Plex Sans Thai', sans-serif;
            background: linear-gradient(to bottom, #4AC6FF 0%, #8BE1FF 70%, #B4F0FF 100%);
            height: 100vh;
            height: 100dvh;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
        }

        /* =========================================
           Background Elements
        ========================================= */
        .bg-grass {
            position: absolute;
            bottom: -12vh;
            left: 0;
            width: 100%;
            z-index: 0;
        }

        .bg-grass img {
            width: 100%;
            height: auto;
            display: block;
        }

        .cloud-anim {
            position: absolute;
            z-index: 0;
            opacity: 0.6;
            animation: floatCloud linear infinite;
            pointer-events: none;
        }

        .c1 {
            top: 10%;
            width: 80px;
            animation-duration: 40s;
            animation-delay: 0s;
        }

        .c2 {
            top: 25%;
            width: 30px;
            animation-duration: 30s;
            animation-delay: -10s;
            opacity: 0.4;
        }

        .c3 {
            top: 75%;
            width: 800px;
            animation-duration: 50s;
            animation-delay: -25s;
        }

        .c4 {
            top: 20%;
            width: 70px;
            animation-duration: 35s;
            animation-delay: -5s;
        }

        .c5 {
            top: 55%;
            width: 60px;
            animation-duration: 45s;
            animation-delay: -15s;
            opacity: 0.5;
        }

        .c6 {
            top: 85%;
            width: 90px;
            animation-duration: 38s;
            animation-delay: -20s;
        }

        @keyframes floatCloud {
            from {
                transform: translateX(-150px);
            }

            to {
                transform: translateX(120vw);
            }
        }

        .cloud-static {
            position: absolute;
            z-index: 0;
            opacity: 0.7;
            pointer-events: none;
        }

        .cs-left {
            top: 22%;
            left: -18px;
            width: 120px;
        }

        .cs-right {
            top: 5%;
            right: -20px;
            width: 100px;
        }

        .wink-decor {
            position: absolute;
            z-index: 0;
            pointer-events: none;
        }

        .wink-1 {
            top: 5%;
            left: 10%;
            width: 18px;
            animation: winkTwinkle 2.5s infinite ease-in-out;
        }

        .wink-2 {
            top: 15%;
            right: 15%;
            width: 12px;
            animation: winkTwinkle 3.2s infinite ease-in-out 1s;
        }

        .wink-3 {
            bottom: 35%;
            right: 5%;
            width: 18px;
            animation: winkTwinkle 2s infinite ease-in-out 0.5s;
        }

        .wink-4 {
            bottom: 10%;
            left: 8%;
            width: 12px;
            animation: winkTwinkle 2.8s infinite ease-in-out 1.5s;
        }

        @keyframes winkTwinkle {

            0%,
            100% {
                transform: scale(0.8);
                opacity: 0.3;
            }

            50% {
                transform: scale(1.2);
                opacity: 1;
            }
        }

        /* =========================================
           Main Content
        ========================================= */
        .content-wrapper {
            position: relative;
            z-index: 10;
            width: 100%;
            max-width: 450px;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 0 0 1rem 0;
        }

        .header-section {
            text-align: center;
            z-index: 20;
            margin-bottom: 2.2rem
        }

        .main-logo {
            width: 180px;
            margin-bottom: -10px;
        }

        .tagline {
            color: #ffffff;
            font-size: 1rem;
            font-weight: 500;
            letter-spacing: 0.5px;
        }

        /* 1. คอนเทนเนอร์หลัก */
        .board-container {
            position: relative;
            width: min(65vw, 40vh);
            display: flex;
            flex-direction: column;
            align-items: center;
            z-index: 10;
            padding-bottom: 1.5rem;
        }

        /* 2. ส่วนบนของกระดาน (ที่วางภาพ) */
        .board-top-wrapper {
            position: relative;
            width: 100%;
            display: flex;
            justify-content: center;
            z-index: 12;
        }

        /* 3. พื้นหลังกระดานส่วนบน */
        .board-top-bg {
            width: 100%;
            height: auto;
            display: block;
            z-index: 10;
        }

        /* 4. ภาพวาดของผู้เล่น */
        .artwork-img {
            position: absolute;
            width: 55%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 11;
            object-fit: contain;
        }

        /* 5. ชื่อผู้เล่น */
        .player-name {
            position: absolute;
            color: #8c6d53;
            z-index: 40;
            bottom: 8%;
            right: 12%;
            pointer-events: none;
            white-space: nowrap;
            transform: rotate(-1.5deg);
        }

        /* 6. ส่วนล่างของกระดาน (ขาตั้ง) */
        .board-bottom-bg {
            width: 75%;
            height: auto;
            display: block;
            /* ✅ ปรับ margin-top เป็นค่าติดลบเพื่อให้ขาตั้งสอดเข้าไปใต้กระดานพอดีแนบสนิท */
            /* หากขาตั้งยังดูเกยมากไปหรือน้อยไป สามารถปรับตัวเลข -5% ตรงนี้ได้ครับ */
            margin-top: 0;
            z-index: 11;
        }

        /* =========================================
           UI Elements
        ========================================= */
        .note-bubble {
            position: absolute;
            background: #fff;
            padding: 8px 15px;
            border-radius: 10px;
            font-size: 0.9rem;
            font-weight: 600;
            color: #333;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            top: -5%;
            right: 0;
            z-index: 15;
            white-space: nowrap;
            transform-origin: bottom center;
            animation: chatPop 6s infinite;
        }

        .note-bubble::after {
            content: '';
            position: absolute;
            bottom: -8px;
            left: 20px;
            border-width: 10px 10px 0;
            border-style: solid;
            border-color: #fff transparent transparent transparent;
        }

        @keyframes chatPop {
            0% {
                transform: scale(0);
                opacity: 0;
            }

            10% {
                transform: scale(1.1);
                opacity: 1;
            }

            15% {
                transform: scale(1);
                opacity: 1;
            }

            80% {
                transform: scale(1);
                opacity: 1;
            }

            85% {
                transform: scale(1.1);
                opacity: 1;
            }

            95% {
                transform: scale(0);
                opacity: 0;
            }

            100% {
                transform: scale(0);
                opacity: 0;
            }
        }

        .sticky-note {
            position: absolute;
            width: 100px;
            height: 100px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-family: 'Caveat', cursive;
            font-size: 1rem;
            text-align: center;
            color: #8c6d53;
            z-index: 13;
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            padding-bottom: 0;
            white-space: nowrap !important;
            word-break: keep-all !important;
            overflow: visible;
        }

        .sticky-note span {
            font-size: 1rem;
            opacity: 0.8;
            white-space: nowrap !important;
            word-break: keep-all !important;
        }

        .note-blue {
            background-image: url("{{ asset('img/elements-frontend/posit-blue.png') }}");
            top: 5%;
            left: -10%;
            transform: rotate(-8deg);
        }

        .note-orange {
            background-image: url("{{ asset('img/elements-frontend/posit-orange.png') }}");
            top: 12%;
            right: -12%;
            transform: rotate(5deg);
        }

        .note-pink {
            background-image: url("{{ asset('img/elements-frontend/posit-pink.png') }}");
            bottom: -20%;
            left: 6%;
            transform: rotate(5deg);
        }

        /* =========================================
           Action Overlays
        ========================================= */
        .action-overlay {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(2px);
            color: white;
            padding: 20px;
            border-radius: 15px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 10px;
            z-index: 9999;
            opacity: 0;
            visibility: hidden;
            transition: 0.3s ease;
            width: 85%;
            max-width: 350px;
            text-align: center;
        }

        .action-overlay.active {
            opacity: 1;
            visibility: visible;
        }

        .action-overlay .iconify {
            font-size: 2.5rem;
        }

        .action-overlay p {
            font-size: 1.1rem;
            font-weight: 500;
            margin: 0;
        }

        .btn-save {
            background: #fff;
            color: #333;
            border: none;
            padding: 12px 15px;
            border-radius: 10px;
            font-family: 'IBM Plex Sans Thai', sans-serif;
            font-size: 1rem;
            font-weight: 600;
            width: 100%;
            cursor: pointer;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            margin-bottom: 5px;
            transition: transform 0.1s;
        }

        .btn-save:active {
            transform: scale(0.95);
        }

        .footer-logos {
            position: absolute;
            bottom: 2rem;
            width: 100%;
            display: flex;
            justify-content: center;
            gap: 20px;
            z-index: 20;
        }

        .footer-logos img {
            height: 25px;
            object-fit: contain;
        }
    </style>
</head>

<body id="capture-area">

    <img src="{{ asset('img/elements-frontend/cloud-dark.png') }}" class="cloud-static cs-left" alt="Static Cloud">
    <img src="{{ asset('img/elements-frontend/cloud-light.png') }}" class="cloud-static cs-right" alt="Static Cloud">

    <img src="{{ asset('img/elements-frontend/cloud-dark.png') }}" class="cloud-anim c1" alt="Cloud">
    <img src="{{ asset('img/elements-frontend/cloud-light.png') }}" class="cloud-anim c2" alt="Cloud">
    <img src="{{ asset('img/elements-frontend/cloud-medium.png') }}" class="cloud-anim c3" alt="Cloud">
    <img src="{{ asset('img/elements-frontend/cloud-white.png') }}" class="cloud-anim c4" alt="Cloud">
    <img src="{{ asset('img/elements-frontend/cloud-light.png') }}" class="cloud-anim c5" alt="Cloud">
    <img src="{{ asset('img/elements-frontend/cloud-medium.png') }}" class="cloud-anim c6" alt="Cloud">

    <div class="bg-grass"><img src="{{ asset('img/elements-frontend/grass-mobile.png') }}" alt="Grass"></div>

    <img src="{{ asset('img/elements-frontend/wink-white.png') }}" class="wink-decor wink-1" alt="Star">
    <img src="{{ asset('img/elements-frontend/wink-white.png') }}" class="wink-decor wink-2" alt="Star">
    <img src="{{ asset('img/elements-frontend/wink-white.png') }}" class="wink-decor wink-3" alt="Star">
    <img src="{{ asset('img/elements-frontend/wink-white.png') }}" class="wink-decor wink-4" alt="Star">

    <div class="content-wrapper">
        <div class="header-section">
            <img src="{{ asset('img/elements-frontend/logo-01.png') }}" alt="Code Canvas" class="main-logo">
            <p class="tagline">Turn Code into Art</p>
        </div>

        <div class="board-container" id="touch-board">

            <div class="note-bubble" id="timeDisplay">Wowww Finished in 0m 0s!</div>

            <div class="sticky-note note-blue">
                <div style="width: 125px;">forward()</div><br><span id="countF">0 times</span>
            </div>
            <div class="sticky-note note-orange">
                <div style="width: 125px;">moveLeft()</div><br><span id="countL">0 times</span>
            </div>

            <div class="board-top-wrapper">
                <img src="{{ asset('img/elements-frontend/board-top-mobile.png') }}" class="board-top-bg"
                    alt="Easel Top">

                <img src="{{ asset('img/result-image/' . $imageName) }}" class="artwork-img" alt="Artwork">

                <div class="player-name" id="playerNameDisplay"></div>

                <div class="sticky-note note-pink">
                    <div style="width: 125px;">moveRight()</div><br><span id="countR">0 times</span>
                </div>
            </div>

            <img src="{{ asset('img/elements-frontend/board-bottom-mobile.png') }}" class="board-bottom-bg"
                alt="Easel Bottom">

            <div id="overlay-hold" class="action-overlay active" style="top: 40%;"> <span class="iconify"
                    data-icon="tabler:hand-click" style="transform: rotate(-15deg);"></span>
                <p>Hold to save</p>
            </div>

            <div id="overlay-menu" class="action-overlay" style="background: rgba(0, 0, 0, 0.8);">
                <p style="margin-bottom: 15px; font-size: 1.2rem;">เลือกรูปแบบที่ต้องการ</p>
                <button class="btn-save" id="btn-dl-art">บันทึกเฉพาะภาพวาด</button>
                <button class="btn-save" id="btn-dl-frame">บันทึกทั้งหน้าจอ</button>
                <button class="btn-save" id="btn-dl-cancel"
                    style="background: #ff4d4d; color: #fff; margin-top: 5px;">ยกเลิก</button>
            </div>

            <div id="overlay-saved" class="action-overlay" style="background: rgba(0, 0, 0, 0.8);">
                <span class="iconify" data-icon="material-symbols:check-circle-rounded"
                    style="color: #4AC6FF;"></span>
                <p>Downloaded to your device!</p>
            </div>
        </div>
    </div>

    <div class="footer-logos">
        <img src="{{ asset('img/elements-frontend/logo-func.png') }}" alt="FUNC">
        <img src="{{ asset('img/elements-frontend/logo-ict.png') }}" alt="ICT">
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            // document.addEventListener('contextmenu', event => event.preventDefault());

            const urlParams = new URLSearchParams(window.location.search);
            const fCount = urlParams.get('f') || '0';
            const lCount = urlParams.get('l') || '0';
            const rCount = urlParams.get('r') || '0';
            const timeRaw = urlParams.get('t') || '0.0';

            // รับค่าชื่อจาก URL
            const pName = urlParams.get('n') || '';

            document.getElementById('countF').innerText = `${fCount} times`;
            document.getElementById('countL').innerText = `${lCount} times`;
            document.getElementById('countR').innerText = `${rCount} times`;

            let [mins, secs] = timeRaw.split('.');
            if (!secs) secs = '0';

            let timeString = '';
            if (mins === '0' || mins === '') {
                timeString = `${secs}s`;
            } else {
                timeString = `${mins}m ${secs}s`;
            }
            document.getElementById('timeDisplay').innerText = `Wowww Finished in ${timeString}!`;

            // ✅ แสดงชื่อผู้เล่น (พร้อมตรวจสอบภาษาและเปลี่ยนฟอนต์)
            const nameEl = document.getElementById('playerNameDisplay');
            if (pName) {
                nameEl.innerText = `${pName}`;
                nameEl.style.display = 'block';

                // เช็คว่าในข้อความมีตัวอักษรภาษาไทยหรือไม่ (ใช้ Regex ช่วงก-๙)
                const isThai = /[\u0E00-\u0E7F]/.test(pName);

                if (isThai) {
                    nameEl.style.fontFamily = "'Sriracha', cursive";
                    nameEl.style.fontSize = "1rem"; // ขนาดฟอนต์สำหรับภาษาไทย
                } else {
                    nameEl.style.fontFamily = "'Caveat', cursive";
                    nameEl.style.fontSize = "1.1rem"; // ขนาดฟอนต์สำหรับภาษาอังกฤษ
                }
            } else {
                nameEl.style.display = 'none';
            }

            const board = document.getElementById('touch-board');
            const overlayHold = document.getElementById('overlay-hold');
            const overlayMenu = document.getElementById('overlay-menu');
            const overlaySaved = document.getElementById('overlay-saved');
            let pressTimer;

            board.addEventListener('click', () => {
                if (overlayHold.classList.contains('active')) {
                    overlayHold.classList.remove('active');
                }
            });

            board.addEventListener('touchstart', (e) => {
                if (overlayHold.classList.contains('active')) {
                    overlayHold.classList.remove('active');
                }
                pressTimer = setTimeout(() => {
                    overlayMenu.classList.add('active');
                }, 800);
            }, {
                passive: true
            });

            board.addEventListener('touchend', clearTimer);
            board.addEventListener('touchmove', clearTimer);

            function clearTimer() {
                clearTimeout(pressTimer);
            }

            function showSaved() {
                overlaySaved.classList.add('active');
                setTimeout(() => {
                    overlaySaved.classList.remove('active');
                }, 3000);
            }

            // ==========================================
            // ปุ่มดาวน์โหลดต่างๆ
            // ==========================================

            // [ยกเลิก]
            document.getElementById('btn-dl-cancel').addEventListener('click', () => {
                overlayMenu.classList.remove('active');
            });

            // [ปุ่ม 1: โหลดเฉพาะภาพวาด]
            document.getElementById('btn-dl-art').addEventListener('click', () => {
                overlayMenu.classList.remove('active');
                const link = document.createElement('a');
                link.href = "{{ asset('img/result-image/' . $imageName) }}";
                link.download = "My-Artwork.png";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                showSaved();
            });

            // [ปุ่ม 2: โหลดภาพนิ่ง]
            document.getElementById('btn-dl-frame').addEventListener('click', () => {
                overlayMenu.classList.remove('active');

                setTimeout(() => {
                    const target = document.getElementById('capture-area');
                    const cBubble = document.querySelector('.note-bubble');

                    if (cBubble) {
                        cBubble.style.animation = 'none';
                        cBubble.style.transform = 'scale(1)';
                        cBubble.style.opacity = '1';
                    }

                    // หยุดแอนิเมชันแค่ตอนทำภาพนิ่ง
                    document.querySelectorAll('.wink-1, .wink-2, .wink-3, .wink-4, .cloud-anim')
                        .forEach(el => {
                            el.style.animation = 'none';
                        });

                    const exactWidth = Math.round(target.offsetWidth);
                    const exactHeight = Math.round(target.offsetHeight);

                    html2canvas(target, {
                        useCORS: true,
                        backgroundColor: '#4AC6FF',
                        scale: 2,
                        width: exactWidth,
                        height: exactHeight,
                        ignoreElements: (element) => {
                            return element.classList.contains('action-overlay');
                        }
                    }).then(canvas => {
                        const link = document.createElement('a');
                        link.href = canvas.toDataURL("image/png");
                        link.download = "Your-Masterpiece-CodeCanvas.png";
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);

                        if (cBubble) cBubble.style.animation = 'chatPop 6s infinite';
                        document.querySelectorAll('.wink-1').forEach(el => el.style
                            .animation = 'winkTwinkle 2.5s infinite ease-in-out');
                        document.querySelectorAll('.wink-2').forEach(el => el.style
                            .animation = 'winkTwinkle 3.2s infinite ease-in-out 1s');
                        document.querySelectorAll('.wink-3').forEach(el => el.style
                            .animation = 'winkTwinkle 2s infinite ease-in-out 0.5s');
                        document.querySelectorAll('.wink-4').forEach(el => el.style
                            .animation = 'winkTwinkle 2.8s infinite ease-in-out 1.5s');
                        document.querySelectorAll('.cloud-anim').forEach(el => el.style
                            .animation = 'floatCloud linear infinite');

                        showSaved();
                    });
                }, 300);
            });
        });
    </script>
</body>

</html>
