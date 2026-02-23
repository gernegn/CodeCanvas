<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>Code Canvas</title>
    <link rel="icon" type="image/png" href="img/elements-frontend/logo-favicon.svg" />
    {{-- เชื่อม css --}}
    <link href="{{ asset('css/custom.css') }}" rel="stylesheet">

    <!-- Iconify CDN -->
    <script src="https://code.iconify.design/3/3.1.1/iconify.min.js"></script>

    <!-- IBM Font -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
        href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@100;200;300;400;500;600;700&display=swap"
        rel="stylesheet" />

    <!-- Keyboard -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/simple-keyboard@latest/build/css/index.css">
</head>

<body>
    <div class="container">
        <div class="bg-grass">
            <img src="{{ asset('img/elements-frontend/grass-01.png') }}" alt="Grass01" />
        </div>
        <!-- end bg-grass -->

        <div class="bg-cloud">
            <img src="{{ asset('img/elements-frontend/cloud-01.png') }}" alt="Cloud01" />
        </div>
        <!-- end bg-cloud -->

        <div class="sec-head">
            <div class="btn-box">
                <button class="bt-back" id="btnBackToResult">
                    <span class="iconify" data-icon="material-symbols:arrow-back-ios-rounded"></span>
                </button>
            </div>

            <h1>ตกแต่งภาพวาดของคุณ</h1>

            <a href="{{ route('game.home') }}">
                <img src="{{ asset('img/elements-frontend/logo-01.png') }}" alt="logo01" />
            </a>
        </div>
        <!-- end sec-head -->

        <div class="sec-content">
            <div class="sec-content-left">
                <div class="canvas">
                    <img src="{{ asset('img/elements-frontend/wink-yellow-02.png') }}" class="wink-yellow-01"
                        alt="Wink">
                    <div class="frame-result-radius">
                        <img id="customResultImg" src="" class="box-result-img" alt="Result Image">
                    </div>
                    <img src="{{ asset('img/elements-frontend/wink-yellow-02.png') }}" class="wink-yellow-02"
                        alt="Wink">
                </div>
                <!-- end canvas -->
            </div>
            <!-- end sec-content-left -->

            <div class="sec-content-right">
                <div class="box-custom">
                    {{-- 1. ส่วนกรอกชื่อ --}}
                    <div class="custom-name">
                        <div class="topic-name">
                            <span class="iconify" data-icon="material-symbols:draw"></span>
                            <p>addName()</p>
                        </div>
                        <input type="text" id="userNameInput" placeholder="Add name here" readonly>
                    </div>

                    {{-- 2. ส่วนเลือก Color --}}
                    <div class="custom-color">
                        <div class="topic-color">
                            <span class="iconify" data-icon="material-symbols:draw"></span>
                            <p>addColor()</p>
                        </div>
                        <div class="box-color"></div>
                    </div>

                    {{-- 3. ส่วนเลือก Texture --}}
                    <div class="custom-texture">
                        <div class="topic-texture">
                            <span class="iconify" data-icon="material-symbols:draw"></span>
                            <p>addTexture()</p>
                        </div>
                        <div class="box-texture">
                            <div class="box-texture-top">
                                <div class="texture-btn box-texture-none" onclick="selectTexture('none', this)"></div>

                                <div class="texture-btn"
                                    style="background-image: url('{{ asset('img/texture/dot.png') }}');"
                                    onclick="selectTexture('dot', this)">
                                </div>

                                <div class="texture-btn"
                                    style="background-image: url('{{ asset('img/texture/grid.png') }}');"
                                    onclick="selectTexture('grid', this)">
                                </div>
                            </div>

                            <div class="box-texture-bottom">
                                <div class="texture-btn"
                                    style="background-image: url('{{ asset('img/texture/heart.png') }}');"
                                    onclick="selectTexture('heart', this)">
                                </div>

                                <div class="texture-btn"
                                    style="background-image: url('{{ asset('img/texture/line.png') }}');"
                                    onclick="selectTexture('line', this)">
                                </div>

                                <div class="texture-btn"
                                    style="background-image: url('{{ asset('img/texture/star.png') }}');"
                                    onclick="selectTexture('star', this)">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bt-confirm">
                    <button class="confirm" disabled>ยืนยัน</button>
                </div>
            </div>
            <!-- end sec-content-right -->
        </div>
        <!-- end sec-content -->

    </div>
    <!-- end container -->

    <!-- Popup -->
    <div id="customSuccessModal" class="custom-modal-overlay">
        <div class="custom-modal-container">

            <img src="{{ asset('img/elements-frontend/wink-yellow-01.png') }}" class="star-decor-img star-top-left"
                alt="star">
            <img src="{{ asset('img/elements-frontend/wink-yellow-01.png') }}" class="star-decor-img star-top-right"
                alt="star">
            <img src="{{ asset('img/elements-frontend/wink-yellow-01.png') }}" class="star-decor-img star-bottom-left"
                alt="star">

            <div class="modal-header-text">
                <h2>ยินดีด้วย คุณวาดรูป</h2>
                <h1 class="text-success">สำเร็จแล้ว!</h1>
            </div>

            <div class="modal-content-wrapper">

                <div class="result-image-box">
                    <img src="{{ asset('img/result-image/house-yellow-dot.png') }}" alt="Result"
                        id="finalResultImage">
                </div>

                <div class="qr-section">
                    <div class="qr-box">
                        <img id="qrResult"
                            src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ExampleData"
                            alt="QR Code" class="qr-code-img">
                    </div>
                    <div class="qr-text">
                        <p>สแกนเพื่อเก็บ<br>ภาพวาดของคุณ</p>
                    </div>
                </div>

            </div>
        </div>

        <a href="{{ route('game.gallery') }}" class="btn-gallery-green">
            <span class="iconify" data-icon="fluent:draw-image-24-regular"></span>
            คลังภาพวาด
        </a>
    </div>

    {{-- Keyboard --}}
    <div id="keyboardOverlay" class="keyboard-overlay">
        <div class="keyboard-container">
            <div class="keyboard-header">
                <button id="closeKeyboardBtn" class="close-kb-btn">
                    <span class="iconify" data-icon="material-symbols:keyboard-arrow-down-rounded"></span>
                    ปิดแป้นพิมพ์
                </button>
            </div>
            <div class="simple-keyboard"></div>
        </div>
    </div>

    <!-- Script -->
    <script src="{{ asset('js/codeCanvas.js') }}?v={{ time() }}"></script>

    <script src="https://cdn.jsdelivr.net/npm/simple-keyboard@latest/build/index.js"></script>

    <audio id="popupSound">
        <source src="{{ asset('public/audio/popup-sound.mp3') }}" type="audio/mpeg">
    </audio>

    {{-- ✅ เพิ่มแท็กเสียงสำหรับปุ่มในหน้านี้ --}}
    <audio id="buttonSound">
        <source src="{{ asset('public/audio/button-sound.mp3') }}" type="audio/mpeg">
    </audio>

    {{-- ✅ เรียกใช้ไฟล์เสียงที่เราสร้างไว้ --}}
    @include('components.bg-music')

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const Keyboard = window.SimpleKeyboard.default;
            const inputElement = document.getElementById("userNameInput");
            const keyboardOverlay = document.getElementById("keyboardOverlay");
            const closeKeyboardBtn = document.getElementById("closeKeyboardBtn");
            const btnSound = document.getElementById('buttonSound');

            // ตั้งค่าสถานะภาษาปัจจุบัน
            let currentLang = 'th';
            let isShift = false;

            // 1. สร้างคีย์บอร์ดและจัด Layout ใหม่ (ย้าย Enter มาแทน Shift ขวา)
            const myKeyboard = new Keyboard({
                onChange: input => onChange(input),
                onKeyPress: button => onKeyPress(button),
                layoutName: 'th-default',
                layout: {
                    // 🇬🇧 ภาษาอังกฤษ (ปกติ)
                    'en-default': [
                        '` 1 2 3 4 5 6 7 8 9 0 - = {bksp}',
                        'q w e r t y u i o p [ ] \\',
                        'a s d f g h j k l ; \'', // เอา {enter} ออกจากบรรทัดนี้
                        '{shift} z x c v b n m , . / {enter}', // เอา {enter} มาใส่แทน {shift} ขวา
                        '{lang} {space}'
                    ],
                    // 🇬🇧 ภาษาอังกฤษ (พิมพ์ใหญ่/สัญลักษณ์)
                    'en-shift': [
                        '~ ! @ # $ % ^ & * ( ) _ + {bksp}',
                        'Q W E R T Y U I O P { } |',
                        'A S D F G H J K L : "',
                        '{shift} Z X C V B N M < > ? {enter}',
                        '{lang} {space}'
                    ],
                    // 🇹🇭 ภาษาไทย (ปกติ)
                    'th-default': [
                        '_ ๅ / - ภ ถ ุ ค ต จ ข ช ฅ {bksp}',
                        'ๆ ไ ำ พ ะ ั ี ร น ย บ ล ฃ',
                        'ฟ ห ก ด เ ้ า ส ว ง \'',
                        '{shift} ผ ป แ อ ิ ื ท ม ใ ฝ {enter}',
                        '{lang} {space}'
                    ],
                    // 🇹🇭 ภาษาไทย (ปุ่ม Shift)
                    'th-shift': [
                        '% + ๑ ๒ ๓ ๔ ู ฿ ๕ ๖ ๗ ๘ ๙ {bksp}',
                        '๐ " ฎ ฑ ธ ํ ๊ ณ ฯ ญ ฐ , ฅ',
                        'ฤ ฆ ฏ โ ฌ ็ ๋ ษ ศ ซ .',
                        '{shift} ( ) ฉ ฮ ฺ ์ ? ฒ ฬ ฦ {enter}',
                        '{lang} {space}'
                    ]
                },
                display: {
                    '{bksp}': 'ลบ',
                    '{enter}': 'ยืนยัน',
                    '{shift}': 'Shift',
                    '{space}': 'Spacebar (เว้นวรรค)',
                    '{lang}': '🌐 เปลี่ยนภาษา'
                }
            });

            // 2. เมื่อคลิกที่ช่อง input ให้แสดง Keyboard
            inputElement.addEventListener("click", (e) => {
                keyboardOverlay.classList.add("show");
                myKeyboard.setInput(inputElement.value);
            });

            // 3. ปิดแป้นพิมพ์เมื่อกดปุ่ม "ปิดแป้นพิมพ์"
            closeKeyboardBtn.addEventListener("click", () => {
                keyboardOverlay.classList.remove("show");
            });

            // ✅ 4. [เพิ่มใหม่] ปิดแป้นพิมพ์เมื่อคลิกพื้นที่ว่างข้างนอก
            document.addEventListener('click', (event) => {
                // ถ้าจุดที่คลิก ไม่ได้อยู่ในกล่องแป้นพิมพ์ และ ไม่ใช่กล่อง Input ให้ทำการซ่อน
                if (!keyboardOverlay.contains(event.target) && event.target !== inputElement) {
                    keyboardOverlay.classList.remove("show");
                }
            });

            function onChange(input) {
                inputElement.value = input;
                inputElement.dispatchEvent(new Event('input'));
            }

            function onKeyPress(button) {
                if (btnSound) {
                    btnSound.currentTime = 0;
                    btnSound.volume = 0.5;
                    btnSound.play().catch(() => {});
                }

                if (button === "{shift}") handleShift();
                if (button === "{lang}") handleLanguage();
                if (button === "{enter}") keyboardOverlay.classList.remove("show");
            }

            function handleShift() {
                isShift = !isShift;
                updateLayout();
            }

            function handleLanguage() {
                currentLang = currentLang === 'en' ? 'th' : 'en';
                isShift = false;
                updateLayout();
            }

            function updateLayout() {
                let layoutName = currentLang + '-' + (isShift ? 'shift' : 'default');
                myKeyboard.setOptions({
                    layoutName: layoutName
                });
            }
        });
    </script>
</body>

</html>
