<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>Code Canvas</title>
    <link rel="icon" type="image/png" href="img/elements-frontend/logo-favicon.svg" />

    {{-- ✅ เชื่อม css ไฟล์เดียว จบครบทุกอย่าง --}}
    <link href="{{ asset('css/custom.css') }}?v={{ time() }}" rel="stylesheet">

    <script src="https://code.iconify.design/3/3.1.1/iconify.min.js"></script>

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
        href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@100;200;300;400;500;600;700&display=swap"
        rel="stylesheet" />

    <link href="https://fonts.googleapis.com/css2?family=Sriracha&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/simple-keyboard@latest/build/css/index.css">
</head>

<body>
    <div class="container">
        <div class="anim-bg-container">
            <img src="{{ asset('img/elements-frontend/cloud-white.png') }}" class="anim-cloud cloud-1" alt="cloud">
            <img src="{{ asset('img/elements-frontend/cloud-light.png') }}" class="anim-cloud cloud-2" alt="cloud">
            <img src="{{ asset('img/elements-frontend/cloud-medium.png') }}" class="anim-cloud cloud-3" alt="cloud">
            <img src="{{ asset('img/elements-frontend/cloud-dark.png') }}" class="anim-cloud cloud-4" alt="cloud">

            <img src="{{ asset('img/elements-frontend/1clover.png') }}" class="anim-leaf leaf-1" alt="leaf">
            <img src="{{ asset('img/elements-frontend/1clover.png') }}" class="anim-leaf leaf-2" alt="leaf">
            <img src="{{ asset('img/elements-frontend/1clover.png') }}" class="anim-leaf leaf-3" alt="leaf">
            <img src="{{ asset('img/elements-frontend/1clover.png') }}" class="anim-leaf leaf-4" alt="leaf">
        </div>

        <div class="bg-grass">
            <img src="{{ asset('img/elements-frontend/grass-01.png') }}" alt="Grass01" />
        </div>
        <div class="bg-cloud">
            <img src="{{ asset('img/elements-frontend/cloud-01.png') }}" alt="Cloud01" />
        </div>
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
        <div class="sec-content">
            <div class="sec-content-left">
                <div class="canvas">
                    <img src="{{ asset('img/elements-frontend/wink-yellow-02.png') }}" class="wink-yellow-01"
                        alt="Wink">
                    <div class="frame-result-radius">
                        <div id="imageLoader" class="image-loader">
                            <span class="iconify" data-icon="bx:loader-alt"></span>
                        </div>

                        <img id="customResultImg" src="" class="box-result-img" alt="Result Image">
                    </div>
                    <img src="{{ asset('img/elements-frontend/wink-yellow-02.png') }}" class="wink-yellow-02"
                        alt="Wink">
                </div>
            </div>
            <div class="sec-content-right">
                <div class="box-custom">
                    {{-- 1. ส่วนกรอกชื่อ --}}
                    <div class="custom-name">
                        <div class="topic-name">
                            <span class="iconify" data-icon="material-symbols:draw"></span>
                            <p>addName()</p>
                        </div>

                        <div class="input-group-name">
                            <input type="text" id="userNameInput" placeholder="กรอกชื่อของคุณ" readonly>
                            <button id="btnRandomName" class="btn-random-name" type="button">
                                <span class="iconify" data-icon="fad:random-2dice"></span>
                                สุ่ม
                            </button>
                        </div>

                        <p id="nameLimitAlert" class="limit-alert"
                            style="display: block; color: #777; font-size: 1.1rem; font-weight: 500; margin-top: 0.1rem;">
                            * ใส่ชื่อได้ไม่เกิน 20 ตัวอักษร
                        </p>
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
        </div>
    </div>

    <div id="customSuccessModal" class="custom-modal-overlay">
        <div class="custom-modal-container">

            <img src="{{ asset('img/elements-frontend/wink-yellow-01.png') }}" class="star-decor-img star-top-left"
                alt="star">
            <img src="{{ asset('img/elements-frontend/wink-yellow-01.png') }}" class="star-decor-img star-top-right"
                alt="star">

            <div class="modal-header-text">
                <h2>ยินดีด้วย นี่คือภาพ</h2>
                <h1 id="successNameDisplay" class="text-success">สำเร็จแล้ว!</h1>
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
            ไปดูคลังภาพวาด
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

    <script src="{{ asset('js/codeCanvas.js') }}?v={{ time() }}"></script>

    <script src="https://cdn.jsdelivr.net/npm/simple-keyboard@latest/build/index.js"></script>

    <audio id="popupSound">
        <source src="{{ asset('audio/popup-sound.mp3') }}" type="audio/mpeg">
    </audio>

    {{-- ✅ เพิ่มแท็กเสียงสำหรับปุ่มในหน้านี้ --}}
    <audio id="buttonSound">
        <source src="{{ asset('audio/button-sound.mp3') }}" type="audio/mpeg">
    </audio>

    {{-- ✅ เรียกใช้ไฟล์เสียงที่เราสร้างไว้ --}}
    @include('components.bg-music')

    <script>
        document.addEventListener('DOMContentLoaded', function() {

            // ✅ ระบบตรวจจับภาพโหลดเสร็จแล้วค่อย Fade in
            const mainImg = document.getElementById("customResultImg");
            const imgLoader = document.getElementById("imageLoader");

            if (mainImg) {
                mainImg.addEventListener("load", function() {
                    this.classList.add("loaded-fade");
                    if (imgLoader) imgLoader.style.display = "none";
                });

                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.attributeName === "src") {
                            mainImg.classList.remove("loaded-fade");
                            if (imgLoader) imgLoader.style.display = "flex";
                        }
                    });
                });
                observer.observe(mainImg, {
                    attributes: true
                });

                if (mainImg.complete && mainImg.getAttribute('src')) {
                    mainImg.classList.add("loaded-fade");
                    if (imgLoader) imgLoader.style.display = "none";
                }
            }

            const Keyboard = window.SimpleKeyboard.default;
            const inputElement = document.getElementById("userNameInput");
            const btnRandomName = document.getElementById("btnRandomName");
            const keyboardOverlay = document.getElementById("keyboardOverlay");
            const closeKeyboardBtn = document.getElementById("closeKeyboardBtn");
            const btnSound = document.getElementById('buttonSound');
            const alertElement = document.getElementById("nameLimitAlert");

            let currentLang = 'th';
            let isShift = false;

            const myKeyboard = new Keyboard({
                onChange: input => {
                    const maxLength = 20;

                    if (input.length > maxLength) {
                        const truncatedInput = input.substring(0, maxLength);
                        myKeyboard.setInput(truncatedInput);
                        inputElement.value = truncatedInput;

                        if (alertElement) {
                            alertElement.style.color = "#FF4D4D";
                            alertElement.innerText = "โอ๊ะ! คุณพิมพ์ชื่อยาวเกิน 20 ตัวอักษรแล้วนะ";
                        }
                    } else {
                        inputElement.value = input;

                        if (alertElement) {
                            alertElement.style.color = "#777";
                            alertElement.innerText = "* ใส่ชื่อได้ไม่เกิน 20 ตัวอักษร";
                        }
                    }
                    inputElement.dispatchEvent(new Event('input'));
                },
                onKeyPress: button => onKeyPress(button),
                layoutName: 'th-default',
                layout: {
                    'en-default': [
                        '1 2 3 4 5 6 7 8 9 0 {bksp}',
                        'q w e r t y u i o p',
                        'a s d f g h j k l',
                        '{shift} z x c v b n m {enter}',
                        '{lang} {space}'
                    ],
                    'en-shift': [
                        '1 2 3 4 5 6 7 8 9 0 {bksp}',
                        'Q W E R T Y U I O P',
                        'A S D F G H J K L',
                        '{shift} Z X C V B N M {enter}',
                        '{lang} {space}'
                    ],
                    'th-default': [
                        'ๅ ภ ถ ุ ค ต จ ข ช ฅ {bksp}',
                        'ๆ ไ ำ พ ะ ั ี ร น ย บ ล ฃ',
                        'ฟ ห ก ด เ ้ ่ า ส ว ง',
                        '{shift} ผ ป แ อ ิ ื ท ม ใ ฝ {enter}',
                        '{lang} {space}'
                    ],
                    'th-shift': [
                        '๑ ๒ ๓ ๔ ๕ ๖ ๗ ๘ ๙ ๐ {bksp}',
                        'ฎ ฑ ธ ํ ๊ ณ ฯ ญ ฐ ฅ',
                        'ฤ ฆ ฏ โ ฌ ็ ๋ ษ ศ ซ',
                        '{shift} ฉ ฮ ์ ฒ ฬ ฦ {enter}',
                        '{lang} {space}'
                    ]
                },
                display: {
                    '{bksp}': 'ลบ',
                    '{enter}': 'ตั้งชื่อ',
                    '{shift}': 'Shift',
                    '{space}': 'Spacebar (เว้นวรรค)',
                    '{lang}': '🌐 เปลี่ยนภาษา'
                }
            });

            inputElement.addEventListener("click", (e) => {
                keyboardOverlay.classList.add("show");
                myKeyboard.setInput(inputElement.value);
            });

            closeKeyboardBtn.addEventListener("click", () => {
                keyboardOverlay.classList.remove("show");
            });

            document.addEventListener('click', (event) => {
                if (keyboardOverlay.classList.contains('show') &&
                    !keyboardOverlay.contains(event.target) &&
                    event.target !== inputElement &&
                    event.target !== btnRandomName &&
                    !btnRandomName.contains(event.target)) {
                    keyboardOverlay.classList.remove("show");
                }
            });

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

            if (btnRandomName) {
                btnRandomName.addEventListener("click", () => {
                    if (btnSound) {
                        btnSound.currentTime = 0;
                        btnSound.volume = 0.5;
                        btnSound.play().catch(() => {});
                    }

                    const adjsTh = ["น้อง", "พี่", "ยอดนัก", "จิ๋ว", "ซ่า", "แฮปปี้", "ซุปเปอร์", "กัปตัน",
                        "เจ้า", "นักรบ"
                    ];
                    const nounsTh = ["โค้ด", "แมวเหมียว", "ชาไข่มุก", "สายฟ้า", "ก้อนเมฆ", "หมูเด้ง",
                        "แซลมอน", "อวกาศ", "เต่าบิน"
                    ];

                    const adjsEn = ["Super", "Mega", "Happy", "Cyber", "Pixel", "Ninja", "Cosmic", "Lazy",
                        "Crazy"
                    ];
                    const nounsEn = ["Coder", "Cat", "Buddy", "Hacker", "Star", "Rocket", "Dog", "Panda",
                        "Gamer"
                    ];

                    let pickedName = "";

                    if (Math.random() > 0.5) {
                        const adj = adjsTh[Math.floor(Math.random() * adjsTh.length)];
                        const noun = nounsTh[Math.floor(Math.random() * nounsTh.length)];
                        pickedName = adj + noun;
                    } else {
                        const adj = adjsEn[Math.floor(Math.random() * adjsEn.length)];
                        const noun = nounsEn[Math.floor(Math.random() * nounsEn.length)];
                        pickedName = adj + noun;
                    }

                    pickedName = pickedName.substring(0, 20);
                    inputElement.value = pickedName;
                    myKeyboard.setInput(pickedName);

                    if (alertElement) {
                        alertElement.style.color = "#777";
                        alertElement.innerText = "* ใส่ชื่อได้ไม่เกิน 20 ตัวอักษร";
                    }

                    inputElement.dispatchEvent(new Event('input'));
                });
            }
        });
    </script>
</body>

</html>
