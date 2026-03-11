<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Code Canvas</title>
    <link rel="icon" type="image/png" href="img/elements-frontend/logo-favicon.svg" />
    {{-- เชื่อม css --}}
    <link href="{{ asset('css/main-game.css') }}?v={{ time() }}" rel="stylesheet">

    <!-- Iconify CDN -->
    <script src="https://code.iconify.design/3/3.1.1/iconify.min.js"></script>

    <!-- IBM Font -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
        href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@100;200;300;400;500;600;700&display=swap"
        rel="stylesheet" />

    <meta name="csrf-token" content="{{ csrf_token() }}">
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
        <!-- end bg-grass -->

        <div class="bg-cloud">
            <img src="{{ asset('img/elements-frontend/cloud-01.png') }}" alt="Cloud01" />
        </div>
        <!-- end bg-cloud -->

        <div class="sec-head">
            <div class="btn-box">
                <button class="bt-back" onclick="window.location.href='{{ route('game.random') }}'">
                    <span class="iconify" data-icon="material-symbols:arrow-back-ios-rounded"></span>
                </button>
            </div>
            <h1 class="challenge">Challenge</h1>
            <a href="{{ route('game.home') }}">
                <img src="{{ asset('img/elements-frontend/logo-01.png') }}" alt="logo01" />
            </a>
        </div>
        <!-- end sec-head -->

        <div class="sec-content">
            <div class="sec-content-left">
                <div class="canvas">
                    <canvas id="gameCanvas"></canvas>

                    {{-- วงกลมบอกเปอร์เซ็นต์ (วงสีแดง) --}}
                    <div id="progressCircle" class="progress-circle">
                        <div class="inner-circle">0%</div>
                    </div>

                    {{-- กล่องข้อความให้กำลังใจ (แสดงเหนือเปอร์เซ็นต์) --}}
                    <div id="cheerTooltip" class="cheer-tooltip">อีกนิดเดียว คุณทำได้ !</div>

                    {{-- กล่องข้อความแจ้งเตือนเดินผิด (วงสีฟ้า) --}}
                    <div id="errorTooltip" class="error-tooltip">เอ๊ะ มีอะไรผิดพลาดไหมนะ?</div>

                    <div class="bt-options">
                        <div class="bt-undo">
                            <span class="iconify" data-icon="pajamas:go-back"></span>
                        </div>
                        <div class="bt-redo">
                            <span class="iconify" data-icon="pajamas:go-back" data-flip="horizontal"></span>
                        </div>
                        <div class="bt-reset">
                            <button class="reset">Reset</button>
                        </div>
                    </div>
                </div>
                <!-- end canvas -->

                <div class="code-box"></div>
                <!-- end code-box -->
            </div>
            <!-- end sec-content-left -->

            <div class="sec-content-right">
                <div class="example-img">
                    <div class="frame-box">
                        <div class="frame-img"></div>
                    </div>
                </div>
                <!-- end example-img -->

                <div class="bt-command">
                    <div class="bt-code-grid">
                        <div class="bt-item bt-forward-item">
                            <span class="badge forward-badge" style="display:none;">0</span>
                            <button class="forward">forward()</button>
                            <img class="forward-img" src="{{ asset('img/elements-frontend/forward.png') }}"
                                alt="forward">
                        </div>

                        <div class="bt-item bt-left-item">
                            <span class="badge left-badge" style="display:none;">0°</span>
                            <img src="{{ asset('img/elements-frontend/moveLeft.png') }}" alt="moveLeft">
                            <button class="moveleft">moveLeft()</button>
                        </div>

                        <div class="bt-item bt-right-item">
                            <span class="badge right-badge" style="display:none;">0°</span>
                            <img src="{{ asset('img/elements-frontend/moveRight.png') }}" alt="moveRight">
                            <button class="moveright">moveRight()</button>
                        </div>
                    </div>

                    <div class="bt-run-container">
                        <button class="run"
                            style="display: flex; align-items: center; justify-content: center; gap: 5px;">
                            <span class="iconify" data-icon="material-symbols:play-arrow-rounded"
                                style="font-size: 3rem;"></span>
                            RUN
                        </button>
                    </div>
                </div>
                <!-- end bt-command -->
            </div>
            <!-- end sec-content-right -->
        </div>
        <!-- end sec-content -->
    </div>
    <!-- end container -->

    <!-- Popup -->
    {{-- <div id="tutorialModal" class="tutorial-overlay">
        <div class="tutorial-box">
            <span class="iconify close-tutorial" data-icon="material-symbols:close-rounded"></span>

            <h2 class="tutorial-title">เตรียมตัวก่อนเริ่ม</h2>

            <div class="slider-container">
                <button class="slider-btn prev-btn" onclick="changeSlide(-1)">
                    <span class="iconify" data-icon="material-symbols:arrow-forward-ios-rounded"
                        data-flip="horizontal"></span>
                </button>

                <div class="slider-wrapper">
                    <img src="{{ asset('img/elements-frontend/tutorial-1.png') }}" class="tutorial-slide active"
                        alt="Step 1">
                    <img src="{{ asset('img/elements-frontend/tutorial-2.png') }}" class="tutorial-slide"
                        alt="Step 2">
                    <img src="{{ asset('img/elements-frontend/tutorial-3.png') }}" class="tutorial-slide"
                        alt="Step 3">
                    <img src="{{ asset('img/elements-frontend/tutorial-4.png') }}" class="tutorial-slide"
                        alt="Step 4">
                </div>

                <button class="slider-btn next-btn" onclick="changeSlide(1)">
                    <span class="iconify" data-icon="material-symbols:arrow-forward-ios-rounded"></span>
                </button>
            </div>

            <div class="pagination-dots">
                <span class="dot active" onclick="currentSlide(1)"></span>
                <span class="dot" onclick="currentSlide(2)"></span>
                <span class="dot" onclick="currentSlide(3)"></span>
                <span class="dot" onclick="currentSlide(4)"></span>
            </div>
        </div>
    </div> --}}

    <div id="tutorialDarkOverlay" class="tutorial-dark-overlay" style="display: none;"></div>

    <div id="tutorialBubble" class="tutorial-bubble" style="display: none;">
        <p id="tutorialText">ข้อความสอนเล่น</p>
    </div>

    <button id="btnSkipTutorial" class="btn-skip-tutorial" style="display: none;">
        ข้ามการสอน <span class="iconify" data-icon="material-symbols:fast-forward-rounded"></span>
    </button>

    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="{{ asset('js/codeCanvas.js') }}?v={{ time() }}"></script>

    {{-- ✅ เพิ่มแท็กเสียง Success Sound สำหรับตอนวาดถูก --}}
    <audio id="successSound">
        <source src="{{ asset('audio/success-sound.mp3') }}" type="audio/mpeg">
    </audio>

    {{-- ✅ เพิ่มแท็กเสียง Command Sound ตรงนี้ครับ --}}
    <audio id="commandSound">
        <source src="{{ asset('audio/command-sound.mp3') }}" type="audio/mpeg">
    </audio>

    {{-- ✅ เพิ่มแท็กเสียง Undo/Redo ตรงนี้ครับ --}}
    <audio id="undoRedoSound">
        <source src="{{ asset('audio/undo-redo-sound.mp3') }}" type="audio/mpeg">
    </audio>

    {{-- ✅ เพิ่มแท็กเสียงสำหรับปุ่ม RUN ตรงนี้ครับ --}}
    <audio id="buttonSound">
        <source src="{{ asset('audio/button-sound.mp3') }}" type="audio/mpeg">
    </audio>

    {{-- ✅ เพิ่มแท็กเสียงสำหรับปุ่ม Reset ตรงนี้ครับ --}}
    <audio id="resetSound">
        <source src="{{ asset('audio/reset-sound.mp3') }}" type="audio/mpeg">
    </audio>

    {{-- ✅ เรียกใช้ไฟล์เสียงที่เราสร้างไว้ --}}
    @include('components.bg-music')
</body>

</html>
