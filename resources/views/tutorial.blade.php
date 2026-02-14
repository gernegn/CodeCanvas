<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Code Canvas</title>
    <link rel="icon" type="image/png" href="img/elements-frontend/logo-favicon.svg" />
    {{-- เชื่อม css --}}
    <link href="{{ asset('css/tutorial.css') }}" rel="stylesheet">

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
            <img src="{{ asset('img/elements-frontend/cloud-02.png') }}" alt="Cloud01" />
            <img class="logo02-bg" src="{{ asset('img/elements-frontend/logo-02.png') }}" alt="logo02" />
        </div>
        <!-- end bg-cloud -->

        <div class="sec-head">
            <div class="btn-box">
                <button class="bt-back" onclick="window.location.href='{{ route('game.home') }}'">
                    <span class="iconify" data-icon="material-symbols:arrow-back-ios-rounded"></span>
                </button>
            </div>
            <h1 class="challenge">วิธีการเล่น</h1>
            <a href="{{ route('game.home') }}">
                <img src="{{ asset('img/elements-frontend/logo-01.png') }}" alt="logo01" />
            </a>
        </div>
        <!-- end sec-head -->

        <div class="sec-content">
            <div class="box-content">
                <div class="box-text">
                    <div class="tutorial-number">1</div>
                    <div class="tutorial-text">
                        สุ่มโจทย์สำหรับวาดภาพ (สามารถสุ่มโจทย์ได้ 2 ครั้ง)
                    </div>
                </div>
                <!-- ข้อ 1 -->

                <div class="box-text">
                    <div class="tutorial-number">2</div>
                    <div class="tutorial-text">
                        เลือกโค้ดจากกล่องคำสั่งโค้ด เพื่อบังคับทิศทาง<br />ของเส้นจนวาดภาพเสร็จ
                    </div>
                </div>
                <!-- ข้อ 2 -->

                <div class="box-text">
                    <div class="tutorial-number">3</div>
                    <div class="tutorial-text">
                        เมื่อวาดภาพเสร็จ ให้เลือกโค้ดคำสั่ง เพื่อตกแต่งภาพ
                    </div>
                </div>
                <!-- ข้อ 3 -->

                <div class="box-text">
                    <div class="tutorial-number">4</div>
                    <div class="tutorial-text">ดาวน์โหลดภาพที่เสร็จสมบูรณ์</div>
                </div>
                <!-- ข้อ 4 -->
            </div>
        </div>
    </div>

    <!-- Script -->
    <script src="{{ asset('js/codeCanvas.js') }}"></script>
</body>

</html>
