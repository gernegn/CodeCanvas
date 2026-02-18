<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Code Canvas</title>
    <link rel="icon" type="image/png" href="img/elements-frontend/logo-favicon.svg" />
    {{-- เชื่อม css --}}
    <link href="{{ asset('css/random.css') }}" rel="stylesheet">

    <!-- Iconify CDN -->
    <script src="https://code.iconify.design/3/3.1.1/iconify.min.js"></script>

    <!-- IBM Font -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
        href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@100;200;300;400;500;600;700&display=swap"
        rel="stylesheet" />
</head>

<body>
    <div class="container">
        <div class="bg-grass">
            <img src="{{ asset('img/elements-frontend/grass-02.png') }}" alt="Grass02" />
        </div>
        <!-- end bg-grass -->

        <div class="bg-cloud">
            <img src="{{ asset('img/elements-frontend/cloud-01.png') }}" alt="Cloud02" />
        </div>
        <!-- end bg-cloud -->

        <div class="sec-head">
            <div class="btn-box">
                <button class="bt-back" onclick="window.location.href='{{ route('game.home') }}'">
                    <span class="iconify" data-icon="material-symbols:arrow-back-ios-rounded"></span>
                </button>
            </div>
            <h1 class="challenge">กระดานสุ่มโจทย์</h1>
            <a href="{{ route('game.home') }}">
                <img src="{{ asset('img/elements-frontend/logo-01.png') }}" alt="logo01" />
            </a>
        </div>
        <!-- end sec-head -->

        <div class="sec-content">
            <div class="challenge-random">
                <img src="{{ asset('img/elements-frontend/board-random.png') }}" alt="Board random" />
                <h1 class="text-random">???</h1>
            </div>
            <div class="btn-random-box">
                <button class="bt-random">
                    <span class="iconify" data-icon="fad:random-2dice"></span>
                    <span class="num-random">(2)</span>
                </button>
            </div>
        </div>
    </div>
    <div id="randomModal" class="modal">
        <div class="modal-content">
            <div class="close-modal">
                <span class="iconify" data-icon="material-symbols:close-rounded"></span>
            </div>
            <h1 class="popup-title">โจทย์ที่คุณได้คือ</h1>
            <h2 id="modalChallengeName">ชื่อโจทย์</h2>

            <div class="modal-img-box">
                <img id="modalOriginalImage" src="" alt="Original Image" />
            </div>

            <div class="modal-actions">
                <button id="btnGoToGame">เริ่มวาดเลย!</button>
            </div>
        </div>
    </div>
    <!-- end container -->

    <!-- Script -->
    <script src="{{ asset('js/codeCanvas.js') }}?v={{ time() }}"></script>

    {{-- ✅ 1. เพิ่มแท็กเสียงสำหรับตอนสุ่มโจทย์ --}}
    <audio id="randomSound" loop>
        <source src="{{ asset('public/audio/random-sound.mp3') }}" type="audio/mpeg">
    </audio>

    {{-- ✅ 1. เพิ่มแท็กเสียง Popup ตรงนี้ครับ --}}
    <audio id="popupSound">
        <source src="{{ asset('public/audio/popup-sound.mp3') }}" type="audio/mpeg">
    </audio>

    {{-- ✅ 1. เพิ่มแท็กเสียงสำหรับปุ่มในหน้านี้ --}}
    <audio id="buttonSound">
        <source src="{{ asset('public/audio/button-sound.mp3') }}" type="audio/mpeg">
    </audio>

    {{-- ✅ เรียกใช้ไฟล์เสียงที่เราสร้างไว้ --}}
    @include('components.bg-music')
</body>

</html>
