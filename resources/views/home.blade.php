<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Code Canvas</title>
    <link rel="icon" type="image/png" href="img/elements-frontend/logo-favicon.svg" />

    {{-- เชื่อม css --}}
    <link href="{{ asset('css/home.css') }}" rel="stylesheet">

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
            <img src="{{ asset('img/elements-frontend/grass-03.png') }}" alt="Grass02" />
        </div>
        <div class="bg-cloud">
            <img src="{{ asset('img/elements-frontend/cloud-02.png') }}" alt="cloud" />
        </div>
        <div class="bg-wink">
            <img src="{{ asset('img/elements-frontend/wink.png') }}" alt="wink" />
        </div>
        <div class="sec-head">
            <div class="btn-box">
                <button class="bt-tutorial" onclick="window.location.href='{{ route('game.tutorial') }}'">
                    <div class="icon-tutorial">
                        <span class="iconify" data-icon="material-symbols:info-rounded"></span>
                    </div>
                    <span class="bt-text">วิธีการเล่น</span>
                </button>
            </div>
        </div>
        <div class="sec-content">
            <div class="box-content-main">
                <div class="box-board">
                    <img src="{{ asset('img/elements-frontend/board-main.png') }}" alt="" />
                </div>

                <div class="box-main">
                    <div class="box-logo-main">
                        <img src="{{ asset('img/elements-frontend/logo-01.png') }}" alt="" />
                    </div>

                    <div class="box-tagline">
                        <p>Turn Code into Art</p>
                    </div>

                    <div class="box-button">
                        <div class="btn-main-box">
                            <button class="bt-play" onclick="window.location.href='{{ route('game.random') }}'">
                                เริ่มเกมเลย!
                            </button>
                        </div>

                        <div class="btn-main-box">
                            <button class="bt-gallery" onclick="window.location.href='{{ route('game.gallery') }}'">
                                <span class="iconify" data-icon="fluent:draw-image-24-regular"></span>
                                คลังภาพวาด
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="{{ asset('js/codeCanvas.js') }}?v={{ time() }}"></script>

    {{-- ✅ 1. เพิ่มแท็กเสียงสำหรับปุ่มทั่วไปในหน้า Home --}}
    <audio id="buttonSound">
        <source src="{{ asset('public/audio/button-sound.mp3') }}" type="audio/mpeg">
    </audio>

    {{-- ✅ เรียกใช้ไฟล์เสียงที่เราสร้างไว้ --}}
    @include('components.bg-music')
</body>

</html>
