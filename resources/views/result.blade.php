<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Code Canvas</title>
    <link rel="icon" type="image/png" href="img/elements-frontend/logo-favicon.svg" />
    {{-- เชื่อม css --}}
    <link href="{{ asset('css/result.css') }}" rel="stylesheet">

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
            <img src="{{ asset('img/elements-frontend/grass-01.png') }}" alt="Grass01" />
        </div>
        <!-- end bg-grass -->

        <div class="bg-cloud">
            <img src="{{ asset('img/elements-frontend/cloud-01.png') }}" alt="Cloud01" />
        </div>
        <!-- end bg-cloud -->

        <div class="sec-head">
            <h1 class="challenge">
                <strong>นี่คือผลลัพธ์ “<span id="resultChallengeName">Challenge</span>”</strong><br>
                จากโค้ดที่คุณเขียนและจัดเรียง
            </h1>
            <a href="{{ route('game.home') }}">
                <img src="{{ asset('img/elements-frontend/logo-01.png') }}" alt="logo01" />
            </a>
        </div>
        <!-- end sec-head -->

        <div class="sec-content">
            <div class="sec-content-left">
                <div class="canvas">
                    <div class="frame-result"></div>

                    <div class="bt-restart">
                        <span class="iconify" data-icon="material-symbols:refresh-rounded"></span>
                    </div>
                    <img src="{{ asset('img/elements-frontend/wink-yellow-02.png') }}" class="wink-yellow"
                        alt="Wink">
                </div>
                <!-- end canvas -->
            </div>
            <!-- end sec-content-left -->

            <div class="sec-content-right">
                <div class="box-code"></div>
                <div class="bt-next"> <button class="next">ถัดไป</button>
                </div>
            </div>
            <!-- end sec-content-right -->
        </div>
        <!-- end sec-content -->

    </div>
    <!-- end container -->

    <!-- Script -->
    <script src="{{ asset('js/codeCanvas.js') }}?v={{ time() }}"></script>

    {{-- ✅ 1. เพิ่มแท็กเสียงสำหรับปุ่มถัดไปตรงนี้ครับ --}}
    <audio id="buttonSound">
        <source src="{{ asset('public/audio/button-sound.mp3') }}" type="audio/mpeg">
    </audio>

    {{-- ✅ เรียกใช้ไฟล์เสียงที่เราสร้างไว้ --}}
    @include('components.bg-music')
</body>

</html>
