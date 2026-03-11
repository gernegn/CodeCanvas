<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Code Canvas</title>
    <link rel="icon" type="image/png" href="img/elements-frontend/logo-favicon.svg" />

    <link href="{{ asset('css/random.css') }}" rel="stylesheet">
    <script src="https://code.iconify.design/3/3.1.1/iconify.min.js"></script>

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
        href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@100;200;300;400;500;600;700&display=swap"
        rel="stylesheet" />
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
            <img src="{{ asset('img/elements-frontend/grass-02.png') }}" alt="Grass02" />
        </div>
        <div class="bg-cloud">
            <img src="{{ asset('img/elements-frontend/cloud-01.png') }}" alt="Cloud02" />
        </div>

        <div class="sec-head">
            <div class="btn-box">
                <button class="bt-back" onclick="window.location.href='{{ route('game.home') }}'">
                    <span class="iconify" data-icon="material-symbols:arrow-back-ios-rounded"></span>
                </button>
            </div>
            <h1 class="challenge">Random Challenge</h1>
            <a href="{{ route('game.home') }}">
                <img src="{{ asset('img/elements-frontend/logo-01.png') }}" alt="logo01" />
            </a>
        </div>

        <div class="sec-content">
            <div class="challenge-random">
                <img src="{{ asset('img/elements-frontend/board-mobile.png') }}" class="board-bg" alt="Board random" />

                {{-- ✅ 1. กล่องแสดงสถานะ กำลังโหลด/กำลังสุ่ม (ไอคอนหมุน + ข้อความ) --}}
                <div id="loadingOverlay" class="loading-overlay" style="display: flex;">
                    <div class="spinner-icon">
                        <span class="iconify" data-icon="line-md:loading-twotone-loop"></span>
                    </div>
                    <h1 class="text-loading-sub">Randomizing...</h1>
                </div>

                {{-- ✅ 2. กล่องแสดงผลลัพธ์หลังสุ่มเสร็จ --}}
                <div id="resultContainer" class="result-container" style="display: none;">
                    <img id="randomResultImage" src="" alt="Challenge Image" style="display: none;" />
                    <h1 id="randomResultText" class="text-random">Challenge</h1>
                </div>
            </div>

            {{-- ✅ 3. กล่องรวมปุ่ม (สุ่ม และ เริ่มวาด) --}}
            <div class="action-buttons">
                <div class="btn-random-box">
                    <button class="bt-random" id="btnRandomAction">
                        <span class="iconify" data-icon="fad:random-2dice"></span>
                        <span class="num-random">(2)</span>
                    </button>
                </div>

                {{-- ✅ ปุ่มเริ่มวาดเลย (แสดงตลอดแต่ปิดการกดไว้ก่อน) --}}
                <div class="btn-start-box btn-disabled" id="btnStartGameBox">
                    <button id="btnStartGameAction" class="bt-start-game" disabled>
                        Start Drawing!
                    </button>
                </div>
            </div>
        </div>
    </div>

    <script src="{{ asset('js/codeCanvas.js') }}?v={{ time() }}"></script>

    <audio id="randomSound" loop>
        <source src="{{ asset('audio/random-sound.mp3') }}" type="audio/mpeg">
    </audio>
    <audio id="popupSound">
        <source src="{{ asset('audio/popup-sound.mp3') }}" type="audio/mpeg">
    </audio>
    <audio id="buttonSound">
        <source src="{{ asset('audio/button-sound.mp3') }}" type="audio/mpeg">
    </audio>

    @include('components.bg-music')
</body>

</html>
